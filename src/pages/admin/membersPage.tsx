import { useState } from 'react';
import { useMemberships } from '../../hooks/useMembership';
import { useActiveOrg } from '../../hooks/useActiveOrg';
import PlanLimitBanner from '../../components/billing/planLimitBanner';
import { isSuperAdmin } from '../../utils/permissions';
import { formatEnumLabel } from '../../utils/formatters';
import { Spinner } from '../../components/ui/Spinner';
import { 
  X, 
  Search, 
  AlertCircle, 
  UserX, 
  Shield, 
  AlertTriangle 
} from 'lucide-react';
import type { Database } from '../../types/database.types';

type Membership = Database['public']['Tables']['memberships']['Row'];
type MembershipRole = NonNullable<Membership['role']>;
type MembershipStatus = NonNullable<Membership['status']>;

interface MemberRecord extends Membership {
  profile?: Database['public']['Tables']['profiles']['Row'] | null;
}

export default function MembersPage() {
  const { members, loading, updateRole, updateStatus } = useMemberships();
  const { role } = useActiveOrg();
  const [search, setSearch] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // State for suspension confirmation modal
  const [memberToSuspend, setMemberToSuspend] = useState<string | null>(null);

  const typedMembers = members as unknown as MemberRecord[];

  const filtered = typedMembers.filter((m) =>
    m.profile?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSuspendConfirm = async () => {
    if (!memberToSuspend) return;
    
    setActionError(null);
    setProcessingId(memberToSuspend);
    const targetId = memberToSuspend;
    setMemberToSuspend(null); // Close modal immediately

    try {
      await updateStatus(targetId, 'suspended' as MembershipStatus);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setActionError(message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRoleChange = async (membershipId: string, newRole: string) => {
    setActionError(null);
    setProcessingId(membershipId);
    try {
      await updateRole(membershipId, newRole as MembershipRole);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update role.';
      setActionError(message);
    } finally {
      setProcessingId(null);
    }
  };

  const getInitials = (name?: string | null) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

return (
    <div className="max-w-6xl mx-auto w-full space-y-6 animate-in fade-in duration-300 pb-12 relative">
      
      {/* Confirmation Modal */}
      {memberToSuspend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-subtle rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center mb-2">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-main">Suspend Member?</h3>
              <p className="text-sm text-muted mt-1">
                Are you sure you want to suspend this member? They will lose access to the organization until reinstated.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setMemberToSuspend(null)}
                className="flex-1 px-4 py-2.5 bg-app hover:bg-subtle text-main text-sm font-semibold rounded-lg border border-subtle transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSuspendConfirm}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
              >
                Yes, Suspend
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-main tracking-tight">Members</h1>
        <p className="text-sm text-muted">
          Manage your organization's members, assign roles, and handle access control.
        </p>
      </div>

      <PlanLimitBanner 
        currentCount={typedMembers.filter((m) => m.status === 'active').length} 
        metric="members" 
      />

      {/* Error Alert */}
      {actionError && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm font-medium leading-relaxed">
            {actionError}
          </div>
          <button 
            onClick={() => setActionError(null)}
            className="ml-auto p-1 rounded-md hover:bg-red-500/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search members by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-surface border border-subtle rounded-xl text-sm font-medium text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all placeholder:text-muted shadow-sm"
          />
        </div>
        
        {/* Styled Total Members Indicator */}
        <div className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-3 bg-brand-500/10 border border-brand-500/20 px-4 py-2.5 rounded-xl shadow-sm">
          <span className="text-sm font-semibold text-brand-700 dark:text-brand-400">
            Total Members
          </span>
          <span className="bg-brand-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-inner">
            {typedMembers.length}
          </span>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-surface border border-subtle rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted">
            <Spinner size="md" className="text-brand-500 mb-3" />
            <span className="text-sm font-medium">Loading members...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 rounded-full bg-app flex items-center justify-center mx-auto mb-3">
              <Search className="w-5 h-5 text-muted" />
            </div>
            <h3 className="text-sm font-semibold text-main">No members found</h3>
            <p className="text-xs text-muted mt-1">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-app/50 border-b border-subtle">
                  <th className="px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Member</th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Role</th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle">
                {filtered.map((m) => {
                  const isProcessing = processingId === m.id;
                  
                  return (
                    <tr 
                      key={m.id} 
                      className={`hover:bg-app/30 transition-colors ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      {/* Name & Avatar Column */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 flex items-center justify-center font-bold text-sm shrink-0">
                            {getInitials(m.profile?.full_name)}
                          </div>
                          <span className="text-sm font-semibold text-main">
                            {m.profile?.full_name || 'Unnamed Member'}
                          </span>
                        </div>
                      </td>

                      {/* Role Column */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {isSuperAdmin(role) ? (
                          <div className="relative inline-block w-40">
                            <select
                              value={m.role ?? 'member'}
                              onChange={(e) => handleRoleChange(m.id, e.target.value)}
                              disabled={isProcessing}
                              className="w-full pl-3 pr-8 py-2 text-xs font-semibold bg-surface border border-subtle rounded-lg text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 cursor-pointer appearance-none transition-all shadow-sm"
                            >
                              <option value="member">Member</option>
                              <option value="sub_admin">Sub Admin</option>
                              <option value="super_admin">Super Admin</option>
                            </select>
                            <Shield className="w-3.5 h-3.5 text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-app border border-subtle text-xs font-medium text-main">
                            <Shield className="w-3.5 h-3.5 text-muted" />
                            {formatEnumLabel(m.role ?? 'member')}
                          </div>
                        )}
                      </td>

                      {/* Status Column (Boxed style with green color scheme) */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                          (m.status ?? 'active') === 'active' 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${(m.status ?? 'active') === 'active' ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                          {formatEnumLabel(m.status ?? 'active')}
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        {(m.status ?? 'active') === 'active' ? (
                          <button
                            onClick={() => setMemberToSuspend(m.id)}
                            disabled={isProcessing}
                            title="Suspend Member"
                            className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/30 disabled:opacity-50"
                            aria-label="Suspend member"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-xs text-muted italic px-2">Suspended</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}