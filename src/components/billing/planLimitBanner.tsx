import { useSubscription } from '../../hooks/useSubscirptionservcies';
import { getPlanLimits, getEffectivePlanForLimits } from '../../utils/planLimits';
import { formatEnumLabel } from '../../utils/formatters';
import { useNavigate } from 'react-router';
import { AlertTriangle, Clock } from 'lucide-react';

interface Props {
  currentCount: number;
  metric: 'members' | 'groups' | 'events';
}

// One reusable banner used across MembersPage, GroupsPage, EventsPage —
export default function PlanLimitBanner({ currentCount, metric }: Props) {
  const { currentPlan, isExpired, subscriptionStatus } = useSubscription();
  const navigate = useNavigate();

  const effectivePlan = getEffectivePlanForLimits(currentPlan, isExpired);
  const limits = getPlanLimits(effectivePlan);

  const limitMap = {
    members: limits.maxMembers,
    groups: limits.maxGroups,
    events: limits.maxEventsPerMonth,
  };
  const limit = limitMap[metric];

  // Rejected payment — show that specifically, takes priority
  if (subscriptionStatus === 'rejected') {
    return (
      <div className="flex items-center justify-between gap-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          Your last payment was rejected. Please review and resubmit.
        </div>
        <button
          onClick={() => navigate('/admin/billing')}
          className="text-sm font-medium text-red-700 dark:text-red-300 underline shrink-0"
        >
          View details
        </button>
      </div>
    );
  }

  // Plan expired — restricted, prompt renewal
  if (isExpired) {
    return (
      <div className="flex items-center justify-between gap-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
          <Clock className="w-4 h-4 shrink-0" />
          Your {formatEnumLabel(currentPlan)} plan has expired. Renew to keep full access.
        </div>
        <button
          onClick={() => navigate('/premium')}
          className="text-sm font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-3 py-1.5 shrink-0"
        >
          Renew
        </button>
      </div>
    );
  }

  // No limit on this metric (enterprise, or unlimited tier) — nothing to show
  if (limit === null) return null;

  const atLimit = currentCount >= limit;
  const nearLimit = currentCount >= limit * 0.8;

  if (!nearLimit) return null; // don't clutter the UI until it's actually relevant

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-xl px-4 py-3 mb-4 border ${
        atLimit
          ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900'
          : 'bg-brand-50 dark:bg-brand-950/30 border-brand-200 dark:border-brand-900'
      }`}
    >
      <div
        className={`flex items-center gap-2 text-sm ${
          atLimit ? 'text-red-700 dark:text-red-300' : 'text-brand-700 dark:text-brand-300'
        }`}
      >
        <AlertTriangle className="w-4 h-4 shrink-0" />
        {atLimit
          ? `You've reached your ${formatEnumLabel(effectivePlan)} plan limit of ${limit} ${metric}.`
          : `You're using ${currentCount}/${limit} ${metric} on your ${formatEnumLabel(effectivePlan)} plan.`}
      </div>
      <button
        onClick={() => navigate('/premium')}
        className="text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white rounded-lg px-3 py-1.5 shrink-0"
      >
        Upgrade
      </button>
    </div>
  );
}