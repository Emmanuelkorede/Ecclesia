import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useActiveOrg } from '../../hooks/useActiveOrg';
import * as attendanceService from '../../services/attendaceServices';
import CodeEntryForm from '../../components/attendance/codeEntryForm';
import QRScanner from '../../components/attendance/QRscanner';
import { useNavigate } from 'react-router';
import { Keyboard, ScanLine, CheckCircle2 } from 'lucide-react';

type Mode = 'code' | 'qr';

export default function CheckInPage() {
  const [mode, setMode] = useState<Mode>('code');
  const { user } = useAuth();
  const { activeOrg } = useActiveOrg();
  const navigate = useNavigate();
  const [alreadyCheckedInFor, setAlreadyCheckedInFor] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
  if (!user || !activeOrg) return;
  (async () => {
    setChecking(true);
    const sessions = await attendanceService.getEligibleActiveSessionsForUser(activeOrg.id, user.id);
    for (const s of sessions) {
      const already = await attendanceService.hasUserCheckedIn(s.id, user.id);
      if (already) {
        setAlreadyCheckedInFor(s.events?.title ?? 'this event');
        break;
      }
    }
    setChecking(false);
  })();
}, [user?.id, activeOrg?.id]);

  if (checking) {
    return <p className="text-sm text-slate-500 text-center">Checking status...</p>;
  }

  if (alreadyCheckedInFor) {
    return (
      <div className="max-w-sm mx-auto text-center py-10">
        <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">You're already checked in</h1>
        <p className="text-sm text-slate-500 mt-2">You've marked your attendance for {alreadyCheckedInFor}.</p>
        <button
          onClick={() => navigate('/member/dashboard')}
          className="mt-6 text-sm font-medium text-indigo-600 hover:underline"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white text-center">Check In</h1>

      <div className="flex items-center p-1 rounded-xl bg-slate-200/60 dark:bg-slate-800/80">
        <button
          onClick={() => setMode('code')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === 'code' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white' : 'text-slate-500'
          }`}
        >
          <Keyboard className="w-4 h-4" /> Code
        </button>
        <button
          onClick={() => setMode('qr')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === 'qr' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white' : 'text-slate-500'
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