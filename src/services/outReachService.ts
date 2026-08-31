import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type OutreachMessage = Database['public']['Tables']['outreach_messages']['Row'];

export interface AbsenteeMember {
  userId: string;
  fullName: string;
  phone: string | null;
}

export async function getAbsentees(orgId: string): Promise<AbsenteeMember[]> {
  const { data: mandatoryEvents, error: eventsError } = await supabase
    .from('events')
    .select('id, start_time')
    .eq('org_id', orgId)
    .eq('is_mandatory', true)
    .order('start_time', { ascending: false })
    .limit(3);

  if (eventsError) throw eventsError;

  const { data: mandatorySessions, error: sessionsError } = await supabase
    .from('attendance_sessions')
    .select('id, session_date, church_schedules!inner(org_id, is_mandatory)')
    .eq('church_schedules.org_id', orgId)
    .eq('church_schedules.is_mandatory', true)
    .not('session_date', 'is', null)
    .order('session_date', { ascending: false })
    .limit(3);

  if (sessionsError) throw sessionsError;

  interface Occurrence {
    kind: 'event' | 'schedule';
    id: string;
    date: string;
  }

  const combined: Occurrence[] = [
    ...(mandatoryEvents ?? []).map((e) => ({ kind: 'event' as const, id: e.id, date: e.start_time })),
    ...(mandatorySessions ?? []).map((s) => ({ kind: 'schedule' as const, id: s.id, date: s.session_date! })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  if (combined.length < 3) {
    return [];
  }

  const eventOccurrenceIds = combined.filter((o) => o.kind === 'event').map((o) => o.id);
  const scheduleSessionIds = combined.filter((o) => o.kind === 'schedule').map((o) => o.id);

  let eventSessionIds: string[] = [];
  if (eventOccurrenceIds.length > 0) {
    const { data: eventSessions, error } = await supabase
      .from('attendance_sessions')
      .select('id')
      .in('event_id', eventOccurrenceIds);
    if (error) throw error;
    eventSessionIds = (eventSessions ?? []).map((s) => s.id);
  }

  const allRelevantSessionIds = [...eventSessionIds, ...scheduleSessionIds];

  const { data: attendedLogs, error: logsError } = await supabase
    .from('attendance_logs')
    .select('user_id')
    .in('session_id', allRelevantSessionIds);

  if (logsError) throw logsError;

  const attendedUserIds = new Set((attendedLogs ?? []).map((l) => l.user_id));

  type MemberQueryResult = {
    user_id: string;
    profile: {
      id: string;
      full_name: string | null;
      phone: string | null;
    } | null;
  };

  const { data: allMembers, error: membersError } = await supabase
    .from('memberships')
    .select('user_id, profile:profiles(id, full_name, phone)')
    .eq('org_id', orgId)
    .eq('status', 'active');

  if (membersError) throw membersError;

  const membersData = (allMembers as unknown as MemberQueryResult[]) ?? [];

  const absentees: AbsenteeMember[] = membersData
    .filter((m) => !attendedUserIds.has(m.user_id))
    .map((m) => ({
      userId: m.user_id,
      fullName: m.profile?.full_name ?? 'Member',
      phone: m.profile?.phone ?? null,
    }));

  return absentees;
}

export async function generateDraftMessage(orgName: string, memberName: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke('generate-outreach-draft', {
    body: { orgName, memberName },
  });

  if (error) throw error;
  return data.message as string;
}

interface SaveDraftPayload {
  orgId: string;
  memberId: string;
  draftContent: string;
}

export async function saveDraft(payload: SaveDraftPayload): Promise<OutreachMessage> {
  const { data, error } = await supabase
    .from('outreach_messages')
    .insert({
      org_id: payload.orgId,
      member_id: payload.memberId,
      draft_content: payload.draftContent,
      status: 'draft',
      channel: 'whatsapp',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getDraftMessages(orgId: string) {
  const { data, error } = await supabase
    .from('outreach_messages')
    .select('*, profile:profiles!outreach_messages_member_id_fkey(full_name, phone)')
    .eq('org_id', orgId)
    .eq('status', 'draft')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function markAsSent(
  messageId: string,
  finalContent: string,
  sentByUserId: string
): Promise<void> {
  const { error } = await supabase
    .from('outreach_messages')
    .update({
      final_content: finalContent,
      status: 'sent',
      sent_by: sentByUserId,
      sent_at: new Date().toISOString(),
    })
    .eq('id', messageId);

  if (error) throw error;
}