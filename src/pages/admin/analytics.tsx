import { useState } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useActiveOrg } from '../../hooks/useActiveOrg';
import AttendanceLineChart from '../../components/analytics/attendanceLineCharts';
import RetentionBarChart from '../../components/analytics/retentionBarCharts';
import ExportButtons from '../../components/analytics/exportButtons';
import { Spinner } from '../../components/ui/Spinner';
import { BarChart2, Users, UserCheck, UserX, Info } from 'lucide-react';

type Tab = 'recurring' | 'custom';

export default function AnalyticsPage() {
  const {
    recurringTrend,
    customTrend,
    retention,
    byGroup,
    loading,
    schedules,
    selectedScheduleId,
    setSelectedScheduleId,
  } = useAnalytics();
  
  const { activeOrg } = useActiveOrg();
  const [tab, setTab] = useState<Tab>('recurring');

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6 animate-in fade-in duration-300 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface border border-subtle rounded-xl p-5 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-main tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted mt-0.5 text-sm">
            Track member attendance trends and group activity insights.
          </p>
        </div>
        {!loading && (
          <div className="shrink-0">
            <ExportButtons
              data={tab === 'recurring' ? recurringTrend : customTrend}
              orgName={activeOrg?.name ?? 'Organization'}
            />
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-surface border border-subtle rounded-xl text-muted shadow-sm">
          <Spinner size="md" className="text-brand-500 mb-3" />
          <p className="text-xs font-medium">Crunching the numbers...</p>
        </div>
      ) : (
        <>
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface border border-subtle rounded-xl shadow-sm p-5 flex flex-col justify-between min-h-[110px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Total Members</span>
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-main tracking-tight mt-2">
                {retention?.totalMembers ?? 0}
              </p>
            </div>

            <div className="bg-surface border border-subtle rounded-xl shadow-sm p-5 flex flex-col justify-between min-h-[110px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Active (30 Days)</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight mt-2">
                {retention?.activeLast30Days ?? 0}
              </p>
            </div>

            <div className="bg-surface border border-subtle rounded-xl shadow-sm p-5 flex flex-col justify-between min-h-[110px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Inactive (30 Days)</span>
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <UserX className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 tracking-tight mt-2">
                {retention?.inactiveLast30Days ?? 0}
              </p>
            </div>
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
              Recurring Programs
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

          {/* Trend Chart Card */}
          {tab === 'recurring' ? (
            <div className="bg-surface border border-subtle rounded-xl shadow-sm p-5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-subtle pb-4">
                <div>
                  <h2 className="text-base font-semibold text-main">Attendance Trend</h2>
                  <p className="text-xs text-muted mt-0.5">Filter by scheduled recurring program</p>
                </div>
                <div className="relative w-full sm:w-auto min-w-[200px]">
                  <select
                    value={selectedScheduleId}
                    onChange={(e) => setSelectedScheduleId(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 bg-app border border-subtle rounded-lg text-xs font-medium text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all cursor-pointer appearance-none"
                  >
                    <option value="" disabled>Select a schedule...</option>
                    {schedules.map((s) => (
                      <option key={String(s.id)} value={String(s.id)}>
                        {String(s.title ?? '')}
                      </option>
                    ))}
                  </select>
                  {/* Custom dropdown arrow for better UI styling */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <AttendanceLineChart data={recurringTrend} />
            </div>
          ) : (
            <div className="bg-surface border border-subtle rounded-xl shadow-sm p-5 space-y-5">
              <div className="border-b border-subtle pb-4">
                <h2 className="text-base font-semibold text-main">Turnout by Event</h2>
                <p className="text-xs text-muted mt-0.5">Standalone event check-in volumes</p>
              </div>
              <AttendanceLineChart data={customTrend} />
            </div>
          )}

          {/* Group Breakdown Card */}
          <div className="bg-surface border border-subtle rounded-xl shadow-sm p-5 space-y-5">
            <div className="flex items-center gap-3 border-b border-subtle pb-4">
              <div className="w-10 h-10 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-main">Attendance by Group</h2>
                <p className="text-xs text-muted mt-0.5">Participation across organization groups</p>
              </div>
            </div>

            {byGroup.every((g) => g.attendeeCount === 0) ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-subtle rounded-xl bg-app/50">
                <Info className="w-5 h-5 text-muted mb-2" />
                <p className="text-xs font-medium text-main">No group data available</p>
                <p className="text-xs text-muted mt-1 max-w-sm">
                  This populates once a group (e.g., Choir) has completed attendance sessions.
                </p>
              </div>
            ) : (
              <RetentionBarChart data={byGroup} />
            )}
          </div>
        </>
      )}
    </div>
  );
}