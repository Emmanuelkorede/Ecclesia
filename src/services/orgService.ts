import { supabase } from '../lib/supabase';
import type { Organization, MembershipWithOrg } from '../types/domain.types';

interface CreateOrgPayload {
  name: string;
  churchCode: string;
  slug: string;
  address?: string;
  timezone?: string;
}


export async function createOrg(payload: CreateOrgPayload, userId: string): Promise<Organization> {
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert({
      name: payload.name,
      church_code: payload.churchCode,
      slug: payload.slug,
      address: payload.address ?? null,
      timezone: payload.timezone ?? 'UTC',
    })
    .select()
    .single();

  if (orgError) throw orgError;

  const { error: membershipError } = await supabase.from('memberships').insert({
    user_id: userId,
    org_id: org.id,
    role: 'super_admin',
    status: 'active',
  });

  if (membershipError) throw membershipError;

  return org;
}

export async function getOrgByCode(churchCode: string): Promise<Organization | null> {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('church_code', churchCode)
    .maybeSingle(); // returns null instead of throwing if no match

  if (error) throw error;
  return data;
}

// Fetches every membership for a user, joined with the full org row —
// this is what OrgContext calls on login to populate the switcher
export async function getMembershipsForUser(userId: string): Promise<MembershipWithOrg[]> {
  const { data, error } = await supabase
    .from('memberships')
    .select('*, organization:organizations(*)')
    .eq('user_id', userId)
    .eq('status', 'active');

  if (error) throw error;
  return (data ?? []) as MembershipWithOrg[];
}

// Persists which org is "active" for this user, so it survives a page refresh
export async function setActiveOrgId(userId: string, orgId: string): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ active_org_id: orgId })
    .eq('id', userId);

  if (error) throw error;
}

// Fetches the user's persisted active_org_id from their profile row
export async function getActiveOrgId(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('active_org_id')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data.active_org_id;
}