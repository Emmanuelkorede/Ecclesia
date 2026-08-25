import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Call this alongside a session's manual-checkin refresh logic — it fires
// onChange whenever a new row lands in attendance_logs for this session,
// from ANY source (self check-in, QR, or another admin's manual check-in).
export function useAttendanceRealtime(sessionId: string | null, onChange: () => void) {
  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel(`attendance-logs-${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'attendance_logs', filter: `session_id=eq.${sessionId}` },
        () => onChange()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);
}