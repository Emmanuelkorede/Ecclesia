import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];

interface SubmitProofPayload {
  orgId: string;
  submittedBy: string;
  planTier: string;
  amountPaid: number;
  currency?: string;
  discountCode?: string;
  proofUrl: string;
}

export async function submitPaymentProof(payload: SubmitProofPayload): Promise<Subscription> {
  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      org_id: payload.orgId,
      submitted_by: payload.submittedBy,
      plan_tier: payload.planTier as Subscription['plan_tier'],
      amount_paid: payload.amountPaid,
      currency: payload.currency ?? 'NGN',
      discount_code: payload.discountCode ?? null,
      proof_url: payload.proofUrl,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;

  await supabase
    .from('organizations')
    .update({ subscription_status: 'pending' })
    .eq('id', payload.orgId);

  return data;
}

export async function getSubscriptionsForOrg(orgId: string): Promise<Subscription[]> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getAllPendingSubscriptions(): Promise<Subscription[]> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, organization:organizations(*)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function approveSubscription(subscriptionId: string, reviewerId: string): Promise<void> {
  const { error } = await supabase.rpc('approve_subscription', {
    p_subscription_id: subscriptionId,
    p_reviewer_id: reviewerId,
  });
  if (error) throw error;
}

export async function rejectSubscription(
  subscriptionId: string,
  reviewerId: string,
  reason: string
): Promise<void> {
  const { error } = await supabase.rpc('reject_subscription', {
    p_subscription_id: subscriptionId,
    p_reviewer_id: reviewerId,
    p_reason: reason,
  });
  if (error) throw error;
}