import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Group = Database['public']['Tables']['groups']['Row'];

interface CreateGroupPayload {
  orgId: string;
  name: string;
  description?: string;
  leaderId?: string;
}

export async function getGroupsForOrg(orgId: string): Promise<Group[]> {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createGroup(payload: CreateGroupPayload): Promise<Group> {
  const { data, error } = await supabase
    .from('groups')
    .insert({
      org_id: payload.orgId,
      name: payload.name,
      description: payload.description ?? null,
      leader_id: payload.leaderId ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateGroup(groupId: string, updates: Partial<Pick<Group, 'name' | 'description' | 'leader_id'>>): Promise<void> {
  const { error } = await supabase.from('groups').update(updates).eq('id', groupId);
  if (error) throw error;
}

export async function deleteGroup(groupId: string): Promise<void> {
  const { error } = await supabase.from('groups').delete().eq('id', groupId);
  if (error) throw error;
}

// Group membership management
export async function getGroupMembers(groupId: string) {
  const { data, error } = await supabase
    .from('group_members')
    .select('*, profile:profiles(*)')
    .eq('group_id', groupId);

  if (error) throw error;
  return data ?? [];
}

export async function addMemberToGroup(groupId: string, userId: string): Promise<void> {
  const { error } = await supabase.from('group_members').insert({ group_id: groupId, user_id: userId });
  if (error) throw error;
}

export async function removeMemberFromGroup(groupId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('user_id', userId);

  if (error) throw error;
}