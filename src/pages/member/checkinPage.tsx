import { useState } from 'react';
import CodeEntryForm from '../../components/attendance/codeEntryForm';
import QRScanner from '../../components/attendance/QRscanner';
import { useNavigate } from 'react-router';
import { Keyboard, ScanLine } from 'lucide-react';

type Mode = 'code' | 'qr';

export default function CheckInPage() {
  const [mode, setMode] = useState<Mode>('code');
  const navigate = useNavigate();

  return (
    <div className="max-w-sm mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-[var(--text-main)] text-center">Check In</h1>

      <div className="flex items-center p-1 rounded-xl bg-slate-200/60 dark:bg-slate-800/80">
        <button
          onClick={() => setMode('code')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === 'code' ? 'bg-white dark:bg-slate-900 text-[var(--text-main)]' : 'text-[var(--text-muted)]'
          }`}
        >
          <Keyboard className="w-4 h-4" /> Code
        </button>
        <button
          onClick={() => setMode('qr')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === 'qr' ? 'bg-white dark:bg-slate-900 text-[var(--text-main)]' : 'text-[var(--text-muted)]'
          }`}
        >
          <ScanLine className="w-4 h-4" /> Scan QR
        </button>
      </div>

      {mode === 'code' ? (
        <CodeEntryForm onSuccess={() => setTimeout(() => navigate('/member/dashboard'), 1500)} />
      ) : (
        <QRScanner onSuccess={() => setTimeout(() => navigate('/member/dashboard'), 1500)} />
      )}
    </div>
  );
}