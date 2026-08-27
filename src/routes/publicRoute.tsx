import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useActiveOrg } from '../hooks/useActiveOrg';
import { BrandLoader } from '../components/ui/BrandLoader'; // Adjust import path if needed

export default function PublicRoute() {
  const { isAuthenticated, initialized } = useAuth();
  const { role, loading } = useActiveOrg();

  if (!initialized || loading) {
    return <BrandLoader message="Loading..." />;
  }

  if (isAuthenticated) {
    const destination = role === 'member' ? '/member/dashboard' : '/admin/dashboard';
    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
}