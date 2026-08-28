import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import * as subscriptionService from '../../services/subscriptionServices';
import { formatCurrency, formatEnumLabel } from '../../utils/formatters';
import { formatFullDate } from '../../utils/dateHelpers';
import { X, Maximize2 } from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';
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
  const [showFullImage, setShowFullImage] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!subscription) return;
    supabase.storage
      .from('payment-proofs')
      .createSignedUrl(subscription.proof_url, 60 * 60)
      .then(({ data }) => setSignedUrl(data?.signedUrl ?? null));
  }, [subscription]);

  useEffect(() => {
    setShowFullImage(false);
    setShowRejectForm(false);
    setRejectionReason('');
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
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4 py-8 overflow-y-auto animate-in fade-in duration-200">
        <div className="w-full max-w-lg bg-surface border border-subtle rounded-2xl shadow-xl p-6 my-auto space-y-5">
          <div className="flex justify-between items-center border-b border-subtle pb-4">
            <h2 className="text-base font-bold text-main tracking-tight">Review Payment</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-muted hover:text-main hover:bg-subtle transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-subtle">
              <span className="text-muted font-medium">Church</span>
              <span className="text-main font-semibold">{subscription.organization.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-subtle">
              <span className="text-muted font-medium">Plan</span>
              <span className="text-main font-semibold">{formatEnumLabel(subscription.plan_tier)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-subtle">
              <span className="text-muted font-medium">Amount</span>
              <span className="text-main font-semibold">
                {formatCurrency(subscription.amount_paid, subscription.currency ?? undefined)}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted font-medium">Submitted</span>
              <span className="text-main font-semibold">{formatFullDate(subscription.created_at ?? '')}</span>
            </div>
          </div>

          {signedUrl ? (
            <button
              type="button"
              onClick={() => setShowFullImage(true)}
              className="relative w-full h-48 rounded-xl overflow-hidden border border-subtle bg-app mb-4 group cursor-pointer"
            >
              <img src={signedUrl} alt="Payment proof" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
              </div>
            </button>
          ) : (
            <div className="flex items-center justify-center h-36 bg-app border border-subtle rounded-xl text-muted text-xs gap-2">
              <Spinner size="sm" className="text-brand-500" />
              <span>Loading receipt...</span>
            </div>
          )}

          {showRejectForm ? (
            <div className="space-y-3 pt-2">
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Reason for rejection..."
                rows={3}
                className="w-full rounded-xl border border-subtle bg-app px-3 py-2 text-xs text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowRejectForm(false)}
                  className="flex-1 border border-subtle hover:bg-app text-main rounded-xl py-2 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={!rejectionReason.trim() || processing}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl py-2 text-xs font-semibold disabled:opacity-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {processing ? <Spinner size="sm" className="text-white" /> : 'Confirm Reject'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectForm(true)}
                disabled={processing}
                className="flex-1 border border-rose-500/20 text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl py-2.5 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={processing}
                className="flex-1 bg-brand-600 hover:bg-brand-700 text-white rounded-xl py-2.5 text-xs font-semibold disabled:opacity-50 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                {processing ? (
                  <>
                    <Spinner size="sm" className="text-white" />
                    <span>Approving...</span>
                  </>
                ) : (
                  'Approve'
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {showFullImage && signedUrl && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200">
          <button
            type="button"
            onClick={() => setShowFullImage(false)}
            className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <img src={signedUrl} alt="Payment proof full view" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
        </div>
      )}
    </>
  );
}