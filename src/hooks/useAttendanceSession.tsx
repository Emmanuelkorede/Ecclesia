import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import * as attendanceService from '../services/attendaceServices';
import type { Database } from '../types/database.types';

type AttendanceSession = Database['public']['Tables']['attendance_sessions']['Row'];

export function useAttendanceSession(eventId: string | null) {
  const { user } = useAuth();
  const [session, setSession] = useState<AttendanceSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkedExisting, setCheckedExisting] = useState(false);

  const loadActiveSession = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    // Checks for ANY session (active or closed) — a one-off event should
    // only ever have one session in its lifetime.
    const data = await attendanceService.getAnySessionForEvent(eventId);
    setSession(data);
    setCheckedExisting(true);
    setLoading(false);
  }, [eventId]);

  const startSession = async (expiresInMinutes?: number) => {
    if (!eventId || !user) throw new Error('Missing event or user');
    if (session) throw new Error('This event already has an attendance session.');
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
    // Don't clear session to null — keep it so the page can show the
    // closed summary instead of offering "Start" again.
    setSession({ ...session, status: 'closed' });
  };

  return { session, loading, checkedExisting, loadActiveSession, startSession, endSession };
}