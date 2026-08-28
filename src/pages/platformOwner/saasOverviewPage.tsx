import { useState, useEffect } from 'react';
import * as subscriptionService from '../../services/subscriptionServices';
import { formatCurrency, formatEnumLabel } from '../../utils/formatters';
import { Building2, DollarSign, PieChart } from 'lucide-react';
import type { SaaSOverviewStats } from '../../services/subscriptionServices';

export default function SaaSOverviewPage() {
  const [stats, setStats] = useState<SaaSOverviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    subscriptionService.getSaaSOverview().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading || !stats) {
    return <p className="text-sm text-slate-500">Loading...</p>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">SaaS Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center mb-3">
            <Building2 className="w-5 h-5" />
          </div>
          <p className="text-3xl font-semibold text-slate-900 dark:text-white">{stats.totalChurches}</p>
          <p className="text-sm text-slate-500 mt-1">Total Churches</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-3xl font-semibold text-slate-900 dark:text-white">
            {formatCurrency(stats.totalRevenue, 'NGN')}
          </p>
          <p className="text-sm text-slate-500 mt-1">Total Active Revenue</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <PieChart className="w-4 h-4" /> Plan Breakdown
        </h2>
        <div className="space-y-3">
          {stats.planBreakdown.map(({ plan, count }) => {
            const percentage = stats.totalChurches > 0 ? Math.round((count / stats.totalChurches) * 100) : 0;
            return (
              <div key={plan}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-slate-900 dark:text-white">{formatEnumLabel(plan)}</span>
                  <span className="text-slate-500">{count} ({percentage}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}