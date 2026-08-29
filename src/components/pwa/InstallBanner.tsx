import { useState } from 'react';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';
import { Download, X } from 'lucide-react';

export default function InstallBanner() {
  const { isInstallable, isInstalled, promptInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || isInstalled || dismissed) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center shrink-0">
        <Download className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">Install Ecclesia</p>
        <p className="text-xs text-slate-500">Add to your home screen for quick access</p>
      </div>
      <button
        onClick={promptInstall}
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg px-3 py-2 shrink-0"
      >
        Install
      </button>
      <button onClick={() => setDismissed(true)} className="shrink-0" aria-label="Dismiss">
        <X className="w-4 h-4 text-slate-400" />
      </button>
    </div>
  );
}