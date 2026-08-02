import { Navigate , Outlet , useLocation } from 'react-router' ;
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute() {
  const { isAuthenticated, initialized } = useAuth()
  const location = useLocation()
  // still checking localStorage — show nothing yet
  if (!initialized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Loading...</p>
      </div>
    )
  }

  // not logged in — send them to login
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }}  replace />
  }

  // logged in — render the page
  return <Outlet />
}