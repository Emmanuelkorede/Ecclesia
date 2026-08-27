import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useActiveOrg } from '../hooks/useActiveOrg';
import { BrandLoader } from '../components/ui/BrandLoader'; // Adjust import path if needed

export default function OnboardingGuard() {
  const { initialized } = useAuth();
  const { isComplete, loading: profileLoading } = useProfile();
  const { memberships, role, loading: orgLoading } = useActiveOrg();
  const location = useLocation();

  if (!initialized || profileLoading || orgLoading) {
    return <BrandLoader message="Setting up..." />;
  }

  const path = location.pathname;

  // Profile incomplete — force to /complete-profile
  if (!isComplete && path !== '/complete-profile') {
    return <Navigate to="/complete-profile" replace />;
  }

  // Profile complete but trying to revisit /complete-profile — push forward
  if (isComplete && path === '/complete-profile') {
    return <Navigate to="/choose-path" replace />;
  }

  // Already has a membership — redirect away from onboarding
  if (memberships.length > 0) {
    const destination = role === 'member' ? '/member/dashboard' : '/admin/dashboard';
    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
}