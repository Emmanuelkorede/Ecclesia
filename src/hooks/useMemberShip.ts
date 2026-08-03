import { useState, useEffect, useCallback } from 'react';
import { useActiveOrg } from './useActiveOrg';
import { useSubscription } from './useSubscirptionservcies';
import * as membershipService from '../services/memberShipSerives';
import { isAtMemberLimit, getPlanLimits, getEffectivePlanForLimits } from '../utils/planLimits';
import type { Database } from '../types/database.types';

type Membership = Database['public']['Tables']['memberships']['Row'];

export function useMemberships() {
  const { activeOrg } = useActiveOrg();
  const { currentPlan, isExpired } = useSubscription();
  const [members, setMembers] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!activeOrg) {
      setMembers([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await membershipService.getMembershipsForOrg(activeOrg.id);
    setMembers(data);
    setLoading(false);
  }, [activeOrg]);

  useEffect(() => {
    load();
  }, [load]);

  const updateRole = async (membershipId: string, role: Membership['role']) => {
    await membershipService.updateMembershipRole(membershipId, role);
    await load();
  };

  // Approving a pending member counts as "adding" them for limit purposes
  const updateStatus = async (membershipId: string, status: Membership['status']) => {
    if (status === 'active' && activeOrg) {
      const effectivePlan = getEffectivePlanForLimits(currentPlan, isExpired);
      const activeCount = members.filter((m) => m.status === 'active').length;
      if (isAtMemberLimit(effectivePlan, activeCount)) {
        throw new Error(
          `Your ${effectivePlan} plan allows up to ${getPlanLimits(effectivePlan).maxMembers} members. Upgrade to approve more.`
        );
      }
    }
    await membershipService.updateMembershipStatus(membershipId, status);
    await load();
  };

  const updateTags = async (membershipId: string, tags: string[]) => {
    await membershipService.updateMembershipTags(membershipId, tags);
    await load();
  };

  const remove = async (membershipId: string) => {
    await membershipService.removeMembership(membershipId);
    await load();
  };

  return { members, loading, updateRole, updateStatus, updateTags, remove, refresh: load };
}