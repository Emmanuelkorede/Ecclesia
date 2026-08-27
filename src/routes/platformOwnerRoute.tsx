import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';

export default function PlatformOwnerRoute() {
  const { initialized } = useAuth();
  const { profile, loading } = useProfile();

  if (!initialized || loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!profile?.is_platform_superadmin) {
    return <Navigate to="/platform-owner-denied" replace />; // placeholder — build this page later
  }

  return <Outlet />;
}