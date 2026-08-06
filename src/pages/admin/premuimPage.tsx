import { useState } from 'react';
import { useSubscription } from '../../hooks/useSubscirptionservcies'
import ProofUploaderModal from '../../components/billing/proofUploaderModal';
import { getPlanLimits } from '../../utils/planLimits';
import { Check } from 'lucide-react';
import type { PlanTier } from '../../types/domain.types';

const upgradePlans: { tier: PlanTier; price: number; label: string }[] = [
  { tier: 'growth', price: 29, label: 'Pro' },
  { tier: 'enterprise', price: 99, label: 'Master' },
];

export default function PremiumPage() {
  const { currentPlan } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<{ tier: PlanTier; price: number } | null>(null);

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold text-[var(--text-main)]">Upgrade your plan</h1>
      <p className="text-sm text-[var(--text-muted)]">
        Make a bank transfer for your chosen plan, then upload your receipt below. We'll activate it within 24-48 hours.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {upgradePlans
          .filter((p) => p.tier !== currentPlan)
          .map((p) => {
            const limits = getPlanLimits(p.tier);
            return (
              <div key={p.tier} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
                <h2 className="text-lg font-semibold text-[var(--text-main)]">{p.label}</h2>
                <p className="text-2xl font-bold text-[var(--text-main)] mt-1">${p.price}<span className="text-sm font-normal text-[var(--text-muted)]">/month</span></p>
                <ul className="mt-4 space-y-2 text-sm text-[var(--text-muted)]">
                  <li className="flex gap-2"><Check className="w-4 h-4 text-accent-600 shrink-0" /> {limits.maxMembers ?? 'Unlimited'} members</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-accent-600 shrink-0" /> {limits.maxEventsPerMonth ?? 'Unlimited'} events/month</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-accent-600 shrink-0" /> {limits.maxGroups ?? 'Unlimited'} groups</li>
                </ul>
                <button
                  onClick={() => setSelectedPlan({ tier: p.tier, price: p.price })}
                  className="w-full mt-5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg py-2.5"
                >
                  Upgrade to {p.label}
                </button>
              </div>
            );
          })}
      </div>

      <ProofUploaderModal
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        planTier={selectedPlan?.tier ?? 'growth'}
        amount={selectedPlan?.price ?? 0}
      />
    </div>
  );
}