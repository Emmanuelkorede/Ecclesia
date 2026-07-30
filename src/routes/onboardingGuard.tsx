import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useActiveOrg } from '../hooks/useActiveOrg';

export default function OnboardingGuard() {
  const { initialized } = useAuth();
  const { isComplete, loading: profileLoading } = useProfile();
  const { memberships, role, loading: orgLoading } = useActiveOrg();
  const location = useLocation();

  if (!initialized || profileLoading || orgLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  const path = location.pathname;

  // Profile incomplete — only /complete-profile is allowed, force everything else there
  if (!isComplete && path !== '/complete-profile') {
    return <Navigate to="/complete-profile" replace />;
  }

  // Profile complete but trying to revisit /complete-profile — push forward
  if (isComplete && path === '/complete-profile') {
    return <Navigate to="/choose-path" replace />;
  }

  // Already has a membership — no business being on any onboarding route at all
  if (memberships.length > 0) {
    const destination = role === 'member' ? '/member/dashboard' : '/admin/dashboard';
    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
}