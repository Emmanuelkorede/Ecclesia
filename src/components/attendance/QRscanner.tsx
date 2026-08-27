import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useCheckIn } from '../../hooks/useCheckin';
import { Spinner } from '../ui/Spinner';
import { AlertCircle, ScanLine } from 'lucide-react';

interface Props {
  onSuccess?: () => void;
}

export default function QRScanner({ onSuccess }: Props) {
  const { checkInWithQr, submitting, error } = useCheckIn();
  const [scanned, setScanned] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleScan = async (result: string) => {
    if (scanned || submitting) return; // prevent double-fire
    setScanned(true);
    setLocalError(null);
    try {
      await checkInWithQr(result);
      onSuccess?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Check-in failed.';
      setLocalError(message);
      setScanned(false); // allow re-scan after failure
    }
  };

  const activeError = localError ?? error;

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      <div className="relative rounded-2xl overflow-hidden border border-subtle bg-app shadow-inner aspect-square flex items-center justify-center">
        <Scanner
          onScan={(codes) => {
            if (codes.length > 0) handleScan(codes[0].rawValue);
          }}
          onError={() => setLocalError('Camera access denied or unavailable.')}
        />

        {/* Submitting Overlay */}
        {submitting && (
          <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10 animate-in fade-in duration-200">
            <Spinner size="md" className="text-brand-500" />
            <p className="text-xs font-semibold text-main">Checking you in...</p>
          </div>
        )}
      </div>

      {/* Error Feedback */}
      {activeError && (
        <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-medium animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{activeError}</span>
        </div>
      )}

      <p className="text-xs text-center text-muted flex items-center justify-center gap-1.5">
        <ScanLine className="w-3.5 h-3.5" />
        <span>Center the QR code within the frame</span>
      </p>
    </div>
  );
}