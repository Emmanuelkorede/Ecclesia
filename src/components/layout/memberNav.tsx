import { NavLink } from 'react-router';
import { Home, QrCode, Video, ListChecks, User } from 'lucide-react';

const links = [
  { to: '/member/dashboard', label: 'Home', icon: Home },
  { to: '/member/check-in', label: 'Check-In', icon: QrCode },
  { to: '/member/sermons', label: 'Sermons', icon: Video },
  { to: '/member/attendance', label: 'My Attendance', icon: ListChecks },
  { to: '/member/profile', label: 'Profile', icon: User },
];

export default function MemberNav() {
  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-[var(--bg-sidebar)] text-white">
      <div className="px-6 py-6">
        <h1 className="text-lg font-semibold">ChMS</h1>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--bg-sidebar-hover)] text-white'
                  : 'text-slate-300 hover:bg-[var(--bg-sidebar-hover)] hover:text-white'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}