import { useState } from 'react';
import { NavLink } from 'react-router';
import { LayoutDashboard, Users, CalendarDays, QrCode, MoreHorizontal, X, Megaphone, Video, BarChart3, Sparkles, CreditCard, Settings, Layers } from 'lucide-react';

const mainLinks = [
  { to: '/admin/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/admin/members', label: 'Members', icon: Users },
  { to: '/admin/events', label: 'Events', icon: CalendarDays },
  { to: '/admin/attendance', label: 'Attendance', icon: QrCode },
];

const moreLinks = [
  { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/admin/sermons', label: 'Sermons', icon: Video },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/outreach', label: 'AI Outreach', icon: Sparkles },
  { to: '/admin/billing', label: 'Billing', icon: CreditCard },
    { to: '/admin/groups', label: 'Groups', icon: Layers },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminBottomNav() {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      {showMore && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setShowMore(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-[var(--bg-surface)] rounded-t-2xl p-4 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-[var(--text-main)]">More</h2>
              <button onClick={() => setShowMore(false)}>
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {moreLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setShowMore(false)}
                  className="flex flex-col items-center gap-1.5 text-xs text-[var(--text-main)]"
                >
                  <div className="w-11 h-11 rounded-xl bg-[var(--bg-app)] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] flex justify-around py-2">
        {mainLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-[10px] px-2 ${
                isActive ? 'text-black dark:text-black' : 'text-red'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
        <button
          onClick={() => setShowMore(true)}
          className="flex flex-col items-center gap-0.5 text-[10px] px-2 text-[var(--text-muted)]"
        >
          <MoreHorizontal className="w-5 h-5" />
          More
        </button>
      </nav>
    </>
  );
}