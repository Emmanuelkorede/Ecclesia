import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscirptionservcies';
import { X, UploadCloud, AlertCircle, FileImage, CheckCircle2 } from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';
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

      await submitProof({
        submittedBy: user.id,
        planTier,
        amountPaid: amount,
        proofUrl: filePath,
      });

      onClose();
      setFile(null); // Reset on success
    } catch (err: any) {
      setError(err.message ?? 'Upload failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-2xl border border-subtle overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-subtle bg-app/50 shrink-0">
          <div>
            <h2 className="text-base font-bold text-main">Upload Payment Proof</h2>
            <p className="text-xs text-muted mt-0.5 capitalize">{planTier} Plan • ₦{amount.toLocaleString()}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-muted hover:text-main hover:bg-surface rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <p className="text-sm text-muted leading-relaxed">
            Please upload a clear screenshot of your bank transfer receipt. Our team will review it and activate your plan within 24-48 hours.
          </p>

          {error && (
            <div className="flex items-start gap-2 p-3 text-xs rounded-lg bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Styled File Dropzone / Input */}
          <div className="relative">
            {file ? (
              <div className="flex items-center justify-between p-4 bg-app border border-subtle rounded-xl">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-brand-50 text-brand-600 rounded-lg shrink-0">
                    <FileImage className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-medium text-main truncate">{file.name}</p>
                    <p className="text-xs text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setFile(null)}
                  className="p-1.5 text-muted hover:text-red-500 bg-surface rounded-md border border-subtle hover:border-red-500/30 transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-subtle hover:border-brand-500 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 rounded-xl cursor-pointer transition-all group">
                <div className="p-3 bg-app group-hover:bg-brand-100 dark:group-hover:bg-brand-900/30 rounded-full mb-3 transition-colors">
                  <UploadCloud className="w-6 h-6 text-muted group-hover:text-brand-600" />
                </div>
                <span className="text-sm font-medium text-main group-hover:text-brand-600 transition-colors">
                  Click to select receipt image
                </span>
                <span className="text-xs text-muted mt-1">Supports JPG, PNG up to 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </label>
            )}
          </div>

          {/* Submit Action */}
          <button
            onClick={handleSubmit}
            disabled={!file || submitting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-600/50 text-white text-sm font-semibold rounded-xl shadow-sm transition-all disabled:cursor-not-allowed cursor-pointer"
          >
            {submitting ? (
              <>
                <Spinner size="sm" className="text-white" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit for review</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}