import { useState, useEffect, useCallback } from 'react';
import { useActiveOrg } from './useActiveOrg';
import * as subscriptionService from '../services/subscriptionServices';
import type { Database } from '../types/database.types';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];

export function useSubscription() {
  const { activeOrg, refreshMemberships } = useActiveOrg();
  const [history, setHistory] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!activeOrg) {
      setHistory([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await subscriptionService.getSubscriptionsForOrg(activeOrg.id);
    setHistory(data);
    setLoading(false);
  }, [activeOrg]);

  useEffect(() => {
    // Defer execution so setState runs asynchronously outside the synchronous effect pass
    const timer = setTimeout(() => {
      load();
    }, 0);

    return () => clearTimeout(timer);
  }, [load]);

  const submitProof = async (params: {
    submittedBy: string;
    planTier: string;
    amountPaid: number;
    proofUrl: string;
    discountCode?: string;
  }) => {
    if (!activeOrg) throw new Error('No active organization');
    await subscriptionService.submitPaymentProof({ orgId: activeOrg.id, ...params });
    await load();
    await refreshMemberships();
  };

  const currentPlan = (activeOrg?.current_plan ?? 'free') as 'free' | 'growth' | 'enterprise';
  const subscriptionStatus = activeOrg?.subscription_status ?? 'active';
  const expiresAt = activeOrg?.plan_expires_at ?? null;
  const isExpired = expiresAt ? new Date(expiresAt) < new Date() : false;

  return {
    history,
    loading,
    submitProof,
    currentPlan,
    subscriptionStatus,
    expiresAt,
    isExpired,
    refresh: load,
  };
}