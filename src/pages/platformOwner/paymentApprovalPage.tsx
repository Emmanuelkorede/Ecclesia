import { useState, useEffect, useCallback } from 'react';
import * as subscriptionService from '../../services/subscriptionServices';
import ReceiptReviewModal from '../../components/billing/receiptReviewModal';
import { formatCurrency, formatEnumLabel } from '../../utils/formatters';
import { formatRelativeTime } from '../../utils/dateHelpers';
import type { Subscription, Organization } from '../../types/domain.types';

type PendingSub = Subscription & { organization: Organization };

export default function PaymentApprovalsPage() {
  const [pending, setPending] = useState<PendingSub[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PendingSub | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await subscriptionService.getAllPendingSubscriptions();
    setPending(data as PendingSub[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Payment Approvals</h1>
        <p className="text-sm text-slate-500 mt-1">
          {pending.length} payment{pending.length !== 1 ? 's' : ''} awaiting review
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : pending.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-10 text-center">
          <p className="text-sm text-slate-500">No pending payments right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pending.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelected(sub)}
              className="w-full flex items-center justify-between text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 hover:border-indigo-500"
            >
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{sub.organization.name}</p>
                <p className="text-sm text-slate-500 mt-0.5">
                  {formatEnumLabel(sub.plan_tier)} · Submitted {formatRelativeTime(sub.created_at ?? '')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(sub.amount_paid, sub.currency ?? 'NGN')}
                </p>
                <span className="text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-600 px-2 py-0.5 rounded-full">
                  Pending
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <ReceiptReviewModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        subscription={selected}
        onReviewed={load}
      />
    </div>
  );
}