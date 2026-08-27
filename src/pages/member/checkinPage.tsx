import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useActiveOrg } from '../../hooks/useActiveOrg';
import * as attendanceService from '../../services/attendanceServices';
import CodeEntryForm from '../../components/attendance/codeEntryForm';
import QRScanner from '../../components/attendance/QRscanner';
import { Spinner } from '../../components/ui/Spinner';
import { useNavigate } from 'react-router';
import { Keyboard, ScanLine, CheckCircle2, ArrowLeft } from 'lucide-react';

type Mode = 'code' | 'qr';

export default function CheckInPage() {
  const [mode, setMode] = useState<Mode>('code');
  const { user } = useAuth();
  const { activeOrg } = useActiveOrg();
  const navigate = useNavigate();
  const [alreadyCheckedInFor, setAlreadyCheckedInFor] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function checkExistingAttendance() {
      if (!user || !activeOrg) return;
      setChecking(true);
      try {
        const sessions = await attendanceService.getEligibleActiveSessionsForUser(activeOrg.id, user.id);
        for (const s of sessions) {
          const already = await attendanceService.hasUserCheckedIn(s.id, user.id);
          if (already && isMounted) {
            setAlreadyCheckedInFor(s.events?.title ?? 'this event');
            break;
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setChecking(false);
      }
    }

    checkExistingAttendance();

    return () => {
      isMounted = false;
    };
  }, [user?.id, activeOrg?.id]);

  /* 1. Loading State */
  if (checking) {
    return (
      <div className="max-w-md mx-auto w-full animate-in fade-in duration-300">
        <div className="flex flex-col items-center justify-center py-16 bg-surface border border-subtle rounded-xl text-muted shadow-sm">
          <Spinner size="md" className="text-brand-500 mb-3" />
          <p className="text-sm font-medium">Checking attendance status...</p>
        </div>
      </div>
    );
  }

  /* 2. Already Checked-In State */
  if (alreadyCheckedInFor) {
    return (
      <div className="max-w-md mx-auto w-full animate-in fade-in duration-300">
        <div className="bg-surface border border-subtle rounded-xl p-8 text-center shadow-sm space-y-5">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-lg font-bold text-main tracking-tight">You&apos;re checked in!</h1>
            <p className="text-xs text-muted leading-relaxed max-w-xs mx-auto">
              Your attendance for <span className="font-semibold text-main">{alreadyCheckedInFor}</span> has been confirmed.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate('/member/dashboard')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* 3. Main Active Check-In Form */
  return (
    <div className="max-w-md mx-auto w-full space-y-6 animate-in fade-in duration-300 pb-8">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-xl font-bold text-main tracking-tight">Event Check-In</h1>
        <p className="text-xs text-muted">Enter the passcode or scan the venue QR code to mark attendance.</p>
      </div>

      {/* Mode Switcher */}
      <div className="p-1 rounded-xl bg-app border border-subtle flex items-center gap-1 shadow-inner">
        <button
          type="button"
          onClick={() => setMode('code')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            mode === 'code'
              ? 'bg-surface text-brand-600 dark:text-brand-400 shadow-sm border border-subtle/50'
              : 'text-muted hover:text-main'
          }`}
        >
          <Keyboard className="w-4 h-4" />
          <span>Passcode</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('qr')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            mode === 'qr'
              ? 'bg-surface text-brand-600 dark:text-brand-400 shadow-sm border border-subtle/50'
              : 'text-muted hover:text-main'
          }`}
        >
          <ScanLine className="w-4 h-4" />
          <span>Scan QR</span>
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-surface border border-subtle rounded-xl p-6 shadow-sm">
        {mode === 'code' ? (
          <CodeEntryForm onSuccess={() => setTimeout(() => navigate('/member/dashboard'), 1500)} />
        ) : (
          <QRScanner onSuccess={() => setTimeout(() => navigate('/member/dashboard'), 1500)} />
        )}
      </div>
    </div>
  );
}