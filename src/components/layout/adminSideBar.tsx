import { NavLink } from 'react-router';
import {
  LayoutDashboard, Users, Layers, CalendarDays, QrCode,
  Megaphone, Video, BarChart3, Sparkles, CreditCard, Settings,
} from 'lucide-react';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/members', label: 'Members', icon: Users },
  { to: '/admin/groups', label: 'Groups', icon: Layers },
  { to: '/admin/events', label: 'Events', icon: CalendarDays },
  { to: '/admin/attendance', label: 'Attendance', icon: QrCode },
  { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/admin/sermons', label: 'Sermons', icon: Video },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/outreach', label: 'AI Outreach', icon: Sparkles },
  { to: '/admin/billing', label: 'Billing', icon: CreditCard },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
    {to : '/admin/schedule', label: 'Schedule', icon: CalendarDays}

];

export default function AdminSidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-[var(--bg-sidebar)] text-white">
      <div className="px-6 py-6">
        <h1 className="text-lg font-semibold">ChMS Admin</h1>
      </div>
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
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