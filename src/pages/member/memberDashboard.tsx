import { useState, useEffect, useCallback } from 'react';
import { useActiveOrg } from '../../hooks/useActiveOrg';
import { useAuth } from '../../hooks/useAuth';
import { useAnnouncements } from '../../hooks/useAnnouncements';
import { useEvents } from '../../hooks/useEvents';
import { useOngoingSessionsRealtime } from '../../hooks/useOngoingSessionRealtime';
import * as attendanceService from '../../services/attendanceServices';
import AnnouncementCard from '../../components/announcements/announcementsCard';
import { formatFullDate, formatTime } from '../../utils/dateHelpers';
import { Spinner } from '../../components/ui/Spinner';
import { useNavigate } from 'react-router';
import { 
  CalendarDays, 
  QrCode, 
  Radio, 
  CheckCircle2, 
  ChevronRight, 
  MapPin, 
  Clock, 
  Megaphone,
  Sparkles
} from 'lucide-react';

interface OngoingSession {
  id: string;
  events?: {
    title: string;
  } | null;
}

export default function MemberDashboardPage() {
  const { activeOrg } = useActiveOrg();
  const { user } = useAuth();
  const { announcements, loading: announcementsLoading } = useAnnouncements();
  const { events, loading: eventsLoading } = useEvents();
  const navigate = useNavigate();
  const [ongoingSessions, setOngoingSessions] = useState<OngoingSession[]>([]);
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);

  const refreshOngoing = useCallback(async () => {
    if (!activeOrg || !user) return;
    const sessions = (await attendanceService.getEligibleActiveSessionsForUser(
      activeOrg.id,
      user.id
    )) as unknown as OngoingSession[];
    setOngoingSessions(sessions);

    if (sessions.length > 0) {
      const checked = await attendanceService.hasUserCheckedIn(sessions[0].id, user.id);
      setAlreadyCheckedIn(checked);
    } else {
      setAlreadyCheckedIn(false);
    }
  }, [activeOrg?.id, user?.id]);

  useEffect(() => {
    refreshOngoing();
  }, [refreshOngoing]);

  useOngoingSessionsRealtime(activeOrg?.id ?? null, refreshOngoing);

  const nextEvent = events
    .filter((e) => new Date(e.start_time) > new Date())
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())[0];

  const recentAnnouncements = announcements.slice(0, 10);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner / Welcome Card */}
      <div className="bg-surface border border-subtle rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {activeOrg?.logo_url ? (
            <img
              src={activeOrg.logo_url}
              alt={activeOrg.name}
              className="w-14 h-14 rounded-xl object-cover border border-subtle shadow-sm shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xl shrink-0">
              {activeOrg?.name?.charAt(0) ?? 'O'}
            </div>
          )}
          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> Welcome Back
            </span>
            <h1 className="text-xl font-bold text-main tracking-tight mt-0.5">
              {activeOrg?.name ?? 'Organization Dashboard'}
            </h1>
          </div>
        </div>

        {/* Quick Actions */}
        <button
          type="button"
          onClick={() => navigate('/member/check-in')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer shrink-0"
        >
          <QrCode className="w-4 h-4" />
          <span>Check In Now</span>
        </button>
      </div>

      {/* Live / Ongoing Attendance Alert Banner */}
      {ongoingSessions.length > 0 && (
        alreadyCheckedIn ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3.5 text-emerald-900 dark:text-emerald-100">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 truncate">
                You&apos;re checked in — {ongoingSessions[0].events?.title}
              </p>
              <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
                Attendance is still open for other attendees.
              </p>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/member/check-in')}
            className="w-full text-left bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 rounded-xl p-4 flex items-center justify-between gap-4 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 shrink-0">
                <Radio className="w-5 h-5 animate-pulse" />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-surface animate-ping" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500 text-white">
                    Live
                  </span>
                  <p className="text-xs font-bold text-main truncate">
                    Attendance open now: {ongoingSessions[0].events?.title}
                  </p>
                </div>
                <p className="text-[11px] text-muted mt-0.5">Tap here to mark your attendance immediately</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>
        )
      )}

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Next Event Sidebar Card */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center gap-2 px-1">
            <CalendarDays className="w-4 h-4 text-brand-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Next Scheduled Event</h2>
          </div>

          <div className="bg-surface border border-subtle rounded-2xl p-5 shadow-sm space-y-4">
            {eventsLoading ? (
              <div className="flex items-center justify-center py-8 text-muted">
                <Spinner size="sm" className="text-brand-500" />
              </div>
            ) : nextEvent ? (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-main leading-snug">
                  {nextEvent.title}
                </h3>
                
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <Clock className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                    <span>
                      {formatFullDate(nextEvent.start_time)} · {formatTime(nextEvent.start_time)}
                    </span>
                  </div>

                  {nextEvent.location && (
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{nextEvent.location}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-muted">
                No upcoming events scheduled.
              </div>
            )}
          </div>
        </div>

        {/* Recent Announcements Feed */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-brand-500" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Recent Announcements</h2>
            </div>
            {announcements.length > 10 && (
              <button
                type="button"
                onClick={() => navigate('/member/announcements')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {announcementsLoading ? (
            <div className="bg-surface border border-subtle rounded-2xl p-8 flex items-center justify-center text-muted shadow-sm">
              <Spinner size="sm" className="text-brand-500" />
            </div>
          ) : recentAnnouncements.length === 0 ? (
            <div className="bg-surface border border-subtle rounded-2xl p-8 text-center text-xs text-muted shadow-sm">
              No announcements posted yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentAnnouncements.map((a) => (
                <AnnouncementCard 
                  key={a.id} 
                  id={a.id} 
                  title={a.title} 
                  content={a.content} 
                  createdAt={a.created_at} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}