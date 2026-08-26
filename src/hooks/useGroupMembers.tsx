import { useState, useEffect, useCallback } from 'react';
import { useMemberships } from './useMemberShip';
import * as groupService from '../services/groupServices';

export function useGroupMembers(groupId: string | null) {
  const { members: allMembers } = useMemberships(); // full church roster, for the "add" picker
  const [groupMembers, setGroupMembers] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!groupId) {
      setGroupMembers([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await groupService.getGroupMembers(groupId);
    setGroupMembers(data);
    setLoading(false);
  }, [groupId]);

  useEffect(() => {
    load();
  }, [load]);

  const addMember = async (userId: string) => {
    if (!groupId) return;
    await groupService.addMemberToGroup(groupId, userId);
    await load();
  };

  const removeMember = async (userId: string) => {
    if (!groupId) return;
    await groupService.removeMemberFromGroup(groupId, userId);
    await load();
  };

  const groupMemberIds = new Set(groupMembers.map((gm) => gm.user_id));
  const availableToAdd = allMembers.filter((m) => m.status === 'active' && !groupMemberIds.has(m.user_id));

  return { groupMembers, availableToAdd, loading, addMember, removeMember, refresh: load };
}