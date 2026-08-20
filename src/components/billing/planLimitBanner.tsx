import { useSubscription } from '../../hooks/useSubscirptionservcies';
import { getPlanLimits, getEffectivePlanForLimits } from '../../utils/planLimits';
import { formatEnumLabel } from '../../utils/formatters';
import { useNavigate } from 'react-router';
import { AlertTriangle, Clock, CreditCard, ArrowUpCircle } from 'lucide-react';

interface Props {
  currentCount: number;
  metric: 'members' | 'groups' | 'events';
}

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

  // 1. Rejected Payment State (Critical Error)
  if (subscriptionStatus === 'rejected') {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-in fade-in duration-300">
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">
            Your last payment was rejected. Please review and resubmit.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/billing')}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors shrink-0 cursor-pointer"
        >
          <CreditCard className="w-4 h-4" />
          <span>View details</span>
        </button>
      </div>
    );
  }

  // 2. Expired Plan State (Warning)
  if (isExpired) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 animate-in fade-in duration-300">
        <div className="flex items-center gap-3 text-amber-700 dark:text-amber-400">
          <Clock className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">
            Your {formatEnumLabel(currentPlan)} plan has expired. Renew to keep full access.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/premium')}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors shrink-0 cursor-pointer"
        >
          <Clock className="w-4 h-4" />
          <span>Renew now</span>
        </button>
      </div>
    );
  }

  // 3. Plan Limits State
  if (limit === null) return null; // Unlimited

  const atLimit = currentCount >= limit;
  const nearLimit = currentCount >= limit * 0.8;
  const usagePercentage = Math.min(Math.round((currentCount / limit) * 100), 100);

  if (!nearLimit) return null; // Only show if >= 80%

  // Dynamic styling based on how close they are to the limit
  const bannerStyle = atLimit 
    ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400' 
    : 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400';

  const progressColor = atLimit ? 'bg-red-500' : 'bg-amber-500';

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300 ${bannerStyle}`}>
      
      <div className="flex-1 w-full space-y-2">
        <div className="flex items-start sm:items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-sm font-medium">
            {atLimit
              ? `You've reached your ${formatEnumLabel(effectivePlan)} plan limit of ${limit} ${metric}.`
              : `You're using ${currentCount}/${limit} ${metric} on your ${formatEnumLabel(effectivePlan)} plan.`}
          </p>
        </div>
        
        {/* Sleek Mini Progress Bar */}
        <div className="ml-7 sm:max-w-xs h-1.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${progressColor}`} 
            style={{ width: `${usagePercentage}%` }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate('/premium')}
        className={`flex items-center justify-center gap-1.5 px-3 py-1.5 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors shrink-0 cursor-pointer ${
          atLimit ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'
        }`}
      >
        <ArrowUpCircle className="w-4 h-4" />
        <span>Upgrade plan</span>
      </button>
    </div>
  );
}