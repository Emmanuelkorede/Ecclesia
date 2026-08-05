import { useAnalytics } from '../../hooks/useAnalytics';
import { useActiveOrg } from '../../hooks/useActiveOrg';
import AttendanceLineChart from '../../components/analytics/attendanceLineCharts';
import RetentionBarChart from '../../components/analytics/retentionBarCharts';
import ExportButtons from '../../components/analytics/exportButtons';

export default function AnalyticsPage() {
  const { trend, retention, byGroup, loading } = useAnalytics();
  const { activeOrg } = useActiveOrg();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--text-main)]">Analytics</h1>
        {!loading && <ExportButtons data={trend} orgName={activeOrg?.name ?? 'church'} />}
      </div>

      {loading ? (
        <p className="text-sm text-[var(--text-muted)]">Loading analytics...</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-4">
              <p className="text-2xl font-semibold text-[var(--text-main)]">{retention?.totalMembers ?? 0}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Total Members</p>
            </div>
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-4">
              <p className="text-2xl font-semibold text-accent-600">{retention?.activeLast30Days ?? 0}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Active (30 days)</p>
            </div>
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-4">
              <p className="text-2xl font-semibold text-red-500">{retention?.inactiveLast30Days ?? 0}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Inactive (30 days)</p>
            </div>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
            <h2 className="font-semibold text-[var(--text-main)] mb-4">Attendance Trend</h2>
            <AttendanceLineChart data={trend} />
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
            <h2 className="font-semibold text-[var(--text-main)] mb-4">Attendance by Group</h2>
            <RetentionBarChart data={byGroup} />
          </div>
        </>
      )}
    </div>
  );
}