import { useState } from 'react';
import { useAuth } from './useAuth';
import * as attendanceService from '../services/attendaceServices';

// Member-facing check-in actions — separate from useAttendanceSession
// (which is the admin-facing session generator/manager)
export function useCheckIn() {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkInWithCode = async (passcode: string) => {
    if (!user) throw new Error('Not logged in');
    setSubmitting(true);
    setError(null);
    try {
      await attendanceService.checkInWithCode(passcode, user.id);
    } catch (err: any) {
      setError(err.message ?? 'Check-in failed.');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const checkInWithQr = async (qrToken: string) => {
    if (!user) throw new Error('Not logged in');
    setSubmitting(true);
    setError(null);
    try {
      await attendanceService.checkInWithQr(qrToken, user.id);
    } catch (err: any) {
      setError(err.message ?? 'Check-in failed.');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return { checkInWithCode, checkInWithQr, submitting, error };
}