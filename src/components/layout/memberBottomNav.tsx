import { NavLink } from 'react-router';
import { Home, QrCode, Video, ListChecks, User } from 'lucide-react';

const links = [
  { to: '/member/dashboard', label: 'Home', icon: Home },
  { to: '/member/check-in', label: 'Check-In', icon: QrCode },
  { to: '/member/sermons', label: 'Sermons', icon: Video },
  { to: '/member/attendance', label: 'Attendance', icon: ListChecks },
  { to: '/member/profile', label: 'Profile', icon: User },
];

export default function MemberBottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] flex justify-around py-2">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] px-2 ${
              isActive ? 'text-brand-600 dark:text-brand-400' : 'text-[var(--text-muted)]'
            }`
          }
        >
          <Icon className="w-5 h-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}