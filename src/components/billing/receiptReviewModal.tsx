import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import * as subscriptionService from '../../services/subscriptionservies';
import { formatCurrency, formatEnumLabel } from '../../utils/formatters';
import { formatFullDate } from '../../utils/dateHelpers';
import { X } from 'lucide-react';
import type { Subscription, Organization } from '../../types/domain.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  subscription: (Subscription & { organization: Organization }) | null;
  onReviewed: () => void;
}

export default function ReceiptReviewModal({ isOpen, onClose, subscription, onReviewed }: Props) {
  const { user } = useAuth();
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [processing, setProcessing] = useState(false);

  // proof_url currently stores a path (pending the fix flagged above) —
  // generate a temporary signed link since the bucket is private
  useEffect(() => {
    if (!subscription) return;
    supabase.storage
      .from('payment-proofs')
      .createSignedUrl(subscription.proof_url, 60 * 60) // 5 minutes
      .then(({ data }) => setSignedUrl(data?.signedUrl ?? null));
  }, [subscription]);

  if (!isOpen || !subscription) return null;

  const handleApprove = async () => {
    if (!user) return;
    setProcessing(true);
    try {
      await subscriptionService.approveSubscription(subscription.id, user.id);
      onReviewed();
      onClose();
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!user || !rejectionReason.trim()) return;
    setProcessing(true);
    try {
      await subscriptionService.rejectSubscription(subscription.id, user.id, rejectionReason);
      onReviewed();
      onClose();
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg bg-[var(--bg-surface)] rounded-2xl shadow-[var(--card-shadow)] p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[var(--text-main)]">Review payment</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-[var(--text-muted)]" />
          </button>
        </div>

        <div className="space-y-2 text-sm mb-4">
          <p><span className="text-[var(--text-muted)]">Church:</span> {subscription.organization.name}</p>
          <p><span className="text-[var(--text-muted)]">Plan:</span> {formatEnumLabel(subscription.plan_tier)}</p>
          <p><span className="text-[var(--text-muted)]">Amount:</span> {formatCurrency(subscription.amount_paid, subscription.currency)}</p>
          <p><span className="text-[var(--text-muted)]">Submitted:</span> {formatFullDate(subscription.created_at ?? '')}</p>
        </div>

        {signedUrl ? (
          <img src={signedUrl} alt="Payment proof" className="w-full rounded-lg border border-[var(--border-subtle)] mb-4" />
        ) : (
          <p className="text-sm text-[var(--text-muted)] mb-4">Loading receipt...</p>
        )}

        {showRejectForm ? (
          <div className="space-y-3">
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reason for rejection..."
              rows={3}
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectForm(false)}
                className="flex-1 border border-[var(--border-subtle)] rounded-lg py-2 text-sm text-[var(--text-main)]"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim() || processing}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 text-sm disabled:opacity-50"
              >
                Confirm reject
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => setShowRejectForm(true)}
              disabled={processing}
              className="flex-1 border border-red-300 text-red-600 rounded-lg py-2 text-sm hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              Reject
            </button>
            <button
              onClick={handleApprove}
              disabled={processing}
              className="flex-1 bg-accent-600 hover:bg-accent-700 text-white rounded-lg py-2 text-sm disabled:opacity-50"
            >
              {processing ? 'Approving...' : 'Approve'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}