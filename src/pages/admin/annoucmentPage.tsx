import { useState } from 'react';
import { useAnnouncements } from '../../hooks/useAnnoucments';
import { useGroups } from '../../hooks/useGoups';
import { formatRelativeTime } from '../../utils/dateHelpers';
import { Plus, X, Trash2, Bell } from 'lucide-react';

export default function AnnouncementsPage() {
  const { announcements, loading, createAnnouncement, deleteAnnouncement } = useAnnouncements();
  const { groups } = useGroups();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [groupId, setGroupId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createAnnouncement(title, content, groupId || undefined);
      setTitle('');
      setContent('');
      setGroupId('');
      setShowForm(false);
    } catch (err: any) {
      setError(err.message ?? 'Failed to post announcement.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--text-main)]">Announcements</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg px-4 py-2"
        >
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md bg-[var(--bg-surface)] rounded-2xl shadow-[var(--card-shadow)] p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[var(--text-main)]">New announcement</h2>
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
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Service time change this Sunday"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
                  Send to <span className="text-[var(--text-muted)]">(optional)</span>
                </label>
                <select
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Everyone</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>{g.name} only</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg py-2.5 disabled:opacity-50"
              >
                {submitting ? 'Posting...' : 'Post announcement'}
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-[var(--text-muted)]">Loading announcements...</p>
      ) : announcements.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No announcements yet — post your first one above.</p>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-[var(--text-main)]">{a.title}</h3>
                    {!a.push_sent && (
                      <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                        <Bell className="w-3 h-3" /> Not pushed
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--text-muted)] mt-1">{a.content}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-2">
                    {formatRelativeTime(a.created_at ?? '')}
                  </p>
                </div>
                <button onClick={() => deleteAnnouncement(a.id)} aria-label="Delete announcement">
                  <Trash2 className="w-4 h-4 text-red-500 shrink-0" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}