import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';
import { generatePasscode, generateQrToken } from '../utils/attendacneHelpers';

type AttendanceSession = Database['public']['Tables']['attendance_sessions']['Row'];
type AttendanceLog = Database['public']['Tables']['attendance_logs']['Row'];
type CheckInMethod = Database['public']['Enums']['check_in_method'];

interface CreateSessionPayload {
  eventId: string;
  createdBy: string;
  expiresInMinutes?: number; // defaults to 15
  methodAllowed?: CheckInMethod[];
}

export async function createAttendanceSession(payload: CreateSessionPayload): Promise<AttendanceSession> {
  const expiresAt = new Date(Date.now() + (payload.expiresInMinutes ?? 15) * 60_000).toISOString();

  const { data, error } = await supabase
    .from('attendance_sessions')
    .insert({
      event_id: payload.eventId,
      passcode: generatePasscode(),
      qr_token: generateQrToken(),
      method_allowed: payload.methodAllowed ?? ['code', 'qr', 'manual'],
      expires_at: expiresAt,
      status: 'active',
      created_by: payload.createdBy,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getActiveSessionForEvent(eventId: string): Promise<AttendanceSession | null> {
  const { data, error } = await supabase
    .from('attendance_sessions')
    .select('*')
    .eq('event_id', eventId)
    .eq('status', 'active')
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function closeSession(sessionId: string): Promise<void> {
  const { error } = await supabase
    .from('attendance_sessions')
    .update({ status: 'closed' })
    .eq('id', sessionId);

  if (error) throw error;
}

// Member self check-in via passcode — validates the code matches an active,
// non-expired session before inserting. Group-restriction is enforced by
// RLS on attendance_logs (checked server-side regardless of this check).

function toFriendlyCheckInError(error: any): Error {
  const message = error?.message ?? '';
  if (error?.code === '42501' || message.includes('row-level security')) {
    return new Error("You're not eligible to check in to this event. It may be restricted to a specific group.");
  }
  return error instanceof Error ? error : new Error(message || 'Check-in failed.');
}



export async function checkInWithCode(passcode: string, userId: string): Promise<AttendanceLog> {
  const { data: session, error: sessionError } = await supabase
    .from('attendance_sessions')
    .select('*')
    .eq('passcode', passcode)
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (sessionError) throw sessionError;
  if (!session) throw new Error('Invalid or expired code.');

  const { data, error } = await supabase
    .from('attendance_logs')
    .insert({ session_id: session.id, user_id: userId, check_in_method: 'code' })
    .select()
    .single();

  if (error) throw toFriendlyCheckInError(error);
  return data;
}


// Member self check-in via QR scan
export async function checkInWithQr(qrToken: string, userId: string): Promise<AttendanceLog> {
  const { data: session, error: sessionError } = await supabase
    .from('attendance_sessions')
    .select('*')
    .eq('qr_token', qrToken)
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (sessionError) throw sessionError;
  if (!session) throw new Error('Invalid or expired QR code.');

  const { data, error } = await supabase
    .from('attendance_logs')
    .insert({ session_id: session.id, user_id: userId, check_in_method: 'qr' })
    .select()
    .single();

  if (error) throw toFriendlyCheckInError(error);
  return data;
}

// Admin manual override — checks a specific member in on their behalf
export async function manualCheckIn(sessionId: string, userId: string, adminId: string): Promise<AttendanceLog> {
  const { data, error } = await supabase
    .from('attendance_logs')
    .insert({ session_id: sessionId, user_id: userId, check_in_method: 'manual', checked_in_by: adminId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getLogsForSession(sessionId: string) {
  const { data, error } = await supabase
    .from('attendance_logs')
    .select('*, profile:profiles!attendance_logs_user_id_fkey(*)')
    .eq('session_id', sessionId);

  if (error) throw error;
  return data ?? [];
}
// Member's own attendance history — used by MyAttendancePage later
export async function getMyAttendanceLogs(userId: string) {
  const { data, error } = await supabase
    .from('attendance_logs')
    .select('*, attendance_sessions(event_id, events(title, start_time))')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getActiveSessionsForOrg(orgId: string) {
  const { data, error } = await supabase
    .from('attendance_sessions')
    .select('*, events!inner(title, org_id, group_id)')
    .eq('events.org_id', orgId)
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString());

  if (error) throw error;
  return data ?? [];
}

export async function hasUserCheckedIn(sessionId: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('attendance_logs')
    .select('id')
    .eq('session_id', sessionId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

export async function getEligibleActiveSessionsForUser(orgId: string, userId: string) {
  const sessions = await getActiveSessionsForOrg(orgId);

  // Get this user's group memberships once, up front
  const { data: userGroups, error } = await supabase
    .from('group_members')
    .select('group_id')
    .eq('user_id', userId);

  if (error) throw error;
  const userGroupIds = new Set((userGroups ?? []).map((g) => g.group_id));

  // Keep sessions where the event has no group restriction, OR the
  // restriction matches a group this user actually belongs to.
  return sessions.filter((s: any) => {
    const groupId = s.events?.group_id;
    return !groupId || userGroupIds.has(groupId);
  });
}


export async function getAnySessionForEvent(eventId: string) {
  const { data, error } = await supabase
    .from('attendance_sessions')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}