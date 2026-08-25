import { supabase } from '../lib/supabase';

export interface AttendanceTrendPoint {
  eventTitle: string;
  eventDate: string;
  attendeeCount: number;
}

export async function getAttendanceTrend(orgId: string, limit = 12): Promise<AttendanceTrendPoint[]> {
  const [eventResults, scheduleResults] = await Promise.all([
    supabase
      .from('events')
      .select('title, start_time, attendance_sessions(attendance_logs(id))')
      .eq('org_id', orgId)
      .order('start_time', { ascending: false })
      .limit(limit),
    supabase
      .from('attendance_sessions')
      .select('session_date, church_schedules!inner(title, org_id), attendance_logs(id)')
      .eq('church_schedules.org_id', orgId)
      .not('schedule_id', 'is', null)
      .order('session_date', { ascending: false })
      .limit(limit),
  ]);

  if (eventResults.error) throw eventResults.error;
  if (scheduleResults.error) throw scheduleResults.error;

  const fromEvents: AttendanceTrendPoint[] = (eventResults.data ?? []).map((event: any) => ({
    eventTitle: event.title,
    eventDate: event.start_time,
    attendeeCount: (event.attendance_sessions ?? []).reduce(
      (sum: number, session: any) => sum + (session.attendance_logs?.length ?? 0),
      0
    ),
  }));

  const fromSchedules: AttendanceTrendPoint[] = (scheduleResults.data ?? []).map((s: any) => ({
    eventTitle: s.church_schedules.title,
    eventDate: s.session_date,
    attendeeCount: s.attendance_logs?.length ?? 0,
  }));

  // Merge both sources, sort by date, keep only the most recent `limit` overall
  const combined = [...fromEvents, ...fromSchedules]
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
    .slice(0, limit)
    .reverse(); // oldest → newest for the chart

  return combined;
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

  const uniqueActiveUsers = new Set([
    ...(eventLogs.data ?? []).map((log: any) => log.user_id),
    ...(scheduleLogs.data ?? []).map((log: any) => log.user_id),
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

  const results: GroupBreakdown[] = [];

  for (const group of groups ?? []) {
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