import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Membership = Database['public']['Tables']['memberships']['Row'];

export async function getMembershipsForOrg(orgId: string): Promise<Membership[]> {
  const { data, error } = await supabase
    .from('memberships')
    .select('*, profile:profiles(*)')
    .eq('org_id', orgId);

  if (error) throw error;
  return data ?? [];
}

export async function getActiveMemberCount(orgId: string): Promise<number> {
  const { count, error } = await supabase
    .from('memberships')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId)
    .eq('status', 'active');

  if (error) throw error;
  return count ?? 0;
}

interface CreateMembershipPayload {
  userId: string;
  orgId: string;
  role?: Membership['role'];
}

export async function createMembership(payload: CreateMembershipPayload): Promise<Membership> {
  const { data, error } = await supabase
    .from('memberships')
    .insert({
      user_id: payload.userId,
      org_id: payload.orgId,
      role: payload.role ?? 'member',
      status: 'active',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateMembershipRole(membershipId: string, role: Membership['role']): Promise<void> {
  const { error } = await supabase.from('memberships').update({ role }).eq('id', membershipId);
  if (error) throw error;
}

export async function updateMembershipStatus(membershipId: string, status: Membership['status']): Promise<void> {
  const { error } = await supabase.from('memberships').update({ status }).eq('id', membershipId);
  if (error) throw error;
}

export async function removeMembership(membershipId: string): Promise<void> {
  const { error } = await supabase.from('memberships').delete().eq('id', membershipId);
  if (error) throw error;
}