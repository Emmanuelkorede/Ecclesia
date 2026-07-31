import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useCheckIn } from '../../hooks/useCheckin';

interface Props {
  onSuccess?: () => void;
}

export default function QRScanner({ onSuccess }: Props) {
  const { checkInWithQr, submitting, error } = useCheckIn();
  const [scanned, setScanned] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleScan = async (result: string) => {
    if (scanned || submitting) return; // prevent double-fire from repeated frames
    setScanned(true);
    setLocalError(null);
    try {
      await checkInWithQr(result);
      onSuccess?.();
    } catch (err: any) {
      setLocalError(err.message ?? 'Check-in failed.');
      setScanned(false); // allow re-scan after a failed attempt
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="rounded-2xl overflow-hidden border border-[var(--border-subtle)]">
        <Scanner
          onScan={(codes) => {
            if (codes.length > 0) handleScan(codes[0].rawValue);
          }}
          onError={() => setLocalError('Camera access denied or unavailable.')}
        />
      </div>

      {(localError || error) && (
        <p className="mt-3 text-sm text-red-600 text-center">{localError ?? error}</p>
      )}

      {submitting && (
        <p className="mt-3 text-sm text-[var(--text-muted)] text-center">Checking you in...</p>
      )}
    </div>
  );
}