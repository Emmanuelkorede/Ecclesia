import { Navigate, Outlet } from 'react-router';
import { useActiveOrg } from '../../hooks/useActiveOrg';
import { useProfile } from '../../hooks/useProfile';

// Layout Components
import AdminSidebar from './adminSideBar';
import AdminBottomNav from './adminBottomNav';
import MemberNav from './memberNav';
import MemberBottomNav from './memberBottomNav';
import OrgSwitcher from './orgSwitcher';

// UI Components
import { BrandLoader } from '../../components/ui/BrandLoader';
import { Logo } from '../../components/ui/Logo';

export default function ProtectedLayout() {
  const { role, memberships, loading: orgLoading } = useActiveOrg();
  const { isComplete, loading: profileLoading } = useProfile();

  // Full-Screen Initial Loading State
  if (orgLoading || profileLoading) {
    return <BrandLoader fullScreen message="Loading workspace..." />;
  }

  // Profile incomplete redirect
  if (!isComplete) {
    return <Navigate to="/complete-profile" replace />;
  }

  // No church membership redirect
  if (memberships.length === 0) {
    return <Navigate to="/choose-path" replace />;
  }

  const isMemberRole = role === 'member';

  return (
    <div className="min-h-screen flex flex-col bg-app transition-colors duration-200">
      
      {/* 1. Full-Width Top Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 h-16 border-b border-subtle bg-surface/80 backdrop-blur-md">
        
        {/* Left: App Brand & Logo (Bolder and Larger) */}
        <div className="flex items-center gap-3">
          <Logo className="h-8 md:h-9 w-auto font-bold text-brand-600 dark:text-brand-500 tracking-tight" />
        </div>

        {/* Right: Organization Switcher */}
        <div className="flex items-center gap-3">
          <OrgSwitcher />
        </div>
      </header>

      {/* 2. Content Area (Sidebar + Main) */}
      <div className="flex flex-1 min-w-0 relative">
        
        {/* Sidebar sitting below the top header */}
        {isMemberRole ? <MemberNav /> : <AdminSidebar />}

        {/* Dynamic Page Content */}
        <main className="flex-1 pb-20 md:pb-8 p-4 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>

      {/* 3. Mobile Bottom Navigation */}
      {isMemberRole ? <MemberBottomNav /> : <AdminBottomNav />}
    </div>
  );
}