import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Sermon = Database['public']['Tables']['sermons']['Row'];

interface CreateSermonPayload {
  orgId: string;
  title: string;
  mediaUrl: string;
  speaker?: string;
  datePreached?: string;
  tags?: string[];
}

export async function getSermonsForOrg(orgId: string): Promise<Sermon[]> {
  const { data, error } = await supabase
    .from('sermons')
    .select('*')
    .eq('org_id', orgId)
    .order('date_preached', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createSermon(payload: CreateSermonPayload): Promise<Sermon> {
  const { data, error } = await supabase
    .from('sermons')
    .insert({
      org_id: payload.orgId,
      title: payload.title,
      media_url: payload.mediaUrl,
      speaker: payload.speaker ?? null,
      date_preached: payload.datePreached ?? new Date().toISOString().slice(0, 10),
      tags: payload.tags ?? [],
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSermon(sermonId: string): Promise<void> {
  const { error } = await supabase.from('sermons').delete().eq('id', sermonId);
  if (error) throw error;
}