import { useState } from 'react';
import { useActiveOrg } from '../../hooks/useActiveOrg';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useMemberships } from '../../hooks/useMembership';
import { useGroups } from '../../hooks/useGroups';
import { useEvents } from '../../hooks/useEvents';
import AttendanceLineChart from '../../components/analytics/attendanceLineCharts';
import { Spinner } from '../../components/ui/Spinner';
import { Users, Layers, CalendarDays, TrendingUp, Building2 } from 'lucide-react';

type Tab = 'recurring' | 'custom';

export default function DashboardPage() {
  const { activeOrg } = useActiveOrg();
  const { recurringTrend, customTrend, retention, loading: analyticsLoading } = useAnalytics();
  const { members } = useMemberships();
  const { groups } = useGroups();
  const { events } = useEvents();

  const [tab, setTab] = useState<Tab>('recurring');

  const activeMembers = members.filter((m) => m.status === 'active').length;
  const upcomingEvents = events.filter((e) => new Date(e.start_time) > new Date()).length;

  const stats = [
    { label: 'Active Members', value: activeMembers, icon: Users, color: 'brand' },
    { label: 'Groups', value: groups.length, icon: Layers, color: 'emerald' },
    { label: 'Upcoming Events', value: upcomingEvents, icon: CalendarDays, color: 'brand' },
    { label: 'Active Last 30 Days', value: retention?.activeLast30Days ?? 0, icon: TrendingUp, color: 'emerald' },
  ];

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6 animate-in fade-in duration-300 pb-8">
      {/* Page Header */}
      <div className="flex items-center gap-4 bg-surface border border-subtle rounded-xl p-5 shadow-sm">
        {activeOrg?.logo_url ? (
          <img src={activeOrg.logo_url} alt="" className="w-12 h-12 rounded-xl object-cover border border-subtle shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0 border border-brand-500/20">
            <Building2 className="w-6 h-6" />
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold text-main tracking-tight">{activeOrg?.name ?? 'Dashboard'}</h1>
          <p className="text-xs text-muted mt-0.5">
            Welcome back — here's what's happening with your organization workspace.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-surface border border-subtle rounded-xl p-5 shadow-sm flex flex-col justify-between min-h-[110px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">{label}</span>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                  color === 'brand'
                    ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-main tracking-tight mt-2">{value}</p>
          </div>
        ))}
      </div>

      {/* Attendance Trend Section with Tabs */}
      <div className="bg-surface border border-subtle rounded-xl shadow-sm p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-subtle pb-4">
          <div>
            <h2 className="text-base font-semibold text-main">Attendance Trend</h2>
            <p className="text-xs text-muted mt-0.5">Overview of program and event turnouts</p>
          </div>

          {/* Tab Selector (Segmented Control) */}
          <div className="inline-flex items-center p-1 rounded-lg bg-app border border-subtle w-full sm:max-w-xs shadow-inner">
            <button
              type="button"
              onClick={() => setTab('recurring')}
              className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                tab === 'recurring'
                  ? 'bg-surface text-main shadow-sm border border-subtle/50'
                  : 'text-muted hover:text-main border border-transparent'
              }`}
            >
              Recurring
            </button>
            <button
              type="button"
              onClick={() => setTab('custom')}
              className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                tab === 'custom'
                  ? 'bg-surface text-main shadow-sm border border-subtle/50'
                  : 'text-muted hover:text-main border border-transparent'
              }`}
            >
              Custom Events
            </button>
          </div>
        </div>

        {analyticsLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted">
            <Spinner size="md" className="text-brand-500 mb-2" />
            <p className="text-xs font-medium">Loading trend chart...</p>
          </div>
        ) : (
          <AttendanceLineChart data={tab === 'recurring' ? recurringTrend : customTrend} />
        )}
      </div>
    </div>
  );
}