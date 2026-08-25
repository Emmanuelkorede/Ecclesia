import { useState, useEffect, useCallback } from 'react';
import { useSchedule } from '../../hooks/useSchedule';
import { useScheduleAttendance } from '../../hooks/useScheduleAttendance';
import { useAttendanceRealtime } from '../../hooks/useAttendanceRealtime';
import * as attendanceService from '../../services/attendaceServices';
import * as groupService from '../../services/groupServives';
import QRGenerator from './QRgenerator';
import SessionCountdown from './sessionCountDown';
import ManualRosterList from './manualRoasterList';
import { Spinner } from '../../components/ui/Spinner';
import { 
  CalendarClock, 
  KeyRound, 
  Users, 
  PlayCircle, 
  StopCircle, 
  CheckCircle2, 
  Lock,
} from 'lucide-react';

interface GroupMember {
  user_id: string;
}

interface AttendanceLog {
  user_id: string;
}

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
    if (selectedScheduleId && sessionDate) {
      loadSession();
    }
  }, [selectedScheduleId, sessionDate, loadSession]);

  useEffect(() => {
    let isMounted = true;

    async function fetchEligibleUsers() {
      if (!selectedSchedule?.group_id) {
        await Promise.resolve();
        if (isMounted) setEligibleUserIds(null);
        return;
      }
      try {
        const members: GroupMember[] = await groupService.getGroupMembers(selectedSchedule.group_id);
        if (isMounted) {
          setEligibleUserIds(new Set(members.map((m) => m.user_id)));
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchEligibleUsers();

    return () => {
      isMounted = false;
    };
  }, [selectedSchedule?.id, selectedSchedule?.group_id]);

  const refreshCheckedIn = useCallback(async () => {
    if (!session) {
      setCheckedInIds([]);
      return;
    }
    try {
      const logs = await attendanceService.getLogsForSession(session.id);
      setCheckedInIds(logs.map((l: AttendanceLog) => l.user_id));
    } catch (err) {
      console.error(err);
    }
  }, [session]);

  useEffect(() => {
    let isMounted = true;

    async function loadLogs() {
      if (!session) {
        await Promise.resolve();
        if (isMounted) setCheckedInIds([]);
        return;
      }
      try {
        const logs = await attendanceService.getLogsForSession(session.id);
        if (isMounted) {
          setCheckedInIds(logs.map((l: AttendanceLog) => l.user_id));
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadLogs();

    return () => {
      isMounted = false;
    };
  }, [session]);

  useAttendanceRealtime(session?.id ?? null, refreshCheckedIn);

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300 pb-8">
      
      {/* Header & Controls Area */}
      <div className="bg-surface border border-subtle rounded-xl p-5 shadow-sm space-y-5">
        <div>
          <h2 className="text-lg font-bold text-main tracking-tight">Recurring Program Attendance</h2>
          <p className="text-muted text-sm mt-0.5">
            Select a program and a specific date to manage its attendance session.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
              Program
            </label>
            <div className="relative">
              <select
                value={selectedScheduleId}
                onChange={(e) => setSelectedScheduleId(e.target.value)}
                className="w-full px-4 py-2.5 bg-app border border-subtle rounded-lg text-sm font-medium text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all cursor-pointer appearance-none"
              >
                <option value="">Choose a program...</option>
                {schedules.map((s) => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
              Session Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-app border border-subtle rounded-lg text-sm font-medium text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      {selectedScheduleId && sessionDate && (
        <>
          {loading || !checkedExisting ? (
            <div className="flex flex-col items-center justify-center py-16 bg-surface border border-subtle rounded-xl text-muted">
              <Spinner size="md" className="text-brand-500 mb-3" />
              <p className="text-sm font-medium">Checking session status...</p>
            </div>
          ) : !session ? (
            /* No Active Session State */
            <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-surface border border-subtle rounded-xl shadow-sm space-y-4">
              <div className="p-3.5 bg-brand-500/10 rounded-full text-brand-600 dark:text-brand-400">
                <CalendarClock className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-1">
                <h3 className="text-base font-semibold text-main">No attendance record found</h3>
                <p className="text-xs text-muted">
                  There is no active or past session for this date. Start a new session to begin accepting check-ins.
                </p>
              </div>
              <button
                type="button"
                onClick={() => startSession()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Start Attendance for This Date</span>
              </button>
            </div>
          ) : session.status === 'closed' ? (
            /* Session Closed State */
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-surface border border-subtle rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 rounded-lg">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-main">Attendance Recorded</h3>
                    <p className="text-xs text-muted">This session has ended and is now read-only.</p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{checkedInIds.length} Checked In</span>
                </div>
              </div>

              <div className="bg-surface border border-subtle rounded-xl p-5 shadow-sm space-y-4">
                <h2 className="text-sm font-semibold text-main uppercase tracking-wider">Attendee Roster</h2>
                <ManualRosterList
                  sessionId={session.id}
                  checkedInUserIds={checkedInIds}
                  eligibleUserIds={eligibleUserIds}
                  readOnly
                />
              </div>
            </div>
          ) : (
            /* Active Live Session State */
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* QR Code & Code Display Card */}
                <div className="lg:col-span-1 bg-surface border border-subtle rounded-xl p-6 shadow-sm flex flex-col items-center justify-between text-center space-y-6">
                  <div className="space-y-1 w-full">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Session
                    </div>
                  </div>

                  {/* QR Box */}
                  <div className="p-4 bg-white rounded-xl shadow-inner border border-slate-200">
                    <QRGenerator qrToken={session.qr_token} size={160} />
                  </div>

                  {/* Passcode & Timer */}
                  <div className="w-full bg-app border border-subtle rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-muted font-medium">
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Passcode</span>
                    </div>
                    <div className="text-3xl font-mono font-bold tracking-widest text-brand-600 dark:text-brand-400">
                      {session.passcode}
                    </div>
                    <div className="pt-2 border-t border-subtle/60 text-xs">
                      <SessionCountdown expiresAt={session.expires_at} onExpire={() => loadSession()} />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => endSession()}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 active:bg-red-500/30 text-red-600 dark:text-red-400 border border-red-500/20 text-sm font-semibold rounded-lg transition-all cursor-pointer"
                  >
                    <StopCircle className="w-4 h-4" />
                    <span>End Session</span>
                  </button>
                </div>

                {/* Manual Roster Side */}
                <div className="lg:col-span-2 bg-surface border border-subtle rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-subtle pb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-brand-500" />
                      <h2 className="text-base font-semibold text-main">Manual Check-In</h2>
                    </div>
                    <span className="text-xs text-muted font-medium">
                      {checkedInIds.length} checked in
                    </span>
                  </div>

                  <ManualRosterList
                    sessionId={session.id}
                    checkedInUserIds={checkedInIds}
                    eligibleUserIds={eligibleUserIds}
                    onCheckedIn={refreshCheckedIn}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}