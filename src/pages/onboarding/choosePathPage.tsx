import { useNavigate } from 'react-router';
import { useActiveOrg } from '../../hooks/useActiveOrg';
import { useAuth } from '../../hooks/useAuth';

export default function ChoosePathPage() {
  const { memberships, loading } = useActiveOrg();
  const { initialized } = useAuth();
  const navigate = useNavigate();

  // Still checking auth/org state — don't flash the wrong screen
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-app)]">
        <p className="text-[var(--text-muted)]">Loading...</p>
      </div>
    );
  }

  // Already belongs to at least one church — skip straight to dashboard
  if (memberships.length > 0) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-app)] px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold text-[var(--text-main)] mb-2">
          Let's get you connected
        </h1>
        <p className="text-sm text-[var(--text-muted)] mb-8">
          You're not part of a church yet. Choose an option below.
        </p>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => navigate('/register-church')}
            className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 text-left hover:border-brand-500 transition-colors shadow-[var(--card-shadow)]"
          >
            <h2 className="font-semibold text-[var(--text-main)] mb-1">Create a Church</h2>
            <p className="text-sm text-[var(--text-muted)]">
              Register your church and become the administrator
            </p>
          </button>

          <button
            onClick={() => navigate('/join-church')}
            className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 text-left hover:border-brand-500 transition-colors shadow-[var(--card-shadow)]"
          >
            <h2 className="font-semibold text-[var(--text-main)] mb-1">Join a Church</h2>
            <p className="text-sm text-[var(--text-muted)]">
              Enter the church code someone gave you
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}