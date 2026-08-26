import { useState, useEffect, useCallback } from 'react';
import { useMemberships } from './useMemberShip';
import * as groupService from '../services/groupServices';
import type { Database } from '../types/database.types';

type GroupMemberRow = Database['public']['Tables']['group_members']['Row'];

export interface GroupMemberRecord extends GroupMemberRow {
  profile?: Database['public']['Tables']['profiles']['Row'] | null;
}

export function useGroupMembers(groupId: string | null) {
  const { members: allMembers } = useMemberships(); // full church roster, for the "add" picker
  const [groupMembers, setGroupMembers] = useState<GroupMemberRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!groupId) {
      setGroupMembers([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await groupService.getGroupMembers(groupId);
      setGroupMembers(data as unknown as GroupMemberRecord[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    // Defer execution so setState runs asynchronously outside the synchronous effect pass
    const timer = setTimeout(() => {
      load();
    }, 0);

    return () => clearTimeout(timer);
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