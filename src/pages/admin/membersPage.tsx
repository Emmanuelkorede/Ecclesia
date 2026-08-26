import { useState } from 'react';
import { useMemberships } from '../../hooks/useMemberShip';
import { useActiveOrg } from '../../hooks/useActiveOrg';
import PlanLimitBanner from '../../components/billing/planLimitBanner';
import { isSuperAdmin } from '../../utils/permissions';
import { formatEnumLabel } from '../../utils/formatters';
import { Check, X } from 'lucide-react';

export default function MembersPage() {
  const { members, loading, updateRole, updateStatus } = useMemberships();
  const { role } = useActiveOrg();
  const [search, setSearch] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  const filtered = members.filter((m: any) =>
    m.profile?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleApprove = async (membershipId: string) => {
    setActionError(null);
    try {
      await updateStatus(membershipId, 'active');
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--text-main)]">Members</h1>
      </div>

      <PlanLimitBanner currentCount={members.filter((m) => m.status === 'active').length} metric="members" />

      {actionError && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {actionError}
        </div>
      )}

      <input
        type="text"
        placeholder="Search members..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-brand-500"
      />

      {loading ? (
        <p className="text-sm text-[var(--text-muted)]">Loading members...</p>
      ) : (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-[var(--text-muted)]">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Role</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m: any) => (
                <tr key={m.id} className="border-t border-[var(--border-subtle)]">
                  <td className="px-4 py-3 text-[var(--text-main)]">{m.profile?.full_name}</td>
                  <td className="px-4 py-3">
                    {isSuperAdmin(role) ? (
                      <select
                        value={m.role}
                        onChange={(e) => updateRole(m.id, e.target.value as any)}
                        className="bg-transparent border border-[var(--border-subtle)] rounded-md px-2 py-1 text-xs text-[var(--text-main)]"
                      >
                        <option value="member">Member</option>
                        <option value="sub_admin">Sub Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    ) : (
                      <span className="text-[var(--text-muted)]">{formatEnumLabel(m.role)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        m.status === 'active'
                          ? 'bg-accent-50 dark:bg-accent-950/40 text-accent-700 dark:text-accent-400'
                          : m.status === 'pending'
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                          : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400'
                      }`}
                    >
                      {formatEnumLabel(m.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {m.status === 'pending' && (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleApprove(m.id)}
                          className="p-1.5 rounded-lg bg-accent-50 dark:bg-accent-950/40 text-accent-600"
                          aria-label="Approve"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => updateStatus(m.id, 'suspended')}
                          className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600"
                          aria-label="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}