import { useState } from 'react';
import { useGroupMembers } from '../../hooks/useGroupMembers';
import { X, UserPlus, UserMinus, Search, Users, ShieldAlert } from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner'; // Assuming you have this from previous components

interface Props {
  groupId: string | null;
  groupName: string;
  onClose: () => void;
}

interface MemberProfile {
  full_name?: string | null;
}

interface MemberItem {
  id: string;
  user_id: string;
  profile?: MemberProfile | null;
}

export default function GroupMembersModal({ groupId, groupName, onClose }: Props) {
  const { groupMembers, availableToAdd, loading, addMember, removeMember } = useGroupMembers(groupId);
  const [search, setSearch] = useState('');

  if (!groupId) return null;

  const members = (groupMembers || []) as MemberItem[];
  const available = (availableToAdd || []) as MemberItem[];

  const filteredAvailable = available.filter((m) =>
    m.profile?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  // Helper to get initials for the avatar placeholder
  const getInitials = (name?: string | null) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-md rounded-xl shadow-2xl border border-subtle overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-subtle bg-app/50 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-main truncate max-w-[280px]">
              {groupName}
            </h2>
            <p className="text-xs text-muted mt-0.5">Manage group members</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-muted hover:text-main hover:bg-surface rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-5 space-y-8">
          
          {/* Current Members Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-brand-soft rounded-md border border-brand-500/20">
                <Users className="w-4 h-4 text-brand-600" />
              </div>
              <h3 className="text-sm font-semibold text-main">
                Current Members ({members.length})
              </h3>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-6">
                <Spinner size="sm" className="text-brand-500 mb-2" />
                <span className="text-xs text-muted">Loading members...</span>
              </div>
            ) : members.length === 0 ? (
              <div className="py-6 px-4 text-center rounded-xl border border-dashed border-subtle bg-app/50">
                <ShieldAlert className="w-6 h-6 text-muted mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted">No one is in this group yet.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[240px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pr-1">
                {members.map((gm) => (
                  <div 
                    key={gm.id} 
                    className="flex items-center justify-between p-2.5 rounded-lg border border-transparent hover:border-subtle hover:bg-app transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-soft text-brand-700 dark:text-brand-500 flex items-center justify-center text-xs font-bold border border-brand-500/20">
                        {getInitials(gm.profile?.full_name)}
                      </div>
                      <span className="text-sm font-medium text-main">
                        {gm.profile?.full_name || 'Unknown User'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMember(gm.user_id)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted hover:text-red-600 hover:bg-red-500/10 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
                    >
                      <UserMinus className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <hr className="border-subtle" />

          {/* Add Members Section */}
          <section>
            <h3 className="text-sm font-semibold text-main mb-3">Add to group</h3>
            
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Search available members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-app border border-subtle rounded-lg text-sm text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all placeholder:text-muted/70"
              />
            </div>

            {filteredAvailable.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-muted">
                  {search ? 'No matches found.' : 'Everyone is already in this group!'}
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[240px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pr-1">
                {filteredAvailable.map((m) => (
                  <div 
                    key={m.id} 
                    className="flex items-center justify-between p-2.5 rounded-lg border border-subtle bg-app hover:border-brand-500/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface border border-subtle text-muted flex items-center justify-center text-xs font-bold">
                        {getInitials(m.profile?.full_name)}
                      </div>
                      <span className="text-sm font-medium text-main">
                        {m.profile?.full_name || 'Unknown User'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => addMember(m.user_id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-brand-600 bg-brand-soft hover:bg-brand-500 hover:text-white transition-colors cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}