import { Navigate, Outlet } from 'react-router';
import { useActiveOrg } from '../../hooks/useActiveOrg';
import { useProfile } from '../../hooks/useProfile';
import AdminSidebar from './adminSideBar';
import AdminBottomNav from './adminBottomNav';
import MemberNav from './memberNav';
import MemberBottomNav from './memberBottomNav';
import OrgSwitcher from './orgSwitcher';
import { ThemeToggle } from '../ui/ThemeToggle';

export default function ProtectedLayout() {
  const { role, memberships, loading: orgLoading } = useActiveOrg();
  const { isComplete, loading: profileLoading } = useProfile();

  // Still resolving auth/profile/org state
  if (orgLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-app)]">
        <p className="text-[var(--text-muted)]">Loading...</p>
      </div>
    );
  }

  // Someone forced their way to a dashboard URL without finishing profile setup
  if (!isComplete) {
    return <Navigate to="/complete-profile" replace />;
  }

  // Someone forced their way to a dashboard URL with zero church memberships
  if (memberships.length === 0) {
    return <Navigate to="/choose-path" replace />;
  }

  const isMemberRole = role === 'member';

  return (
    <div className="flex min-h-screen bg-[var(--bg-app)]">
      {isMemberRole ? <MemberNav /> : <AdminSidebar />}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <OrgSwitcher />
          <ThemeToggle />
        </header>

        <main className="flex-1 pb-20 md:pb-6 p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {isMemberRole ? <MemberBottomNav /> : <AdminBottomNav />}
    </div>
  );
}