import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Watches for new attendance_sessions being started for this org, so the
// member dashboard's "attendance open now" banner appears live.
export function useOngoingSessionsRealtime(orgId: string | null, onChange: () => void) {
  useEffect(() => {
    if (!orgId) return;

    const channel = supabase
      .channel(`sessions-org-${orgId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attendance_sessions' },
        () => onChange() // simplest: just refetch on any session change, filtering by org happens in the fetch itself
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orgId]);
}