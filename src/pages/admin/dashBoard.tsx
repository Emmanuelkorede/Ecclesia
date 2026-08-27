import { useActiveOrg } from '../../hooks/useActiveOrg';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useMemberships } from '../../hooks/useMembership';
import { useGroups } from '../../hooks/useGroups';
import { useEvents } from '../../hooks/useEvents';
import AttendanceLineChart from '../../components/analytics/attendanceLineCharts';
import { Users, Layers, CalendarDays, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { activeOrg } = useActiveOrg();
  const { recurringTrend, retention, loading: analyticsLoading } = useAnalytics();
  const { members } = useMemberships();
  const { groups } = useGroups();
  const { events } = useEvents();

  const activeMembers = members.filter((m) => m.status === 'active').length;
  const upcomingEvents = events.filter((e) => new Date(e.start_time) > new Date()).length;

  const stats = [
    { label: 'Active Members', value: activeMembers, icon: Users, color: 'brand' },
    { label: 'Groups', value: groups.length, icon: Layers, color: 'accent' },
    { label: 'Upcoming Events', value: upcomingEvents, icon: CalendarDays, color: 'brand' },
    { label: 'Active Last 30 Days', value: retention?.activeLast30Days ?? 0, icon: TrendingUp, color: 'accent' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {activeOrg?.logo_url && (
          <img src={activeOrg.logo_url} alt="" className="w-12 h-12 rounded-xl object-cover" />
        )}
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-main)]">{activeOrg?.name}</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Welcome back — here's what's happening with your church
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-4 shadow-[var(--card-shadow)]"
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                color === 'brand'
                  ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400'
                  : 'bg-accent-50 dark:bg-accent-950/40 text-accent-600 dark:text-accent-400'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-semibold text-[var(--text-main)]">{value}</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 shadow-[var(--card-shadow)]">
        <h2 className="font-semibold text-[var(--text-main)] mb-4">Attendance Trend</h2>
        {analyticsLoading ? (
          <p className="text-sm text-[var(--text-muted)]">Loading...</p>
        ) : (
          <AttendanceLineChart
            data={recurringTrend.map((p) => ({ eventTitle: p.label, eventDate: p.date, attendeeCount: p.attendeeCount }))}
          />
        )}
      </div>
    </div>
  );
}