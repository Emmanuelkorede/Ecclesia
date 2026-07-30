import { useNavigate  } from 'react-router';
import { useActiveOrg } from '../../hooks/useActiveOrg';
import { useAuth } from '../../hooks/useAuth';

export default function ChoosePathPage() {
  const { loading } = useActiveOrg();
  const { initialized } = useAuth();
  const navigate = useNavigate();


  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-app)]">
        <p className="text-[var(--text-muted)]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-app)] px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold text-[var(--text-main)] mb-2">
          What would you like to do today?
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
              For Senior Pastors & Church Admins — register your church
            </p>
          </button>

          <button
            onClick={() => navigate('/join-church')}
            className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 text-left hover:border-brand-500 transition-colors shadow-[var(--card-shadow)]"
          >
            <h2 className="font-semibold text-[var(--text-main)] mb-1">Join a Church</h2>
            <p className="text-sm text-[var(--text-muted)]">
              For Members & Sub-Admins — enter your church code
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}