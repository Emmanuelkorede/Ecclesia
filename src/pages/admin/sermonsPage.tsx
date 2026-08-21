import { useState } from 'react';
import { useSermons } from '../../hooks/useSermons';
import { formatShortDate } from '../../utils/dateHelpers';
import { Plus, X, Trash2, Mic, CalendarDays, AlertCircle, Video, AlertTriangle } from 'lucide-react';
import VideoLightbox from '../../components/media/lightBox';
import { Spinner } from '../../components/ui/Spinner';

const SERMON_TAG_SUGGESTIONS = [
  'Sunday School',
  'Digging Deep',
  'Youth Service',
  'Bible Study',
  'Sunday Service',
  'Midweek Service',
  'Prayer Meeting',
  'Special Event',
  'Worship',
  'Evangelism',
  'Other'
];

export default function SermonsPage() {
  const { sermons, loading, createSermon, deleteSermon } = useSermons();
  const [showForm, setShowForm] = useState(false);
  const [sermonToDelete, setSermonToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [title, setTitle] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [datePreached, setDatePreached] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

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
        tags 
      });
      setTitle(''); 
      setMediaUrl(''); 
      setSpeaker(''); 
      setDatePreached(''); 
      setTags([]); 
      setShowForm(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add sermon.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!sermonToDelete) return;
    setDeleting(true);
    try {
      await deleteSermon(sermonToDelete);
      setSermonToDelete(null);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full space-y-6 animate-in fade-in duration-300 pb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-main tracking-tight">Sermons</h1>
          <p className="text-muted mt-1 text-sm">
            Manage and share your church's message library.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Sermon</span>
        </button>
      </div>

      {/* Sermons Grid / List Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted">
          <Spinner size="md" className="text-brand-500 mb-3" />
          <p className="text-sm font-medium">Loading sermons...</p>
        </div>
      ) : sermons.length === 0 ? (
        <div className="py-16 px-4 text-center rounded-xl border border-dashed border-subtle bg-surface/50">
          <Video className="w-10 h-10 text-muted mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium text-main">No sermons found</p>
          <p className="text-xs text-muted mt-1">Upload your first message to build the library.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sermons.map((s) => (
            <div 
              key={s.id} 
              className="group flex flex-col bg-surface border border-subtle rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-brand-500/30"
            >
              {/* Media Thumbnail */}
              <div className="w-full shrink-0 border-b border-subtle relative">
                <VideoLightbox url={s.media_url} />
              </div>
              
              {/* Card Body */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-base font-semibold text-main line-clamp-2 leading-tight">
                    {s.title}
                  </h3>
                  <button 
                    type="button" 
                    onClick={() => setSermonToDelete(s.id)}
                    className="p-1.5 text-muted hover:text-red-600 hover:bg-red-500/10 rounded-md transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer shrink-0"
                    title="Delete Sermon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-1.5 mt-auto">
                  {s.speaker && (
                    <div className="flex items-center gap-2 text-xs font-medium text-muted">
                      <Mic className="w-3.5 h-3.5" />
                      <span className="truncate">{s.speaker}</span>
                    </div>
                  )}
                  {s.date_preached && (
                    <div className="flex items-center gap-2 text-xs font-medium text-muted">
                      <CalendarDays className="w-3.5 h-3.5" />
                      <span>{formatShortDate(s.date_preached)}</span>
                    </div>
                  )}
                </div>

                {(s.tags ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-subtle">
                    {s.tags!.map((t) => (
                      <span 
                        key={t}
                        className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-brand-soft text-brand-700 dark:text-brand-400 border border-brand-500/20"
                      >
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

      {/* Delete Confirmation Modal */}
      {sermonToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-sm rounded-xl shadow-xl border border-subtle overflow-hidden p-6 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              
              <h3 className="text-base font-semibold text-main mb-1">Delete Sermon?</h3>
              <p className="text-xs text-muted leading-relaxed mb-6">
                Are you sure you want to remove this sermon? This action cannot be undone.
              </p>

              <div className="flex items-center justify-end gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setSermonToDelete(null)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-app hover:bg-surface border border-subtle text-main text-xs font-semibold rounded-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <Spinner size="sm" className="text-white" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Sermon Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-md rounded-xl shadow-xl border border-subtle overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between px-5 py-4 border-b border-subtle bg-app/50">
              <h2 className="text-base font-semibold text-main">Add Sermon</h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-1.5 text-muted hover:text-main hover:bg-surface rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[80vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {error && (
                <div className="flex items-start gap-2 p-3 mb-5 text-xs rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                  <span className="leading-snug">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-main mb-1.5">Title</label>
                  <input 
                    type="text" 
                    required 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. The Power of Faith"
                    className="w-full px-3 py-2 bg-app border border-subtle rounded-lg text-sm text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-main mb-1.5">Video URL (YouTube, Vimeo, Facebook)</label>
                  <input 
                    type="url" 
                    required 
                    value={mediaUrl} 
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full px-3 py-2 bg-app border border-subtle rounded-lg text-sm text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-main mb-1.5">Speaker (optional)</label>
                    <input 
                      type="text" 
                      value={speaker} 
                      onChange={(e) => setSpeaker(e.target.value)}
                      placeholder="e.g. Pastor John"
                      className="w-full px-3 py-2 bg-app border border-subtle rounded-lg text-sm text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-main mb-1.5">Date preached</label>
                    <input 
                      type="date" 
                      value={datePreached} 
                      onChange={(e) => setDatePreached(e.target.value)}
                      className="w-full px-3 py-2 bg-app border border-subtle rounded-lg text-sm text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-main mb-1.5">Tags (optional)</label>
                  <div className="flex flex-wrap gap-1.5">
                    {SERMON_TAG_SUGGESTIONS.map((tag) => {
                      const isSelected = tags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                              : 'bg-app border-subtle text-muted hover:text-main hover:border-brand-500/50'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 border-t border-subtle">
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Spinner size="sm" className="text-white" />
                        <span>Adding...</span>
                      </>
                    ) : (
                      <span>Add Sermon</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}