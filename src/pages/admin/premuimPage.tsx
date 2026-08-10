import { useState } from 'react';
import { useSubscription } from '../../hooks/useSubscirptionservcies';
import ProofUploaderModal from '../../components/billing/proofUploaderModal';
import { getPlanLimits } from '../../utils/planLimits';
import { formatEnumLabel } from '../../utils/formatters';
import { formatFullDate } from '../../utils/dateHelpers';
import { Check, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { PlanTier } from '../../types/domain.types';

const upgradePlans: { tier: PlanTier; price: number; label: string }[] = [
  { tier: 'growth', price: 29, label: 'Pro' },
  { tier: 'enterprise', price: 99, label: 'Master' },
];

export default function PremiumPage() {
  const { currentPlan, subscriptionStatus, isExpired, expiresAt, refresh } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<{ tier: PlanTier; price: number } | null>(null);

  // Payment submitted, waiting on platform owner review
  if (subscriptionStatus === 'pending') {
    return (
      <div className="max-w-md">
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <h2 className="font-semibold text-slate-900 dark:text-white">Payment under review</h2>
          <p className="text-sm text-slate-500 mt-2">
            We've received your payment proof and are reviewing it. This usually takes 24-48 hours.
          </p>
        </div>
      </div>
    );
  }

  // Active plan, not expired — show current status, only offer higher tiers
  if (subscriptionStatus === 'active' && !isExpired && currentPlan !== 'free') {
    return (
      <div className="max-w-md">
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="font-semibold text-slate-900 dark:text-white">
            You're on the {formatEnumLabel(currentPlan)} plan
          </h2>
          {expiresAt && (
            <p className="text-sm text-slate-500 mt-2">
              Renews on {formatFullDate(expiresAt)}
            </p>
          )}
        </div>

        {currentPlan !== 'enterprise' && (
          <>
            <p className="text-sm text-slate-500 mt-6 mb-3">Want more? Upgrade further:</p>
            <UpgradeGrid currentPlan={currentPlan} onSelect={setSelectedPlan} />
          </>
        )}

        <ProofUploaderModal
          isOpen={!!selectedPlan}
          onClose={() => { setSelectedPlan(null); refresh(); }}
          planTier={selectedPlan?.tier ?? 'growth'}
          amount={selectedPlan?.price ?? 0}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Upgrade your plan</h1>
        <p className="text-sm text-slate-500 mt-1">
          Make a bank transfer for your chosen plan, then upload your receipt below. We'll activate it within 24-48 hours.
        </p>
      </div>

      {subscriptionStatus === 'rejected' && (
        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-300">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          Your last payment was rejected. Please resubmit with a valid receipt.
        </div>
      )}

      {isExpired && (
        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
          <Clock className="w-4 h-4 shrink-0" />
          Your {formatEnumLabel(currentPlan)} plan expired
          {expiresAt && ` on ${formatFullDate(expiresAt)}`}. Renew to restore full access.
        </div>
      )}

      <UpgradeGrid currentPlan={currentPlan} onSelect={setSelectedPlan} />

      <ProofUploaderModal
        isOpen={!!selectedPlan}
        onClose={() => { setSelectedPlan(null); refresh(); }}
        planTier={selectedPlan?.tier ?? 'growth'}
        amount={selectedPlan?.price ?? 0}
      />
    </div>
  );
}

function UpgradeGrid({
  currentPlan,
  onSelect,
}: {
  currentPlan: PlanTier;
  onSelect: (plan: { tier: PlanTier; price: number }) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {upgradePlans
        .filter((p) => p.tier !== currentPlan)
        .map((p) => {
          const limits = getPlanLimits(p.tier);
          return (
            <div key={p.tier} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{p.label}</h2>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                ${p.price}<span className="text-sm font-normal text-slate-500">/month</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-500">
                <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> {limits.maxMembers ?? 'Unlimited'} members</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> {limits.maxEventsPerMonth ?? 'Unlimited'} events/month</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> {limits.maxGroups ?? 'Unlimited'} groups</li>
              </ul>
              <button
                onClick={() => onSelect({ tier: p.tier, price: p.price })}
                className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg py-2.5"
              >
                Upgrade to {p.label}
              </button>
            </div>
          );
        })}
    </div>
  );
}