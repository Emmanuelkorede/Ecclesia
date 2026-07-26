import { useState, useEffect, useCallback } from 'react';
import { useActiveOrg } from './useActiveOrg';
import { useAuth } from './useAuth';
import * as announcementService from '../services/announcements';
import type { Database } from '../types/database.types';

type Announcement = Database['public']['Tables']['announcements']['Row'];

export function useAnnouncements() {
  const { activeOrg } = useActiveOrg();
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!activeOrg) {
      setAnnouncements([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await announcementService.getAnnouncementsForOrg(activeOrg.id);
    setAnnouncements(data);
    setLoading(false);
  }, [activeOrg]);

  useEffect(() => {
    load();
  }, [load]);

  const createAnnouncement = async (title: string, content: string, groupId?: string) => {
    if (!activeOrg || !user) throw new Error('Missing org or user');
    await announcementService.createAnnouncement({
      orgId: activeOrg.id,
      authorId: user.id,
      title,
      content,
      groupId,
    });
    await load();
  };

  const deleteAnnouncement = async (id: string) => {
    await announcementService.deleteAnnouncement(id);
    await load();
  };

  return { announcements, loading, createAnnouncement, deleteAnnouncement, refresh: load };
}