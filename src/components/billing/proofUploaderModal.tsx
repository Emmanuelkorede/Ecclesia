import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscirptionservcies';
import { X } from 'lucide-react';
import type { PlanTier } from '../../types/domain.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  planTier: PlanTier;
  amount: number;
}

export default function ProofUploaderModal({ isOpen, onClose, planTier, amount }: Props) {
  const { user } = useAuth();
  const { submitProof } = useSubscription();
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!file || !user) return;
    setSubmitting(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Store the raw path, NOT a public URL — the bucket is private,
      // so proof_url now holds something like "userId/1234567.png".
      // ReceiptReviewModal turns this into a temporary signed URL
      // at view-time, on demand, every time it's opened.
      await submitProof({
        submittedBy: user.id,
        planTier,
        amountPaid: amount,
        proofUrl: filePath,
      });

      onClose();
    } catch (err: any) {
      setError(err.message ?? 'Upload failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md bg-[var(--bg-surface)] rounded-2xl shadow-[var(--card-shadow)] p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[var(--text-main)]">Upload payment proof</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-[var(--text-muted)]" />
          </button>
        </div>

        <p className="text-sm text-[var(--text-muted)] mb-4">
          Upload a screenshot of your bank transfer receipt. We'll review and activate your plan within 24-48 hours.
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/40 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-[var(--text-main)] mb-4"
        />

        <button
          onClick={handleSubmit}
          disabled={!file || submitting}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg py-2.5 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Uploading...' : 'Submit for review'}
        </button>
      </div>
    </div>
  );
}