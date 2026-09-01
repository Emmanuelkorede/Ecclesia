import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Building2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useActiveOrg } from '../../hooks/useActiveOrg';

export default function OrgSwitcher() {
  const { activeOrg, memberships, switchOrg } = useActiveOrg();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!activeOrg) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-subtle bg-surface hover:bg-slate-50 dark:hover:bg-slate-800/50 text-sm font-semibold text-main transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/30"
      >
        {activeOrg.logo_url ? (
          <img src={activeOrg.logo_url} alt="Org Logo" className="w-5 h-5 rounded-full object-cover ring-1 ring-subtle" />
        ) : (
          <div className="w-5 h-5 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center shrink-0">
            <Building2 className="w-3 h-3" />
          </div>
        )}
        <span className="truncate max-w-[120px] sm:max-w-[160px]">{activeOrg.name}</span>
        <ChevronDown className={`w-4 h-4 text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-surface border border-subtle rounded-2xl shadow-xl z-50 py-1.5 animate-in fade-in slide-in-from-top-2 origin-top-right">
          <div className="px-3 py-2 border-b border-subtle mb-1">
            <p className="text-[11px] font-semibold text-muted uppercase tracking-wider">Switch Workspace</p>
          </div>

          <div className="max-h-[60vh] overflow-y-auto px-1.5">
            {memberships.map((m) => {
              const isActive = m.org_id === activeOrg.id;
              return (
                <button
                  key={m.org_id}
                  onClick={() => {
                    if (!isActive) switchOrg(m.org_id);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 mb-1 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400'
                      : 'text-main hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate pr-2 text-left">{m.organization.name}</span>
                  {isActive && <Check className="w-4 h-4 shrink-0 text-brand-600 dark:text-brand-400" />}
                </button>
              );
            })}
          </div>

          <div className="border-t border-subtle mt-1 pt-1.5 px-1.5">
            <button
              onClick={() => {
                setOpen(false);
                navigate('/add-church');
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add another church
            </button>
          </div>
        </div>
      )}
    </div>
  );
}