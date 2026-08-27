import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { BrandLoader } from '../components/ui/BrandLoader'; // Adjust import path if needed

export default function ProtectedRoute() {
  const { isAuthenticated, initialized } = useAuth();
  const location = useLocation();

  if (!initialized) {
    return <BrandLoader message="Verifying session..." />;
  }

  // Not logged in — send to login
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Logged in — render route
  return <Outlet />;
}