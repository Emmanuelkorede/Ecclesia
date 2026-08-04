import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import * as attendanceService from '../services/attendaceServices';
import type { Database } from '../types/database.types';

type AttendanceSession = Database['public']['Tables']['attendance_sessions']['Row'];

// Scoped to ONE event at a time — used inside AttendanceSessionPage,
// which already knows which event it's launching a session for.
export function useAttendanceSession(eventId: string | null) {
  const { user } = useAuth();
  const [session, setSession] = useState<AttendanceSession | null>(null);
  const [loading, setLoading] = useState(false);

  const loadActiveSession = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    const data = await attendanceService.getActiveSessionForEvent(eventId);
    setSession(data);
    setLoading(false);
  }, [eventId]);

  const startSession = async (expiresInMinutes?: number) => {
    if (!eventId || !user) throw new Error('Missing event or user');
    setLoading(true);
    const created = await attendanceService.createAttendanceSession({
      eventId,
      createdBy: user.id,
      expiresInMinutes,
    });
    setSession(created);
    setLoading(false);
  };

  const endSession = async () => {
    if (!session) return;
    await attendanceService.closeSession(session.id);
    setSession(null);
  };

  return { session, loading, loadActiveSession, startSession, endSession };
}