import { NavLink } from 'react-router';
import {
  Home,
  QrCode,
  CalendarDays,
  Video,
  Megaphone,
  ListChecks,
  User,
} from 'lucide-react';

const links = [
  { to: '/member/dashboard', label: 'Dashboard', icon: Home },
  { to: '/member/check-in', label: 'Check-In', icon: QrCode },
  { to: '/member/schedule', label: 'Schedule', icon: CalendarDays },
  { to: '/member/sermons', label: 'Sermons', icon: Video },
  { to: '/member/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/member/attendance', label: 'My Attendance', icon: ListChecks },
  { to: '/member/profile', label: 'Profile', icon: User },
];

export default function MemberSidebar() {
  return (
    <aside className="group/sidebar hidden md:flex flex-col w-[68px] hover:w-60 shrink-0 h-[calc(100vh-4rem)] sticky top-16 bg-surface border-r border-subtle text-main transition-all duration-300 ease-in-out z-30 overflow-hidden shadow-xs hover:shadow-xl">
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                  : 'text-muted hover:text-main hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 ease-in-out truncate">
              {label}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}