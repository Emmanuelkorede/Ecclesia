// src/components/PublicRoute.jsx
import { Navigate, Outlet } from 'react-router' ;
import { useAuth } from '../hooks/useAuth';


export default function PublicRoute() {
  const { isAuthenticated, initialized } = useAuth()

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

  // already logged in — send to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  // not logged in — render the login/register page
  return <Outlet />
}