import { useState } from 'react';
import { NavLink } from 'react-router';
import {
  Home,
  QrCode,
  CalendarDays,
  Video,
  Megaphone,
  ListChecks,
  User,
  MoreHorizontal,
  X,
} from 'lucide-react';

const mainLinks = [
  { to: '/member/dashboard', label: 'Home', icon: Home },
  { to: '/member/check-in', label: 'Check-In', icon: QrCode },
  { to: '/member/schedule', label: 'Schedule', icon: CalendarDays },
  { to: '/member/attendance', label: 'Attendance', icon: ListChecks },
];

const moreLinks = [
  { to: '/member/sermons', label: 'Sermons', icon: Video },
  { to: '/member/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/member/profile', label: 'Profile', icon: User },
];

export default function MemberBottomNav() {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      {/* "More" Sheet Modal Overlay */}
      {showMore && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center animate-in fade-in duration-200"
          onClick={() => setShowMore(false)}
        >
          <div
            className="w-full max-w-lg bg-surface border border-subtle rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-5 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-subtle">
              <h2 className="text-base font-bold text-main">More Options</h2>
              <button
                type="button"
                onClick={() => setShowMore(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-muted hover:text-main transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid of Extra Links */}
            <div className="grid grid-cols-2 gap-2.5">
              {moreLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setShowMore(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-2xl text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                        : 'text-main bg-app/50 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`
                  }
                >
                  <div className="p-2 rounded-xl bg-surface shadow-xs text-brand-600 dark:text-brand-400 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="truncate">{label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-surface/90 backdrop-blur-md border-t border-subtle px-2 py-2 flex items-center justify-around shadow-lg">
        {mainLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-colors ${
                isActive
                  ? 'text-brand-600 dark:text-brand-400 font-semibold'
                  : 'text-muted hover:text-main'
              }`
            }
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-[10px] tracking-tight">{label}</span>
          </NavLink>
        ))}

        <button
          type="button"
          onClick={() => setShowMore(true)}
          className="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-muted hover:text-main transition-colors cursor-pointer"
        >
          <MoreHorizontal className="w-5 h-5 mb-1" />
          <span className="text-[10px] tracking-tight">More</span>
        </button>
      </nav>
    </>
  );
}