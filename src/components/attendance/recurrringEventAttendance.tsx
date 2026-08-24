import { useState, useEffect, useCallback } from 'react';
import { useSchedule } from '../../hooks/useSchedule';
import { useScheduleAttendance } from '../../hooks/useScheduleAttendance';
import * as attendanceService from '../../services/attendaceServices';
import * as groupService from '../../services/groupServives';
import QRGenerator from './QRgenerator';
import SessionCountdown from './sessionCountDown';
import ManualRosterList from './manualRoasterList';

export default function RecurringAttendance() {
  const { schedules } = useSchedule();
  const [selectedScheduleId, setSelectedScheduleId] = useState('');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().slice(0, 10));
  const { session, loading, checkedExisting, loadSession, startSession, endSession } = useScheduleAttendance(
    selectedScheduleId || null,
    sessionDate || null
  );
  const [checkedInIds, setCheckedInIds] = useState<string[]>([]);
  const [eligibleUserIds, setEligibleUserIds] = useState<Set<string> | null>(null);

  const selectedSchedule = schedules.find((s) => s.id === selectedScheduleId);

  useEffect(() => {
    if (selectedScheduleId && sessionDate) loadSession();
  }, [selectedScheduleId, sessionDate, loadSession]);

  useEffect(() => {
    if (!selectedSchedule?.group_id) {
      setEligibleUserIds(null);
      return;
    }
    groupService.getGroupMembers(selectedSchedule.group_id).then((members: any[]) => {
      setEligibleUserIds(new Set(members.map((m) => m.user_id)));
    });
  }, [selectedSchedule?.id, selectedSchedule?.group_id]);

  const refreshCheckedIn = useCallback(async () => {
    if (!session) return;
    const logs = await attendanceService.getLogsForSession(session.id);
    setCheckedInIds(logs.map((l: any) => l.user_id));
  }, [session]);

  useEffect(() => {
    if (session) refreshCheckedIn();
  }, [session, refreshCheckedIn]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1">Program</label>
          <select
            value={selectedScheduleId}
            onChange={(e) => setSelectedScheduleId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Choose...</option>
            {schedules.map((s) => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1">Date</label>
          <input
            type="date"
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {selectedScheduleId && sessionDate && (
        <>
          {loading || !checkedExisting ? (
            <p className="text-sm text-slate-500">Checking session status...</p>
          ) : !session ? (
            <button onClick={() => startSession()} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-5 py-2.5">
              Start Attendance for This Date
            </button>
          ) : session.status === 'closed' ? (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Attendance already recorded for this date</p>
                <p className="text-xs text-slate-500 mt-1">{checkedInIds.length} checked in</p>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
                <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Attendees</h2>
                <ManualRosterList sessionId={session.id} checkedInUserIds={checkedInIds} eligibleUserIds={eligibleUserIds} readOnly />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
                <QRGenerator qrToken={session.qr_token} size={160} />
                <div>
                  <p className="text-sm text-slate-500 mb-2">Or enter passcode:</p>
                  <p className="font-mono text-3xl font-bold text-slate-900 dark:text-white tracking-widest mb-4">{session.passcode}</p>
                  <SessionCountdown expiresAt={session.expires_at} onExpire={() => loadSession()} />
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
                <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Manual check-in</h2>
                <ManualRosterList sessionId={session.id} checkedInUserIds={checkedInIds} eligibleUserIds={eligibleUserIds} onCheckedIn={refreshCheckedIn} />
              </div>
              <button onClick={() => endSession()} className="text-sm text-red-600 hover:underline">End session</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}