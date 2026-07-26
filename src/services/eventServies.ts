import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type EventRow = Database['public']['Tables']['events']['Row'];

interface CreateEventPayload {
  orgId: string;
  groupId?: string;
  title: string;
  description?: string;
  startTime: string; // ISO string
  endTime: string;
  location?: string;
  isMandatory: boolean;
}

export async function getEventsForOrg(orgId: string): Promise<EventRow[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('org_id', orgId)
    .order('start_time', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createEvent(payload: CreateEventPayload): Promise<EventRow> {
  const { data, error } = await supabase
    .from('events')
    .insert({
      org_id: payload.orgId,
      group_id: payload.groupId ?? null,
      title: payload.title,
      description: payload.description ?? null,
      start_time: payload.startTime,
      end_time: payload.endTime,
      location: payload.location ?? null,
      is_mandatory: payload.isMandatory,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEvent(
  eventId: string,
  updates: Partial<Pick<EventRow, 'title' | 'description' | 'start_time' | 'end_time' | 'location' | 'is_mandatory' | 'group_id'>>
): Promise<void> {
  const { error } = await supabase.from('events').update(updates).eq('id', eventId);
  if (error) throw error;
}

export async function deleteEvent(eventId: string): Promise<void> {
  const { error } = await supabase.from('events').delete().eq('id', eventId);
  if (error) throw error;
}