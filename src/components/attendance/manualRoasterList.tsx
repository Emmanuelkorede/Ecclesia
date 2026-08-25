import { useState } from 'react';
import { useMemberships } from '../../hooks/useMemberShip';
import { useAuth } from '../../hooks/useAuth';
import * as attendanceService from '../../services/attendaceServices';
import { Check, Search, UserCheck, UserX, AlertCircle } from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';

interface Profile {
  full_name?: string | null;
}

interface Member {
  id: string;
  user_id: string;
  profile?: Profile | null;
}

interface Props {
  sessionId: string;
  checkedInUserIds: string[];
  eligibleUserIds: Set<string> | null; // null = no group restriction, show everyone
  onCheckedIn?: () => void;
  readOnly?: boolean;
}

export default function ManualRosterList({
  sessionId,
  checkedInUserIds,
  eligibleUserIds,
  onCheckedIn,
  readOnly = false,
}: Props) {
  const { members, loading } = useMemberships();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const typedMembers = (members as Member[]) || [];

  const eligibleMembers = eligibleUserIds
    ? typedMembers.filter((m) => eligibleUserIds.has(m.user_id))
    : typedMembers;

  const filtered = eligibleMembers.filter((m) =>
    m.profile?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCheckIn = async (memberUserId: string) => {
    if (!user) return;
    setProcessingId(memberUserId);
    try {
      await attendanceService.manualCheckIn(sessionId, memberUserId, user.id);
      onCheckedIn?.();
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-muted gap-2">
        <Spinner size="sm" className="text-brand-500" />
        <span className="text-xs font-medium">Loading members...</span>
      </div>
    );
  }

  if (eligibleUserIds && eligibleMembers.length === 0) {
    return (
      <div className="flex items-center gap-2.5 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-medium">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>No members belong to the group this event is restricted to.</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search members by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-app border border-subtle rounded-lg text-xs font-medium text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all placeholder:text-muted"
        />
      </div>

      {/* Roster List */}
      {filtered.length === 0 ? (
        <div className="text-center py-8 text-xs text-muted border border-dashed border-subtle rounded-lg">
          No members found matching &quot;{search}&quot;.
        </div>
      ) : (
        <div className="divide-y divide-subtle border border-subtle rounded-lg overflow-hidden bg-app/30 max-h-[420px] overflow-y-auto">
          {filtered.map((m) => {
            const alreadyIn = checkedInUserIds.includes(m.user_id);
            const isProcessing = processingId === m.user_id;

            return (
              <div
                key={m.id}
                className="flex items-center justify-between p-3 sm:px-4 hover:bg-surface transition-colors gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs shrink-0">
                    {m.profile?.full_name ? m.profile.full_name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <span className="text-xs font-semibold text-main truncate">
                    {m.profile?.full_name || 'Unnamed Member'}
                  </span>
                </div>

                <div className="shrink-0">
                  {alreadyIn ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <Check className="w-3.5 h-3.5" />
                      <span>Checked in</span>
                    </span>
                  ) : readOnly ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <UserX className="w-3.5 h-3.5 opacity-60" />
                      <span>Did not attend</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleCheckIn(m.user_id)}
                      disabled={isProcessing}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-xs font-semibold rounded-md shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isProcessing ? (
                        <>
                          <Spinner size="sm" className="text-white" />
                          <span>Checking in...</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Check in</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}