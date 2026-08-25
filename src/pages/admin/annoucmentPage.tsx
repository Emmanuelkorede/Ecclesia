import { useState } from 'react';
import { useAnnouncements } from '../../hooks/useAnnoucments';
import { useGroups } from '../../hooks/useGoups';
import { formatRelativeTime } from '../../utils/dateHelpers';
import { 
  Plus, 
  X, 
  Trash2, 
  Bell,
  BellOff,
  AlertCircle,
  Megaphone
} from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';

export default function AnnouncementsPage() {
  const { announcements, loading, createAnnouncement, deleteAnnouncement } = useAnnouncements();
  const { groups } = useGroups();
  
  // Create form state
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [groupId, setGroupId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to post announcement.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteAnnouncement(deletingId);
      setDeletingId(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete announcement.';
      setDeleteError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6 animate-in fade-in duration-300 pb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-main tracking-tight">Announcements</h1>
          <p className="text-muted mt-1 text-sm">
            Broadcast updates to everyone or specific groups.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      {/* Modal Overlay for Create Announcement */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-sm rounded-xl shadow-xl border border-subtle overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-subtle bg-app/50">
              <h2 className="text-base font-semibold text-main">New announcement</h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-1.5 text-muted hover:text-main hover:bg-surface rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto max-h-[80vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {error && (
                <div className="flex items-start gap-2 p-3 mb-5 text-xs rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                  <span className="leading-snug">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-main mb-1.5">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Service time change this Sunday"
                    className="w-full px-3 py-2 bg-app border border-subtle rounded-lg text-sm text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-main mb-1.5">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type your announcement details here..."
                    className="w-full px-3 py-2 bg-app border border-subtle rounded-lg text-sm text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all resize-y min-h-[100px]"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-main mb-1.5">
                    Send to <span className="text-muted font-normal">(optional)</span>
                  </label>
                  <select
                    value={groupId}
                    onChange={(e) => setGroupId(e.target.value)}
                    className="w-full px-3 py-2 bg-app border border-subtle rounded-lg text-sm text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Everyone</option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>{g.name} only</option>
                    ))}
                  </select>
                </div>
                
                <div className="pt-3 border-t border-subtle">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Spinner size="sm" className="text-white" />
                        <span>Posting...</span>
                      </>
                    ) : (
                      <span>Post announcement</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-sm rounded-xl shadow-xl border border-subtle overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                <div className="p-2.5 bg-red-500/10 rounded-full">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-base font-semibold text-main">Delete Announcement</h3>
              </div>
              
              <p className="text-sm text-muted leading-relaxed">
                Are you sure you want to delete this announcement? This action cannot be undone.
              </p>

              {deleteError && (
                <div className="p-3 text-xs rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
                  {deleteError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => {
                    setDeletingId(null);
                    setDeleteError(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-muted hover:text-main hover:bg-app rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDeleteConfirm}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
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

      {/* List Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted">
          <Spinner size="md" className="text-brand-500 mb-3" />
          <p className="text-sm font-medium">Loading announcements...</p>
        </div>
      ) : announcements.length === 0 ? (
        <div className="py-12 px-4 text-center rounded-xl border border-dashed border-subtle bg-surface/50">
          <Megaphone className="w-8 h-8 text-muted mx-auto mb-3" />
          <p className="text-sm text-muted">No announcements yet — post your first one above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="group flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 sm:px-5 bg-surface border border-subtle rounded-xl shadow-sm hover:border-brand-500/40 transition-colors"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-base font-semibold text-main">{a.title}</h3>
                  {!a.push_sent && (
                    <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      <BellOff className="w-3 h-3" /> Not pushed
                    </span>
                  )}
                  {a.push_sent && (
                     <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-brand-soft text-brand-600 border border-brand-500/20">
                     <Bell className="w-3 h-3" /> Pushed
                   </span>
                  )}
                </div>
                
                <p className="text-sm text-main whitespace-pre-wrap leading-relaxed opacity-90">
                  {a.content}
                </p>
                
                <p className="text-xs font-medium text-muted pt-1">
                  Posted {formatRelativeTime(a.created_at ?? '')}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0 mt-2 sm:mt-0">
                <button
                  type="button"
                  onClick={() => setDeletingId(a.id)}
                  className="p-2 text-muted hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Delete announcement"
                  aria-label="Delete announcement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}