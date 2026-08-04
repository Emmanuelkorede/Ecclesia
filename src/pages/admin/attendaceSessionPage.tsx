import { useState, useEffect } from 'react';
import { useEvents } from '../../hooks/useEvents';
import { useAttendanceSession } from '../../hooks/useAttendanceSession';
import * as attendanceService from '../../services/attendaceServices';
import QRGenerator from '../../components/attendance/QRgenerator';
import SessionCountdown from '../../components/attendance/sessionCountDown';
import ManualRosterList from '../../components/attendance/manualRoasterList';

export default function AttendanceSessionPage() {
  const { events } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const { session, loading, loadActiveSession, startSession, endSession } = useAttendanceSession(selectedEventId || null);
  const [checkedInIds, setCheckedInIds] = useState<string[]>([]);

  useEffect(() => {
    if (selectedEventId) loadActiveSession();
  }, [selectedEventId, loadActiveSession]);

  const refreshCheckedIn = async () => {
    if (!session) return;
    const logs = await attendanceService.getLogsForSession(session.id);
    setCheckedInIds(logs.map((l: any) => l.user_id));
  };

  useEffect(() => {
    if (session) refreshCheckedIn();
  }, [session]);

  const upcomingEvents = events.filter((e) => new Date(e.end_time) > new Date());

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold text-[var(--text-main)]">Attendance Session</h1>

      <div>
        <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Select event</label>
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-brand-500"
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
            <p className="text-sm text-[var(--text-muted)]">Checking for active session...</p>
          ) : !session ? (
            <button
              onClick={() => startSession()}
              className="bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg px-5 py-2.5"
            >
              Start Attendance Session
            </button>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
                <QRGenerator qrToken={session.qr_token} size={160} />
                <div>
                  <p className="text-sm text-[var(--text-muted)] mb-2">Or enter passcode:</p>
                  <p className="font-mono text-3xl font-bold text-[var(--text-main)] tracking-widest mb-4">
                    {session.passcode}
                  </p>
                  <SessionCountdown expiresAt={session.expires_at} onExpire={() => loadActiveSession()} />
                </div>
              </div>

              <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
                <h2 className="font-semibold text-[var(--text-main)] mb-4">Manual check-in</h2>
                <ManualRosterList
                  sessionId={session.id}
                  checkedInUserIds={checkedInIds}
                  onCheckedIn={refreshCheckedIn}
                />
              </div>

              <button
                onClick={async () => {
                  await endSession();
                }}
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