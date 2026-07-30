import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useActiveOrg } from '../../hooks/useActiveOrg';

export default function OrgSwitcher() {
  const { activeOrg, memberships, switchOrg } = useActiveOrg();
  const [open, setOpen] = useState(false);

  if (!activeOrg) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-sm text-[var(--text-main)] hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        {activeOrg.logo_url && (
          <img src={activeOrg.logo_url} alt="" className="w-5 h-5 rounded-full object-cover" />
        )}
        <span className="font-medium truncate max-w-[140px]">{activeOrg.name}</span>
        <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 mt-2 w-64 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl shadow-[var(--card-shadow)] z-20 py-1">
            {memberships.map((m) => (
              <button
                key={m.org_id}
                onClick={() => {
                  switchOrg(m.org_id);
                  setOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-[var(--text-main)] hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <span className="truncate">{m.organization.name}</span>
                {m.org_id === activeOrg.id && <Check className="w-4 h-4 text-brand-600" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}