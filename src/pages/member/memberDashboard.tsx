import { useState, useEffect } from 'react';
import { useActiveOrg } from '../../hooks/useActiveOrg';
import { useAuth } from '../../hooks/useAuth';
import { useAnnouncements } from '../../hooks/useAnnoucments';
import { useEvents } from '../../hooks/useEvents';
import * as attendanceService from '../../services/attendaceServices';
import { formatRelativeTime, formatFullDate, formatTime } from '../../utils/dateHelpers';
import { useNavigate } from 'react-router';
import { CalendarDays, QrCode, Radio, CheckCircle2 } from 'lucide-react';

export default function MemberDashboardPage() {
  const { activeOrg } = useActiveOrg();
  const { user } = useAuth();
  const { announcements, loading: announcementsLoading } = useAnnouncements();
  const { events, loading: eventsLoading } = useEvents();
  const navigate = useNavigate();
  const [ongoingSessions, setOngoingSessions] = useState<any[]>([]);
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);

  useEffect(() => {
    if (!activeOrg) return;
    attendanceService.getActiveSessionsForOrg(activeOrg.id).then(setOngoingSessions);
  }, [activeOrg?.id]);

  useEffect(() => {
    if (!user || ongoingSessions.length === 0) {
      setAlreadyCheckedIn(false);
      return;
    }
    attendanceService.hasUserCheckedIn(ongoingSessions[0].id, user.id).then(setAlreadyCheckedIn);
  }, [ongoingSessions, user?.id]);

  const nextEvent = events
    .filter((e) => new Date(e.start_time) > new Date())
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())[0];

  const recentAnnouncements = announcements.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {activeOrg?.logo_url && (
          <img src={activeOrg.logo_url} alt="" className="w-12 h-12 rounded-xl object-cover" />
        )}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{activeOrg?.name}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back</p>
        </div>
      </div>

      {ongoingSessions.length > 0 && (
        alreadyCheckedIn ? (
          <div className="w-full flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
            <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                You're checked in — {ongoingSessions[0].events?.title}
              </p>
              <p className="text-xs text-slate-500">Attendance is still open for others</p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate('/member/check-in')}
            className="w-full flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-2xl p-4 text-left"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 flex items-center justify-center shrink-0 animate-pulse">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                Attendance open now: {ongoingSessions[0].events?.title}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">Tap to check in</p>
            </div>
          </button>
        )
      )}

      <button
        onClick={() => navigate('/member/check-in')}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-2xl py-4"
      >
        <QrCode className="w-5 h-5" />
        Check In Now
      </button>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <CalendarDays className="w-4 h-4" /> Next Event
        </h2>
        {eventsLoading ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading...</p>
        ) : nextEvent ? (
          <div>
            <p className="font-medium text-slate-900 dark:text-white">{nextEvent.title}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {formatFullDate(nextEvent.start_time)} · {formatTime(nextEvent.start_time)}
            </p>
            {nextEvent.location && (
              <p className="text-sm text-slate-500 dark:text-slate-400">{nextEvent.location}</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">No upcoming events scheduled.</p>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-3">Recent Announcements</h2>
        {announcementsLoading ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading...</p>
        ) : recentAnnouncements.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No announcements yet.</p>
        ) : (
          <div className="space-y-3">
            {recentAnnouncements.map((a) => (
              <div
                key={a.id}
                className="border-t border-slate-200 dark:border-slate-700 pt-3 first:border-0 first:pt-0 cursor-pointer"
                onClick={() => navigate(`/member/announcements/${a.id}`)}
              >
                <p className="text-sm font-medium text-slate-900 dark:text-white">{a.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{a.content}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {formatRelativeTime(a.created_at ?? '')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}