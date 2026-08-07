import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import * as attendanceService from '../../services/attendaceServices';
import { formatFullDate, formatTime } from '../../utils/dateHelpers';
import { CheckCircle2, Flame, TrendingUp } from 'lucide-react';

interface LogWithSession {
  id: string;
  timestamp: string;
  check_in_method: string;
  attendance_sessions: {
    event_id: string;
    events: { title: string; start_time: string } | null;
  } | null;
}

export default function MyAttendancePage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<LogWithSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    attendanceService
      .getMyAttendanceLogs(user.id)
      .then((data) => setLogs(data as any))
      .finally(() => setLoading(false));
  }, [user?.id]);

  // Simple streak: count consecutive most-recent check-ins with no gap
  // beyond 8 days between them (rough "didn't miss a week" heuristic)
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
    (l) => new Date(l.timestamp).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
  ).length;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">My Attendance</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center mb-2">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-2xl font-semibold text-slate-900 dark:text-white">{logs.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Total Check-ins</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
          <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mb-2">
            <Flame className="w-5 h-5" />
          </div>
          <p className="text-2xl font-semibold text-slate-900 dark:text-white">{streak}</p>
          <p className="text-xs text-slate-500 mt-0.5">Current Streak</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-2xl font-semibold text-slate-900 dark:text-white">{last30}</p>
          <p className="text-xs text-slate-500 mt-0.5">Last 30 Days</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 dark:text-white text-sm">History</h2>
        </div>

        {loading ? (
          <p className="px-4 py-6 text-sm text-slate-500">Loading...</p>
        ) : logs.length === 0 ? (
          <p className="px-4 py-6 text-sm text-slate-500">No check-ins yet.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 last:border-0">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {log.attendance_sessions?.events?.title ?? 'Event'}
                </p>
                <p className="text-xs text-slate-500">
                  {formatFullDate(log.timestamp)} · {formatTime(log.timestamp)}
                </p>
              </div>
              <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full capitalize">
                {log.check_in_method}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}