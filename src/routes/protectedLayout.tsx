// components/layout/ProtectedLayout.tsx — add this check near the top
import { Navigate } from 'react-router';
import { useProfile } from '../hooks/useProfile';
import { useActiveOrg } from '../hooks/useActiveOrg';

export default function ProtectedLayout() {
  const {  loading, memberships } = useActiveOrg();
  const { isComplete, loading: profileLoading } = useProfile();

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-app)]">
        <p className="text-[var(--text-muted)]">Loading...</p>
      </div>
    );
  }

  if (!isComplete) {
    return <Navigate to="/complete-profile" replace />;
  }

  if (memberships.length === 0) {
    return <Navigate to="/choose-path" replace />;
  }

}