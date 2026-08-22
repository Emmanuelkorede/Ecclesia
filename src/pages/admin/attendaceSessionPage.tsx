import { useState, useEffect, useCallback } from 'react';
import { useEvents } from '../../hooks/useEvents';
import { useAttendanceSession } from '../../hooks/useAttendanceSession';
import * as attendanceService from '../../services/attendaceServices';
import * as groupService from '../../services/groupServives';
import QRGenerator from '../../components/attendance/QRgenerator';
import SessionCountdown from '../../components/attendance/sessionCountDown';
import ManualRosterList from '../../components/attendance/manualRoasterList';

export default function AttendanceSessionPage() {
  const { events } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const { session, loading, loadActiveSession, startSession, endSession } = useAttendanceSession(selectedEventId || null);
  const [checkedInIds, setCheckedInIds] = useState<string[]>([]);
  const [eligibleUserIds, setEligibleUserIds] = useState<Set<string> | null>(null);

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  // Auto-restore: if any event already has an active session, jump straight
  // to it instead of forcing the admin to reselect after navigating away.
  useEffect(() => {
    if (selectedEventId || events.length === 0) return;
    (async () => {
      for (const e of events) {
        const active = await attendanceService.getActiveSessionForEvent(e.id);
        if (active) {
          setSelectedEventId(e.id);
          return;
        }
      }
    })();
  }, [events, selectedEventId]);

  useEffect(() => {
    if (selectedEventId) loadActiveSession();
  }, [selectedEventId, loadActiveSession]);

  // Resolve which members are actually allowed to be manually checked in —
  // if the event is group-restricted, only that group's members qualify.
  useEffect(() => {
    if (!selectedEvent) {
      setEligibleUserIds(null);
      return;
    }
    if (!selectedEvent.group_id) {
      setEligibleUserIds(null); // null = no restriction, everyone eligible
      return;
    }
    groupService.getGroupMembers(selectedEvent.group_id).then((members: any[]) => {
      setEligibleUserIds(new Set(members.map((m) => m.user_id)));
    });
  }, [selectedEvent?.id, selectedEvent?.group_id]);

  const refreshCheckedIn = useCallback(async () => {
    if (!session) return;
    const logs = await attendanceService.getLogsForSession(session.id);
    setCheckedInIds(logs.map((l: any) => l.user_id));
  }, [session]);

  useEffect(() => {
    if (session) refreshCheckedIn();
  }, [session, refreshCheckedIn]);

  const upcomingEvents = events.filter((e) => new Date(e.end_time) > new Date());

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Attendance Session</h1>

      <div>
        <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1">Select event</label>
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Choose an event...</option>
          {upcomingEvents.map((e) => (
            <option key={e.id} value={e.id}>{e.title}</option>
          ))}
        </select>
      </div>

      {selectedEventId && (
        <>
          {loading ? (
            <p className="text-sm text-slate-500">Checking for active session...</p>
          ) : !session ? (
            <button
              onClick={() => startSession()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-5 py-2.5"
            >
              Start Attendance Session
            </button>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
                <QRGenerator qrToken={session.qr_token} size={160} />
                <div>
                  <p className="text-sm text-slate-500 mb-2">Or enter passcode:</p>
                  <p className="font-mono text-3xl font-bold text-slate-900 dark:text-white tracking-widest mb-4">
                    {session.passcode}
                  </p>
                  <SessionCountdown expiresAt={session.expires_at} onExpire={() => loadActiveSession()} />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
                <h2 className="font-semibold text-slate-900 dark:text-white mb-1">Manual check-in</h2>
                {selectedEvent?.group_id && (
                  <p className="text-xs text-slate-500 mb-4">
                    This event is restricted — only eligible group members are listed below.
                  </p>
                )}
                <ManualRosterList
                  sessionId={session.id}
                  checkedInUserIds={checkedInIds}
                  eligibleUserIds={eligibleUserIds}
                  onCheckedIn={refreshCheckedIn}
                />
              </div>

              <button
                onClick={async () => { await endSession(); }}
                className="text-sm text-red-600 hover:underline"
              >
                End session
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}