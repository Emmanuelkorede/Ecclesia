import { useState } from 'react';
import { useMemberships } from '../../hooks/useMemberShip';
import { useAuth } from '../../hooks/useAuth';
import * as attendanceService from '../../services/attendaceServices';
import { Check } from 'lucide-react';

interface Props {
  sessionId: string;
  checkedInUserIds: string[]; // pass in already-checked-in ids so we can grey them out
  onCheckedIn?: () => void;
}

export default function ManualRosterList({ sessionId, checkedInUserIds, onCheckedIn }: Props) {
  const { members, loading } = useMemberships();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filtered = members.filter((m: any) =>
    m.profile?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCheckIn = async (memberUserId: string) => {
    if (!user) return;
    setProcessingId(memberUserId);
    try {
      await attendanceService.manualCheckIn(sessionId, memberUserId, user.id);
      onCheckedIn?.();
    } catch (err) {
      // could surface a toast here later
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <p className="text-sm text-[var(--text-muted)]">Loading members...</p>;

  return (
    <div className="max-w-md mx-auto">
      <input
        type="text"
        placeholder="Search members..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-sm text-[var(--text-main)] mb-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
      />

      <div className="space-y-1 max-h-96 overflow-y-auto">
        {filtered.map((m: any) => {
          const alreadyIn = checkedInUserIds.includes(m.user_id);
          return (
            <div
              key={m.id}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <span className="text-sm text-[var(--text-main)]">{m.profile?.full_name}</span>
              {alreadyIn ? (
                <span className="flex items-center gap-1 text-xs text-accent-600">
                  <Check className="w-4 h-4" /> Checked in
                </span>
              ) : (
                <button
                  onClick={() => handleCheckIn(m.user_id)}
                  disabled={processingId === m.user_id}
                  className="text-xs font-medium text-brand-600 hover:underline disabled:opacity-50"
                >
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