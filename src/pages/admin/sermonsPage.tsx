import { useState } from 'react';
import { useSermons } from '../../hooks/useSermons';
import MemberTagPicker from '../../components/groups/MemberTagPicker';
import VideoEmbed from '../../components/media/videoEmbed';
import { formatShortDate } from '../../utils/dateHelpers';
import { Plus, X, Trash2 } from 'lucide-react';

const SERMON_TAG_SUGGESTIONS = ['Sunday School', 'Digging Deep', 'Youth Service', 'Bible Study'];
type FilterRange = 'all' | '7d' | '14d' | '30d';

export default function SermonsPage() {
  const { sermons, loading, createSermon, deleteSermon } = useSermons();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [datePreached, setDatePreached] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [filter, setFilter] = useState<FilterRange>('all');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createSermon({ title, mediaUrl, speaker: speaker || undefined, datePreached: datePreached || undefined, tags });
      setTitle(''); setMediaUrl(''); setSpeaker(''); setDatePreached(''); setTags([]); setShowForm(false);
    } catch (err: any) {
      setError(err.message ?? 'Failed to add sermon.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = sermons.filter((s) => {
    if (filter === 'all') return true;
    const days = filter === '7d' ? 7 : filter === '14d' ? 14 : 30;
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return new Date(s.date_preached ?? '') >= cutoff;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Sermons</h1>
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterRange)}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-white"
          >
            <option value="all">All time</option>
            <option value="7d">Last 7 days</option>
            <option value="14d">Last 2 weeks</option>
            <option value="30d">Last month</option>
          </select>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-4 py-2"
          >
            <Plus className="w-4 h-4" /> Add Sermon
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 overflow-y-auto py-8">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Add sermon</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-slate-500" /></button>
            </div>

            {error && <div className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/40 rounded-lg px-3 py-2">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1">Title</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1">Video URL (YouTube, Vimeo, Facebook)</label>
                <input type="url" required value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1">Speaker (optional)</label>
                <input type="text" value={speaker} onChange={(e) => setSpeaker(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1">Date preached</label>
                <input type="date" value={datePreached} onChange={(e) => setDatePreached(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1">Tags (optional)</label>
                <MemberTagPicker tags={tags} onChange={setTags} suggestions={SERMON_TAG_SUGGESTIONS} />
              </div>
              <button type="submit" disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg py-2.5 disabled:opacity-50">
                {submitting ? 'Adding...' : 'Add sermon'}
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading sermons...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-slate-500">No sermons found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((s) => (
            <div key={s.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
              <VideoEmbed url={s.media_url} />
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-slate-900 dark:text-white text-sm">{s.title}</h3>
                  <button onClick={() => deleteSermon(s.id)}><Trash2 className="w-4 h-4 text-red-500 shrink-0" /></button>
                </div>
                {s.speaker && <p className="text-xs text-slate-500 mt-1">{s.speaker}</p>}
                <p className="text-xs text-slate-500">{formatShortDate(s.date_preached ?? '')}</p>
                {(s.tags ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {s.tags!.map((t) => (
                      <span key={t} className="text-[10px] font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}