import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Schedule = Database['public']['Tables']['church_schedules']['Row'];

interface CreateSchedulePayload {
  orgId: string;
  title: string;
  dayOfWeek: number;
  startTime: string; // "08:00"
  endTime: string;
  location?: string;
  groupId?: string;
}

export async function getSchedulesForOrg(orgId: string): Promise<Schedule[]> {
  const { data, error } = await supabase
    .from('church_schedules')
    .select('*')
    .eq('org_id', orgId)
    .order('day_of_week', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createSchedule(payload: CreateSchedulePayload): Promise<Schedule> {
  const { data, error } = await supabase
    .from('church_schedules')
    .insert({
      org_id: payload.orgId,
      title: payload.title,
      day_of_week: payload.dayOfWeek,
      start_time: payload.startTime,
      end_time: payload.endTime,
      location: payload.location ?? null,
      group_id: payload.groupId ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSchedule(scheduleId: string): Promise<void> {
  const { error } = await supabase.from('church_schedules').delete().eq('id', scheduleId);
  if (error) throw error;
}