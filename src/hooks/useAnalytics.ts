import { useState, useEffect, useCallback } from 'react';
import { useActiveOrg } from './useActiveOrg';
import * as analyticsService from '../services/analytics';
import type { AttendanceTrendPoint, RetentionSummary, GroupBreakdown } from '../services/analytics';

export function useAnalytics() {
  const { activeOrg } = useActiveOrg();
  const [trend, setTrend] = useState<AttendanceTrendPoint[]>([]);
  const [retention, setRetention] = useState<RetentionSummary | null>(null);
  const [byGroup, setByGroup] = useState<GroupBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!activeOrg) {
      setTrend([]);
      setRetention(null);
      setByGroup([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const [trendData, retentionData, groupData] = await Promise.all([
      analyticsService.getAttendanceTrend(activeOrg.id),
      analyticsService.getRetentionSummary(activeOrg.id),
      analyticsService.getAttendanceByGroup(activeOrg.id),
    ]);
    setTrend(trendData);
    setRetention(retentionData);
    setByGroup(groupData);
    setLoading(false);
  }, [activeOrg]);

  useEffect(() => {
    load();
  }, [load]);

  return { trend, retention, byGroup, loading, refresh: load };
}