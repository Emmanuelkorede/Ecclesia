import { useState } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useActiveOrg } from '../../hooks/useActiveOrg';
import AttendanceLineChart from '../../components/analytics/attendanceLineCharts';
import RetentionBarChart from '../../components/analytics/retentionBarCharts';
import ExportButtons from '../../components/analytics/exportButtons';

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
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Analytics</h1>
        {!loading && (
          <ExportButtons
            data={tab === 'recurring' ? recurringTrend : customTrend}
            orgName={activeOrg?.name ?? 'church'}
          />
        )}
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading analytics...</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">{retention?.totalMembers ?? 0}</p>
              <p className="text-xs text-slate-500 mt-1">Total Members</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
              <p className="text-2xl font-semibold text-emerald-600">{retention?.activeLast30Days ?? 0}</p>
              <p className="text-xs text-slate-500 mt-1">Active (30 days)</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
              <p className="text-2xl font-semibold text-red-500">{retention?.inactiveLast30Days ?? 0}</p>
              <p className="text-xs text-slate-500 mt-1">Inactive (30 days)</p>
            </div>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-slate-200/60 dark:bg-slate-800/80 max-w-xs">
            <button
              onClick={() => setTab('recurring')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg ${tab === 'recurring' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white' : 'text-slate-500'}`}
            >
              Recurring Programs
            </button>
            <button
              onClick={() => setTab('custom')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg ${tab === 'custom' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white' : 'text-slate-500'}`}
            >
              Custom Events
            </button>
          </div>

          {tab === 'recurring' ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-900 dark:text-white">Attendance Trend</h2>
                <select
                  value={selectedScheduleId}
                  onChange={(e) => setSelectedScheduleId(e.target.value)}
                  className="rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-1.5 text-sm text-slate-900 dark:text-white"
                >
                  {schedules.map((s) => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>
              <AttendanceLineChart
                data={recurringTrend.map((p) => ({ eventTitle: p.label, eventDate: p.date, attendeeCount: p.attendeeCount }))}
              />
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Turnout by Event</h2>
              <AttendanceLineChart
                data={customTrend.map((p) => ({ eventTitle: p.label, eventDate: p.date, attendeeCount: p.attendeeCount }))}
              />
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Attendance by Group</h2>
            {byGroup.every((g) => g.attendeeCount === 0) ? (
              <p className="text-sm text-slate-500">
                No group-restricted attendance recorded yet. This populates once a group (e.g. Choir) has attendance sessions with check-ins.
              </p>
            ) : (
              <RetentionBarChart data={byGroup} />
            )}
          </div>
        </>
      )}
    </div>
  );
}