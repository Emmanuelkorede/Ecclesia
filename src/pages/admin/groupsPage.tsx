import { useState } from 'react';
import { useGroups } from '../../hooks/useGoups';
import GroupCard from '../../components/groups/groupCard';
import PlanLimitBanner from '../../components/billing/planLimitBanner';
import { Plus, X } from 'lucide-react';

export default function GroupsPage() {
  const { groups, loading, createGroup, deleteGroup } = useGroups();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createGroup(name, description || undefined);
      setName('');
      setDescription('');
      setShowForm(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--text-main)]">Groups</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg px-4 py-2"
        >
          <Plus className="w-4 h-4" /> New Group
        </button>
      </div>

      <PlanLimitBanner currentCount={groups.length} metric="groups" />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md bg-[var(--bg-surface)] rounded-2xl shadow-[var(--card-shadow)] p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[var(--text-main)]">Create group</h2>
              <button onClick={() => setShowForm(false)}>
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>

            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/40 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Choir"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
                  Description <span className="text-[var(--text-muted)]">(optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg py-2.5 disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Create group'}
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-[var(--text-muted)]">Loading groups...</p>
      ) : groups.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No groups yet — create your first one above.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((g) => (
            <GroupCard
              key={g.id}
              name={g.name}
              description={g.description}
              leaderName={null}
              memberCount={0}
              onDelete={() => deleteGroup(g.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}