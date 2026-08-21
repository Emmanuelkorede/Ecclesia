import { useSubscription } from '../../hooks/useSubscirptionservcies';
import { useNavigate } from 'react-router';
import { formatCurrency, formatEnumLabel } from '../../utils/formatters';
import { formatFullDate } from '../../utils/dateHelpers';
import { 
  CreditCard, 
  ArrowUpCircle, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ReceiptText, 
  ShieldCheck
} from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';

export default function BillingPage() {
  const { history, loading, currentPlan, subscriptionStatus, expiresAt, isExpired } = useSubscription();
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'active':
      case 'success':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'rejected':
      case 'failed':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      default:
        return 'bg-surface text-muted border-subtle';
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full space-y-6 animate-in fade-in duration-200 pb-10 px-4 sm:px-0">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-main tracking-tight">Billing & Plans</h1>
        <p className="text-sm text-muted">Manage subscription, plan limits, and payment history.</p>
      </div>

      {/* Current Plan */}
      <div className="bg-surface border border-subtle rounded-xl shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              Current Plan
            </div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-3xl font-bold text-main capitalize tracking-tight">
                {formatEnumLabel(currentPlan)}
              </h2>
              <span className="text-xs font-bold text-brand-600 bg-brand-soft px-2.5 py-1 rounded-full border border-brand-500/20 uppercase">
                Active
              </span>
            </div>
          </div>

          {currentPlan !== 'enterprise' && (
            <button 
              onClick={() => navigate('/premium')}
              className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-all cursor-pointer shrink-0"
            >
              <ArrowUpCircle className="w-4 h-4" />
              <span>Upgrade Plan</span>
            </button>
          )}
        </div>

        {/* Status Alerts */}
        {(isExpired || subscriptionStatus === 'rejected' || subscriptionStatus === 'pending') && (
          <div className="pt-4 border-t border-subtle space-y-3">
            {isExpired && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Expired on {expiresAt ? formatFullDate(expiresAt) : 'unknown date'}. Renew for full access.</span>
              </div>
            )}

            {subscriptionStatus === 'rejected' && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Payment failed. Please update your payment method and retry.</span>
              </div>
            )}

            {subscriptionStatus === 'pending' && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-lg bg-brand-soft border border-brand-500/20 text-brand-600 text-sm">
                <Clock className="w-4 h-4 shrink-0 text-brand-500" />
                <span>Payment pending verification. We will update your status shortly.</span>
              </div>
            )}
          </div>
        )}

        {!isExpired && subscriptionStatus !== 'rejected' && subscriptionStatus !== 'pending' && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted pt-3 border-t border-subtle">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Subscription active and in good standing.</span>
          </div>
        )}
      </div>

      {/* History */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-base font-bold text-main tracking-tight">Payment History</h2>
          <span className="text-xs text-muted">{history.length} records</span>
        </div>
        
        <div className="bg-surface border border-subtle rounded-xl shadow-xs overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted gap-2.5">
              <Spinner size="sm" className="text-brand-500" />
              <span className="text-sm font-medium">Loading history...</span>
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-1.5">
              <ReceiptText className="w-10 h-10 text-muted opacity-40 mb-1" />
              <p className="text-sm font-semibold text-main">No payment history</p>
            </div>
          ) : (
            <div className="divide-y divide-subtle">
              {history.map((h) => (
                <div 
                  key={h.id} 
                  className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-app/50 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-app border border-subtle shrink-0">
                      <CreditCard className="w-4 h-4 text-muted" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-main capitalize leading-snug">
                        {formatEnumLabel(h.plan_tier)} Plan
                      </p>
                      <p className="text-xs text-muted mt-0.5">
                        {formatFullDate(h.created_at ?? '')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <p className="text-sm font-bold text-main tabular-nums">
                      {formatCurrency(h.amount_paid, h.currency ?? 'NGN')}
                    </p>
                    <span 
                      className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded border ${getStatusBadge(h.status ?? 'pending')}`}
                    >
                      {formatEnumLabel(h.status ?? 'pending')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}