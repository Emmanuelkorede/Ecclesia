import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import * as attendanceService from '../../services/attendanceServices';
import { formatFullDate, formatTime } from '../../utils/dateHelpers';
import { CheckCircle2, Flame, TrendingUp, Calendar, History } from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';

interface LogWithSession {
  id: string;
  timestamp: string;
  check_in_method: string;
  attendance_sessions: {
    event_id: string | null;
    session_date: string | null;
    events: { title: string; start_time: string } | null;
    church_schedules: { title: string } | null;
  } | null;
}

export default function MyAttendancePage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<LogWithSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Safely initialize the current timestamp once on mount
  const [now] = useState(() => Date.now());
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    attendanceService
      .getMyAttendanceLogs(user.id)
      .then((data) => setLogs(data as unknown as LogWithSession[]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  // Simple streak: count consecutive most-recent check-ins with no gap
  // beyond 8 days between them
  const streak = (() => {
    if (logs.length === 0) return 0;
    let count = 1;
    for (let i = 0; i < logs.length - 1; i++) {
      const current = new Date(logs[i].timestamp).getTime();
      const next = new Date(logs[i + 1].timestamp).getTime();
      const diffDays = (current - next) / (1000 * 60 * 60 * 24);
      if (diffDays <= 8) count++;
      else break;
    }
    return count;
  })();

  const last30 = logs.filter(
    (l) => new Date(l.timestamp).getTime() > thirtyDaysAgo
  ).length;

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6 animate-in fade-in duration-300 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-main tracking-tight">My Attendance</h1>
        <p className="text-muted mt-1 text-sm">
          Track your attendance history, stay consistent, and monitor your attendance streak.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Check-ins */}
        <div className="bg-surface border border-subtle rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Total Check-ins</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-main tracking-tight">{logs.length}</p>
        </div>

        {/* Current Streak */}
        <div className="bg-surface border border-subtle rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Current Streak</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-main tracking-tight">
            {streak} <span className="text-xs font-medium text-muted">weeks</span>
          </p>
        </div>

        {/* Last 30 Days */}
        <div className="bg-surface border border-subtle rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Last 30 Days</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-main tracking-tight">{last30}</p>
        </div>
      </div>

      {/* History Card */}
      <div className="bg-surface border border-subtle rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-subtle bg-app/50 flex items-center gap-2">
          <History className="w-4 h-4 text-muted" />
          <h2 className="font-semibold text-main text-sm">Attendance Log</h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted">
            <Spinner size="md" className="text-brand-500 mb-3" />
            <p className="text-sm font-medium">Loading attendance records...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <Calendar className="w-10 h-10 text-muted mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium text-main">No check-ins yet</p>
            <p className="text-xs text-muted mt-1">Your attendance activity will show up here after you check in to services or events.</p>
          </div>
        ) : (
          <div className="divide-y divide-subtle">
            {logs.map((log) => {
              const session = log.attendance_sessions;
              const title = session?.events?.title ?? session?.church_schedules?.title ?? 'Service / Event';
              return (
                <div key={log.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-app/50 transition-colors">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-main">{title}</p>
                    <p className="text-xs font-medium text-muted">
                      {formatFullDate(log.timestamp)} · {formatTime(log.timestamp)}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md bg-brand-soft text-brand-700 dark:text-brand-400 border border-brand-500/20 capitalize shrink-0">
                    {log.check_in_method}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
