import { useState, useEffect, useCallback } from 'react';
import { useActiveOrg } from './useActiveOrg';
import * as sermonService from '../services/sermonServices';
import type { Database } from '../types/database.types';

type Sermon = Database['public']['Tables']['sermons']['Row'];

export function useSermons() {
  const { activeOrg } = useActiveOrg();
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!activeOrg) {
      setSermons([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await sermonService.getSermonsForOrg(activeOrg.id);
    setSermons(data);
    setLoading(false);
  }, [activeOrg]);

  useEffect(() => {
    // Defer execution so setState runs asynchronously outside the synchronous effect pass
    const timer = setTimeout(() => {
      load();
    }, 0);

    return () => clearTimeout(timer);
  }, [load]);

  const createSermon = async (params: { title: string; mediaUrl: string; speaker?: string; datePreached?: string; tags?: string[] }) => {
    if (!activeOrg) throw new Error('No active organization');
    await sermonService.createSermon({ orgId: activeOrg.id, ...params });
    await load();
  };

  const deleteSermon = async (id: string) => {
    await sermonService.deleteSermon(id);
    await load();
  };

  return { sermons, loading, createSermon, deleteSermon, refresh: load };
}