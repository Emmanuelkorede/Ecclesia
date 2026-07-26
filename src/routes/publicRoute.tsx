// routes/publicRoute.tsx
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useActiveOrg } from '../hooks/useActiveOrg';

export default function PublicRoute() {
  const { isAuthenticated, initialized } = useAuth();
  const { role, loading } = useActiveOrg();

  if (!initialized || loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    const destination = role === 'member' ? '/member/dashboard' : '/admin/dashboard';
    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
}