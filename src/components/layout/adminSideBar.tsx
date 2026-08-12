import { NavLink } from 'react-router';
import {
  LayoutDashboard,
  Users,
  Layers,
  CalendarDays,
  QrCode,
  Megaphone,
  Video,
  BarChart3,
  Sparkles,
  CreditCard,
  Settings,
} from 'lucide-react';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/members', label: 'Members', icon: Users },
  { to: '/admin/groups', label: 'Groups', icon: Layers },
  { to: '/admin/events', label: 'Events', icon: CalendarDays },
  { to: '/admin/schedule', label: 'Schedule', icon: CalendarDays },
  { to: '/admin/attendance', label: 'Attendance', icon: QrCode },
  { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/admin/sermons', label: 'Sermons', icon: Video },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/outreach', label: 'AI Outreach', icon: Sparkles },
  { to: '/admin/billing', label: 'Billing', icon: CreditCard },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  return (
    <aside className="group/sidebar hidden md:flex flex-col w-[68px] hover:w-60 shrink-0 h-[calc(100vh-4rem)] sticky top-16 bg-surface border-r border-subtle text-main transition-all duration-300 ease-in-out z-30 overflow-hidden shadow-xs hover:shadow-xl">
      {/* THE FIX IS ON THE LINE BELOW */}
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