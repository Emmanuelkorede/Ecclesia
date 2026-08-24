import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import * as attendanceService from '../services/attendaceServices';
import type { Database } from '../types/database.types';

type AttendanceSession = Database['public']['Tables']['attendance_sessions']['Row'];

export function useScheduleAttendance(scheduleId: string | null, sessionDate: string | null) {
  const { user } = useAuth();
  const [session, setSession] = useState<AttendanceSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkedExisting, setCheckedExisting] = useState(false);

  const loadSession = useCallback(async () => {
    if (!scheduleId || !sessionDate) return;
    setLoading(true);
    const data = await attendanceService.getAnySessionForSchedule(scheduleId, sessionDate);
    setSession(data);
    setCheckedExisting(true);
    setLoading(false);
  }, [scheduleId, sessionDate]);

  const startSession = async (expiresInMinutes?: number) => {
    if (!scheduleId || !sessionDate || !user) throw new Error('Missing schedule, date, or user');
    if (session) throw new Error('Attendance already started for this date.');
    setLoading(true);
    const created = await attendanceService.createScheduleAttendanceSession({
      scheduleId,
      sessionDate,
      createdBy: user.id,
      expiresInMinutes,
    });
    setSession(created);
    setLoading(false);
  };

  const endSession = async () => {
    if (!session) return;
    await attendanceService.closeSession(session.id);
    setSession({ ...session, status: 'closed' });
  };

  return { session, loading, checkedExisting, loadSession, startSession, endSession };
}