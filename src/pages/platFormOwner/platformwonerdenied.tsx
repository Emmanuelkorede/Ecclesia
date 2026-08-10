import { useNavigate } from 'react-router';
import { ShieldAlert } from 'lucide-react';

export default function PlatformOwnerDeniedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Access restricted</h1>
        <p className="text-sm text-slate-500 mt-2">
          This area is only available to platform administrators.
        </p>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-5 py-2.5"
        >
          Back to dashboard
        </button>
      </div>
    </div>
  );
}