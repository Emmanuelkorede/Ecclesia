import { useState, useEffect, useCallback } from 'react';
import { useActiveOrg } from './useActiveOrg';
import { useSchedule } from './useSchedule';
import * as analyticsService from '../services/analytics';
import type { AttendanceTrendPoint, RetentionSummary, GroupBreakdown } from '../services/analytics';

interface ScheduleItem {
  id: string;
  [key: string]: unknown;
}

export function useAnalytics() {
  const { activeOrg } = useActiveOrg();
  const { schedules } = useSchedule() as { schedules: ScheduleItem[] };
  
  const [manualScheduleId, setManualScheduleId] = useState<string>('');
  const [recurringTrend, setRecurringTrend] = useState<AttendanceTrendPoint[]>([]);
  const [customTrend, setCustomTrend] = useState<AttendanceTrendPoint[]>([]);
  const [retention, setRetention] = useState<RetentionSummary | null>(null);
  const [byGroup, setByGroup] = useState<GroupBreakdown[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Derive the selected schedule ID during render to eliminate useEffect state-syncing errors
  const selectedScheduleId = manualScheduleId || (schedules && schedules.length > 0 ? schedules[0].id : '');

  const load = useCallback(async () => {
    if (!activeOrg) {
      setRecurringTrend([]);
      setCustomTrend([]);
      setRetention(null);
      setByGroup([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const [retentionData, groupData, customData, recurringData] = await Promise.all([
        analyticsService.getRetentionSummary(activeOrg.id),
        analyticsService.getAttendanceByGroup(activeOrg.id),
        analyticsService.getCustomEventComparison(activeOrg.id),
        selectedScheduleId ? analyticsService.getRecurringTrend(selectedScheduleId) : Promise.resolve([]),
      ]);

      setRetention(retentionData);
      setByGroup(groupData);
      setCustomTrend(customData);
      setRecurringTrend(recurringData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeOrg, selectedScheduleId]);

  useEffect(() => {
    // Defer the fetch call so it doesn't run synchronously during the effect commit phase
    const timer = setTimeout(() => {
      load();
    }, 0);

    return () => clearTimeout(timer);
  }, [load]);

  return {
    recurringTrend,
    customTrend,
    retention,
    byGroup,
    loading,
    schedules,
    selectedScheduleId,
    setSelectedScheduleId: setManualScheduleId,
    refresh: load,
  };
}