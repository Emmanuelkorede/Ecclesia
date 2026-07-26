import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Membership = Database['public']['Tables']['memberships']['Row'];

// All memberships for a specific church (admin's "Members" page)
export async function getMembershipsForOrg(orgId: string): Promise<Membership[]> {
  const { data, error } = await supabase
    .from('memberships')
    .select('*, profile:profiles(*)')
    .eq('org_id', orgId);

  if (error) throw error;
  return data ?? [];
}

export async function updateMembershipRole(membershipId: string, role: Membership['role']): Promise<void> {
  const { error } = await supabase
    .from('memberships')
    .update({ role })
    .eq('id', membershipId);

  if (error) throw error;
}

export async function updateMembershipStatus(membershipId: string, status: Membership['status']): Promise<void> {
  const { error } = await supabase
    .from('memberships')
    .update({ status })
    .eq('id', membershipId);

  if (error) throw error;
}

export async function updateMembershipTags(membershipId: string, tags: string[]): Promise<void> {
  const { error } = await supabase
    .from('memberships')
    .update({ tags })
    .eq('id', membershipId);

  if (error) throw error;
}

export async function removeMembership(membershipId: string): Promise<void> {
  const { error } = await supabase.from('memberships').delete().eq('id', membershipId);
  if (error) throw error;
}