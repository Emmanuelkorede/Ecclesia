import { useState, useEffect, useCallback } from 'react';
import { useActiveOrg } from './useActiveOrg';
import * as scheduleService from '../services/scheduleServices';
import type { Database } from '../types/database.types';

type Schedule = Database['public']['Tables']['church_schedules']['Row'];

export function useSchedule() {
  const { activeOrg } = useActiveOrg();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!activeOrg) {
      setSchedules([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await scheduleService.getSchedulesForOrg(activeOrg.id);
    setSchedules(data);
    setLoading(false);
  }, [activeOrg?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const createSchedule = async (params: Omit<Parameters<typeof scheduleService.createSchedule>[0], 'orgId'>) => {
    if (!activeOrg) throw new Error('No active organization');
    await scheduleService.createSchedule({ orgId: activeOrg.id, ...params });
    await load();
  };

  const deleteSchedule = async (id: string) => {
    await scheduleService.deleteSchedule(id);
    await load();
  };

  const updateSchedule = async (scheduleId: string, params: Parameters<typeof scheduleService.updateSchedule>[1]) => {
  await scheduleService.updateSchedule(scheduleId, params);
  await load();
};

return { schedules, loading, createSchedule, updateSchedule, deleteSchedule, refresh: load };

}