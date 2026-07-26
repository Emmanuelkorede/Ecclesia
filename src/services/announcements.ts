import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Announcement = Database['public']['Tables']['announcements']['Row'];

interface CreateAnnouncementPayload {
  orgId: string;
  authorId: string;
  title: string;
  content: string;
  groupId?: string;
}

export async function getAnnouncementsForOrg(orgId: string): Promise<Announcement[]> {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createAnnouncement(payload: CreateAnnouncementPayload): Promise<Announcement> {
  const { data, error } = await supabase
    .from('announcements')
    .insert({
      org_id: payload.orgId,
      author_id: payload.authorId,
      title: payload.title,
      content: payload.content,
      group_id: payload.groupId ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function markPushSent(announcementId: string): Promise<void> {
  const { error } = await supabase
    .from('announcements')
    .update({ push_sent: true })
    .eq('id', announcementId);

  if (error) throw error;
}

export async function deleteAnnouncement(announcementId: string): Promise<void> {
  const { error } = await supabase.from('announcements').delete().eq('id', announcementId);
  if (error) throw error;
}