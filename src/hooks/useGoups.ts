import { useState, useEffect, useCallback } from 'react';
import { useActiveOrg } from './useActiveOrg';
import { useSubscription } from './useSubscirptionservcies';
import * as groupService from '../services/groupServives';
import type { GroupWithDetails } from '../services/groupServives';
import { isAtGroupLimit, getPlanLimits, getEffectivePlanForLimits } from '../utils/planLimits';
import type { Database } from '../types/database.types';

type Group = Database['public']['Tables']['groups']['Row'];

export function useGroups() {
  const { activeOrg } = useActiveOrg();
  const { currentPlan, isExpired } = useSubscription();
  const [groups, setGroups] = useState<GroupWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!activeOrg) {
      setGroups([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await groupService.getGroupsForOrg(activeOrg.id);
    setGroups(data);
    setLoading(false);
  }, [activeOrg]);

  useEffect(() => {
    load();
  }, [load]);

  const createGroup = async (name: string, description?: string, leaderId?: string) => {
    if (!activeOrg) throw new Error('No active organization');

    const effectivePlan = getEffectivePlanForLimits(currentPlan, isExpired);
    if (isAtGroupLimit(effectivePlan, groups.length)) {
      throw new Error(
        `Your ${effectivePlan} plan allows up to ${getPlanLimits(effectivePlan).maxGroups} groups. Upgrade to add more.`
      );
    }

    await groupService.createGroup({ orgId: activeOrg.id, name, description, leaderId });
    await load();
  };

  const updateGroup = async (groupId: string, updates: Partial<Pick<Group, 'name' | 'description' | 'leader_id'>>) => {
    await groupService.updateGroup(groupId, updates);
    await load();
  };

  const deleteGroup = async (groupId: string) => {
    await groupService.deleteGroup(groupId);
    await load();
  };

  return { groups, loading, createGroup, updateGroup, deleteGroup, refresh: load };
}