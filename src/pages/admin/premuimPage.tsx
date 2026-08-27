import { useState } from 'react';
import { useSubscription } from '../../hooks/useSubscriptionServices';
import ProofUploaderModal from '../../components/billing/proofUploaderModal';
import { getPlanLimits } from '../../utils/planLimits';
import { formatEnumLabel } from '../../utils/formatters';
import { formatFullDate } from '../../utils/dateHelpers';
import { 
  Check, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Landmark, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import type { PlanTier } from '../../types/domain.types';

const upgradePlans: { tier: PlanTier; price: number; priceFormatted: string; label: string }[] = [
  { tier: 'growth', price: 10500, priceFormatted: '₦10,500', label: 'Pro' },
  { tier: 'enterprise', price: 29500, priceFormatted: '₦29,500', label: 'Master' },
];

const BANK_DETAILS = {
  bankName: 'Guaranty Trust Bank (GTB)',
  accountName: 'Your Company Name Ltd',
  accountNumber: '0123456789',
};

export default function PremiumPage() {
  const { currentPlan, subscriptionStatus, isExpired, expiresAt, refresh } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<{ tier: PlanTier; price: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(BANK_DETAILS.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // State 1: Payment submitted, waiting review
  if (subscriptionStatus === 'pending') {
    return (
      <div className="max-w-xl mx-auto mt-10 p-8 sm:p-12 text-center bg-surface border border-subtle rounded-2xl shadow-xs animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-brand-soft text-brand-600 rounded-full flex items-center justify-center mx-auto mb-5">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>
        <h2 className="text-xl font-bold text-main mb-2 tracking-tight">Payment Under Review</h2>
        <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
          We've received your payment proof and are verifying the transfer. This usually takes 24-48 hours. We'll email you once your account is upgraded!
        </p>
      </div>
    );
  }

  // State 2: Active plan, not expired
  if (subscriptionStatus === 'active' && !isExpired && currentPlan !== 'free') {
    return (
      <div className="max-w-3xl mx-auto w-full space-y-8 animate-in fade-in duration-200 pb-10 px-4 sm:px-0">
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-emerald-800 dark:text-emerald-400">
              You're on the {formatEnumLabel(currentPlan)} plan
            </h2>
            {expiresAt && (
              <p className="text-emerald-700/80 dark:text-emerald-500 text-sm mt-1">
                Your plan is active and renews on {formatFullDate(expiresAt)}
              </p>
            )}
          </div>
        </div>

        {currentPlan !== 'enterprise' && (
          <div className="space-y-5 pt-2">
            <h3 className="text-base font-bold text-main tracking-tight">Ready for more? Upgrade further:</h3>
            <UpgradeGrid currentPlan={currentPlan} onSelect={setSelectedPlan} />
          </div>
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

  // State 3: Default Upgrade Flow (Free, Expired, or Rejected)
  return (
    <div className="max-w-3xl mx-auto w-full space-y-8 animate-in fade-in duration-200 pb-12 px-4 sm:px-0">
      
      {/* Header */}
      <div className="text-center max-w-lg mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-main tracking-tight">
          Upgrade Your Plan
        </h1>
        <p className="text-sm text-muted leading-relaxed">
          Make a direct bank transfer, upload your payment receipt, and we will activate your plan within 24-48 hours.
        </p>
      </div>

      {/* Contextual Alerts */}
      {subscriptionStatus === 'rejected' && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>Payment rejected. Please ensure your receipt is clear and resubmit.</span>
        </div>
      )}

      {isExpired && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm">
          <Clock className="w-5 h-5 shrink-0" />
          <span>Your {formatEnumLabel(currentPlan)} plan expired {expiresAt ? `on ${formatFullDate(expiresAt)}` : ''}. Renew to restore full access.</span>
        </div>
      )}

      {/* Transfer Details & Instructions Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Step-by-Step Instructions */}
        <section className="bg-surface border border-subtle rounded-2xl p-6 shadow-xs">
          <h2 className="text-sm font-bold text-main uppercase tracking-wider mb-5 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-500" />
            How to Upgrade
          </h2>
          <ol className="space-y-5 relative before:absolute before:inset-y-0 before:left-[13px] before:w-[2px] before:bg-subtle">
            {[
              "Copy account details and transfer the exact amount.",
              "Take a screenshot or download the transfer receipt.",
              "Select a plan below and upload your proof."
            ].map((step, i) => (
              <li key={i} className="relative flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ring-4 ring-surface">
                  {i + 1}
                </div>
                <p className="text-sm text-muted mt-0.5 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Bank Account Details Card */}
        <section className="bg-surface border border-subtle rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Landmark className="w-32 h-32" />
          </div>
          
          <h2 className="text-sm font-bold text-main uppercase tracking-wider mb-5 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-brand-500" />
            Bank Transfer Details
          </h2>

          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted">Bank Name</span>
              <span className="font-semibold text-main">{BANK_DETAILS.bankName}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted">Account Name</span>
              <span className="font-semibold text-main truncate max-w-[180px] sm:max-w-xs">{BANK_DETAILS.accountName}</span>
            </div>
            
            <div className="pt-4 border-t border-subtle">
              <span className="text-[11px] text-muted font-bold uppercase tracking-wider block mb-2">Account Number</span>
              <div className="flex items-center justify-between gap-3 bg-app p-3 rounded-xl border border-subtle">
                <span className="text-lg font-mono font-bold tracking-wider text-main">{BANK_DETAILS.accountNumber}</span>
                <button 
                  type="button" 
                  onClick={handleCopyAccount}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-surface hover:bg-subtle border border-subtle text-main rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-muted" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Pricing Grid */}
      <div className="pt-6 border-t border-subtle space-y-5">
        <h2 className="text-lg font-bold text-center text-main tracking-tight">Choose Your Upgrade Plan</h2>
        <UpgradeGrid currentPlan={currentPlan} onSelect={setSelectedPlan} />
      </div>

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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {upgradePlans
        .filter((p) => p.tier !== currentPlan)
        .map((p) => {
          const limits = getPlanLimits(p.tier);
          const isMaster = p.tier === 'enterprise';
          
          return (
            <div 
              key={p.tier} 
              className={`flex flex-col justify-between bg-surface border rounded-2xl p-6 shadow-xs transition-all hover:border-brand-500/50 hover:shadow-sm ${
                isMaster ? 'border-brand-500 relative' : 'border-subtle'
              }`}
            >
              {isMaster && (
                <div className="absolute top-0 right-6 -translate-y-1/2 px-3 py-1 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                  Recommended
                </div>
              )}
              
              <div>
                <div className="flex items-baseline justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-bold text-main leading-none">{p.label}</h3>
                    <p className="text-xs text-muted capitalize mt-1.5">{p.tier} tier</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-main">{p.priceFormatted}</span>
                    <span className="text-xs text-muted font-medium ml-1">/mo</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6 pt-4 border-t border-subtle">
                  {[
                    `${limits.maxMembers ?? 'Unlimited'} members`,
                    `${limits.maxEventsPerMonth ?? 'Unlimited'} events/month`,
                    `${limits.maxGroups ?? 'Unlimited'} groups`
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-muted">
                      <Check className="w-4 h-4 text-brand-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => onSelect({ tier: p.tier, price: p.price })}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  isMaster 
                    ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-xs' 
                    : 'bg-app hover:bg-subtle/50 border border-subtle text-main'
                }`}
              >
                <span>Select {p.label}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
    </div>
  );
}