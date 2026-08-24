import { useState } from 'react';
import { useMemberships } from '../../hooks/useMemberShip';
import { useAuth } from '../../hooks/useAuth';
import * as attendanceService from '../../services/attendaceServices';
import { Check } from 'lucide-react';

interface Props {
  sessionId: string;
  checkedInUserIds: string[];
  eligibleUserIds: Set<string> | null; // null = no group restriction, show everyone
  onCheckedIn?: () => void;
  readOnly?: boolean;

}

export default function ManualRosterList({ sessionId, checkedInUserIds, eligibleUserIds, onCheckedIn , readOnly = false,
 }: Props) {
  const { members, loading } = useMemberships();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const eligibleMembers = eligibleUserIds
    ? members.filter((m: any) => eligibleUserIds.has(m.user_id))
    : members;

  const filtered = eligibleMembers.filter((m: any) =>
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

  if (loading) return <p className="text-sm text-slate-500">Loading members...</p>;

  if (eligibleUserIds && eligibleMembers.length === 0) {
    return <p className="text-sm text-slate-500">No members belong to the group this event is restricted to.</p>;
  }

  return (
    <div className="max-w-md mx-auto">
      <input
        type="text"
        placeholder="Search members..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-white mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="space-y-1 max-h-96 overflow-y-auto">
        {filtered.map((m: any) => {
          const alreadyIn = checkedInUserIds.includes(m.user_id);
          return (
            <div key={m.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
              <span className="text-sm text-slate-900 dark:text-white">{m.profile?.full_name}</span>
              {alreadyIn ? (
    <span className="flex items-center gap-1 text-xs text-emerald-600">
      <Check className="w-4 h-4" /> Checked in
    </span>
  ) : readOnly ? (
    <span className="text-xs text-slate-400">Did not attend</span>
  ) : (
    <button onClick={() => handleCheckIn(m.user_id)} disabled={processingId === m.user_id} className="text-xs font-medium text-indigo-600 hover:underline disabled:opacity-50">
      {processingId === m.user_id ? 'Checking in...' : 'Check in'}
    </button>
  )}

            </div>
          );
        })}
      </div>
    </div>
  );
}