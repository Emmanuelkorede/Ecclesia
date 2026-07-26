import { supabase } from '../lib/supabase';

export interface AttendanceTrendPoint {
  eventTitle: string;
  eventDate: string;
  attendeeCount: number;
}

// One row per event, with a count of how many people checked in —
// this is what feeds AttendanceLineChart
export async function getAttendanceTrend(orgId: string, limit = 12): Promise<AttendanceTrendPoint[]> {
  const { data, error } = await supabase
    .from('events')
    .select('title, start_time, attendance_sessions(attendance_logs(id))')
    .eq('org_id', orgId)
    .order('start_time', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((event: any) => ({
    eventTitle: event.title,
    eventDate: event.start_time,
    attendeeCount: (event.attendance_sessions ?? []).reduce(
      (sum: number, session: any) => sum + (session.attendance_logs?.length ?? 0),
      0
    ),
  })).reverse(); // oldest → newest, better for a line chart's x-axis
}

export interface RetentionSummary {
  totalMembers: number;
  activeLast30Days: number;
  inactiveLast30Days: number;
}

// Active = checked in to at least one event in the last 30 days
export async function getRetentionSummary(orgId: string): Promise<RetentionSummary> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { count: totalMembers, error: membersError } = await supabase
    .from('memberships')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId)
    .eq('status', 'active');

  if (membersError) throw membersError;

  const { data: recentLogs, error: logsError } = await supabase
    .from('attendance_logs')
    .select('user_id, attendance_sessions!inner(event_id, events!inner(org_id))')
    .gte('timestamp', thirtyDaysAgo)
    .eq('attendance_sessions.events.org_id', orgId);

  if (logsError) throw logsError;

  const uniqueActiveUsers = new Set((recentLogs ?? []).map((log: any) => log.user_id));
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

// Attendance count per group, for RetentionBarChart's per-ministry view
export async function getAttendanceByGroup(orgId: string): Promise<GroupBreakdown[]> {
  const { data, error } = await supabase
    .from('groups')
    .select('name, events(attendance_sessions(attendance_logs(id)))')
    .eq('org_id', orgId);

  if (error) throw error;

  return (data ?? []).map((group: any) => ({
    groupName: group.name,
    attendeeCount: (group.events ?? []).reduce(
      (sum: number, event: any) =>
        sum + (event.attendance_sessions ?? []).reduce(
          (s: number, session: any) => s + (session.attendance_logs?.length ?? 0),
          0
        ),
      0
    ),
  }));
}