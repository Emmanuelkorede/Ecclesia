import { supabase } from '../lib/supabase';

export interface AttendanceTrendPoint {
  label: string;
  date: string;
  attendeeCount: number;
}

interface RecurringSessionRecord {
  session_date: string;
  attendance_logs: { id: string }[] | null;
}

interface EventSessionRecord {
  title: string;
  start_time: string;
  attendance_sessions: {
    attendance_logs: { id: string }[] | null;
  }[] | null;
}

interface UserLogRecord {
  user_id: string;
}

interface GroupRecord {
  id: string;
  name: string;
}

// One program at a time — trends a SINGLE recurring schedule item across
// its recent dated occurrences, so the line chart is meaningful (comparing
// the same program week over week, not mixing different programs together)
export async function getRecurringTrend(scheduleId: string, limit = 12): Promise<AttendanceTrendPoint[]> {
  const { data, error } = await supabase
    .from('attendance_sessions')
    .select('session_date, attendance_logs(id)')
    .eq('schedule_id', scheduleId)
    .order('session_date', { ascending: false })
    .limit(limit);

  if (error) throw error;

  const typedData = (data ?? []) as unknown as RecurringSessionRecord[];

  return typedData
    .map((s) => ({
      label: s.session_date,
      date: s.session_date,
      attendeeCount: s.attendance_logs?.length ?? 0,
    }))
    .reverse();
}

// All custom (one-off) events, compared side by side — no single trend
// line implied, since each event is unrelated to the others
export async function getCustomEventComparison(orgId: string, limit = 12): Promise<AttendanceTrendPoint[]> {
  const { data, error } = await supabase
    .from('events')
    .select('title, start_time, attendance_sessions(attendance_logs(id))')
    .eq('org_id', orgId)
    .order('start_time', { ascending: false })
    .limit(limit);

  if (error) throw error;

  const typedData = (data ?? []) as unknown as EventSessionRecord[];

  return typedData
    .map((e) => ({
      label: e.title,
      date: e.start_time,
      attendeeCount: (e.attendance_sessions ?? []).reduce(
        (sum, session) => sum + (session.attendance_logs?.length ?? 0),
        0
      ),
    }))
    .reverse();
}

export interface RetentionSummary {
  totalMembers: number;
  activeLast30Days: number;
  inactiveLast30Days: number;
}

export async function getRetentionSummary(orgId: string): Promise<RetentionSummary> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { count: totalMembers, error: membersError } = await supabase
    .from('memberships')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId)
    .eq('status', 'active');

  if (membersError) throw membersError;

  const [eventLogs, scheduleLogs] = await Promise.all([
    supabase
      .from('attendance_logs')
      .select('user_id, attendance_sessions!inner(event_id, events!inner(org_id))')
      .gte('timestamp', thirtyDaysAgo)
      .eq('attendance_sessions.events.org_id', orgId),
    supabase
      .from('attendance_logs')
      .select('user_id, attendance_sessions!inner(schedule_id, church_schedules!inner(org_id))')
      .gte('timestamp', thirtyDaysAgo)
      .eq('attendance_sessions.church_schedules.org_id', orgId),
  ]);

  if (eventLogs.error) throw eventLogs.error;
  if (scheduleLogs.error) throw scheduleLogs.error;

  const typedEventLogs = (eventLogs.data ?? []) as unknown as UserLogRecord[];
  const typedScheduleLogs = (scheduleLogs.data ?? []) as unknown as UserLogRecord[];

  const uniqueActiveUsers = new Set([
    ...typedEventLogs.map((log) => log.user_id),
    ...typedScheduleLogs.map((log) => log.user_id),
  ]);
  const activeLast30Days = uniqueActiveUsers.size;

  return {
    totalMembers: totalMembers ?? 0,
    activeLast30Days,
    inactiveLast30Days: (totalMembers ?? 0) - activeLast30Days,
  };
}

export interface GroupBreakdown {
  groupName: string;
  attendeeCount: number;
}

export async function getAttendanceByGroup(orgId: string): Promise<GroupBreakdown[]> {
  const { data: groups, error: groupsError } = await supabase
    .from('groups')
    .select('id, name')
    .eq('org_id', orgId);

  if (groupsError) throw groupsError;

  const typedGroups = (groups ?? []) as unknown as GroupRecord[];
  const results: GroupBreakdown[] = [];

  for (const group of typedGroups) {
    const [eventLogs, scheduleLogs] = await Promise.all([
      supabase
        .from('attendance_logs')
        .select('id, attendance_sessions!inner(events!inner(group_id))')
        .eq('attendance_sessions.events.group_id', group.id),
      supabase
        .from('attendance_logs')
        .select('id, attendance_sessions!inner(church_schedules!inner(group_id))')
        .eq('attendance_sessions.church_schedules.group_id', group.id),
    ]);

    const count = (eventLogs.data?.length ?? 0) + (scheduleLogs.data?.length ?? 0);
    results.push({ groupName: group.name, attendeeCount: count });
  }

  return results;
}