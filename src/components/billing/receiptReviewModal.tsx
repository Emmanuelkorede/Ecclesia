import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import * as subscriptionService from '../../services/subscriptionservies';
import { formatCurrency, formatEnumLabel } from '../../utils/formatters';
import { formatFullDate } from '../../utils/dateHelpers';
import { X, Maximize2 } from 'lucide-react';
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
    // reset UI state each time a different subscription opens
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 overflow-y-auto">
        <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 my-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Review payment</h2>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="space-y-1.5 text-sm mb-4">
            <p><span className="text-slate-500">Church:</span> <span className="text-slate-900 dark:text-white">{subscription.organization.name}</span></p>
            <p><span className="text-slate-500">Plan:</span> <span className="text-slate-900 dark:text-white">{formatEnumLabel(subscription.plan_tier)}</span></p>
            <p><span className="text-slate-500">Amount:</span> <span className="text-slate-900 dark:text-white">{formatCurrency(subscription.amount_paid, subscription.currency)}</span></p>
            <p><span className="text-slate-500">Submitted:</span> <span className="text-slate-900 dark:text-white">{formatFullDate(subscription.created_at ?? '')}</span></p>
          </div>

          {signedUrl ? (
            <button
              onClick={() => setShowFullImage(true)}
              className="relative w-full h-48 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 mb-4 group"
            >
              <img src={signedUrl} alt="Payment proof" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ) : (
            <p className="text-sm text-slate-500 mb-4">Loading receipt...</p>
          )}

          {showRejectForm ? (
            <div className="space-y-3">
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Reason for rejection..."
                rows={3}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRejectForm(false)}
                  className="flex-1 border border-slate-300 dark:border-slate-700 rounded-lg py-2 text-sm text-slate-900 dark:text-white"
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
                className="flex-1 border border-red-300 dark:border-red-900 text-red-600 rounded-lg py-2 text-sm hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                Reject
              </button>
              <button
                onClick={handleApprove}
                disabled={processing}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2 text-sm disabled:opacity-50"
              >
                {processing ? 'Approving...' : 'Approve'}
              </button>
            </div>
          )}
        </div>
      </div>

      {showFullImage && signedUrl && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setShowFullImage(false)}
            className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <img src={signedUrl} alt="Payment proof full view" className="max-w-full max-h-full object-contain rounded-lg" />
        </div>
      )}
    </>
  );
}