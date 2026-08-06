import { useState } from 'react';
import { useSermons } from '../../hooks/useSermons';
import { formatShortDate } from '../../utils/dateHelpers';
import { Plus, X, Trash2, Play } from 'lucide-react';

export default function SermonsPage() {
  const { sermons, loading, createSermon, deleteSermon } = useSermons();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [datePreached, setDatePreached] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createSermon({
        title,
        mediaUrl,
        speaker: speaker || undefined,
        datePreached: datePreached || undefined,
      });
      setTitle('');
      setMediaUrl('');
      setSpeaker('');
      setDatePreached('');
      setShowForm(false);
    } catch (err: any) {
      setError(err.message ?? 'Failed to add sermon.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--text-main)]">Sermons</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg px-4 py-2"
        >
          <Plus className="w-4 h-4" /> Add Sermon
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md bg-[var(--bg-surface)] rounded-2xl shadow-[var(--card-shadow)] p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[var(--text-main)]">Add sermon</h2>
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
                  placeholder="Walking in Faith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
                  Video URL <span className="text-[var(--text-muted)]">(YouTube, Vimeo, Facebook)</span>
                </label>
                <input
                  type="url"
                  required
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
                  Speaker <span className="text-[var(--text-muted)]">(optional)</span>
                </label>
                <input
                  type="text"
                  value={speaker}
                  onChange={(e) => setSpeaker(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
                  Date preached <span className="text-[var(--text-muted)]">(optional)</span>
                </label>
                <input
                  type="date"
                  value={datePreached}
                  onChange={(e) => setDatePreached(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg py-2.5 disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Add sermon'}
              </button>
            </form>
          </div>
        </div>
      )}

{loading ? (
        <p className="text-sm text-[var(--text-muted)]">Loading sermons...</p>
      ) : sermons.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No sermons yet — add your first one above.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sermons.map((s) => (
            <div
              key={s.id}
              className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/40 text-brand-600 flex items-center justify-center shrink-0">
                  <Play className="w-4 h-4" />
                </div>
                <h3 className="font-medium text-[var(--text-main)] text-sm">{s.title}</h3>
              </div>
              {s.speaker && <p className="text-xs text-[var(--text-muted)]">{s.speaker}</p>}
              <p className="text-xs text-[var(--text-muted)]">{formatShortDate(s.date_preached ?? '')}</p>
              <div className="flex items-center justify-between mt-3">
                {/* Fixed the missing '<a ' right below this line */}
                <a
                  href={s.media_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-brand-600 hover:underline"
                >
                  Watch
                </a>
                <button onClick={() => deleteSermon(s.id)} aria-label="Delete sermon">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}