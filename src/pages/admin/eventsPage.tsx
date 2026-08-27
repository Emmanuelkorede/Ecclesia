import { useState } from 'react';
import { useEvents } from '../../hooks/useEvents';
import { useGroups } from '../../hooks/useGroups';
import PlanLimitBanner from '../../components/billing/planLimitBanner';
import { formatFullDate, formatTime } from '../../utils/dateHelpers';
import { 
  Plus, 
  X, 
  MapPin, 
  Users, 
  AlertCircle, 
  CalendarDays, 
  Trash2,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';

export default function EventsPage() {
  const { events, loading, createEvent, deleteEvent } = useEvents();
  const { groups } = useGroups();
  
  // Modal & Form State
  const [showForm, setShowForm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  
  // Field State
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [groupId, setGroupId] = useState('');
  const [isMandatory, setIsMandatory] = useState(false);
  
  // Status State
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const thisMonthCount = events.filter((e) => {
    const d = new Date(e.start_time);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createEvent({
        title,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        location: location || undefined,
        groupId: groupId || undefined,
        isMandatory,
      });
      setTitle('');
      setStartTime('');
      setEndTime('');
      setLocation('');
      setGroupId('');
      setIsMandatory(false);
      setShowForm(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create event.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    await deleteEvent(eventToDelete);
    setEventToDelete(null);
  };

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6 animate-in fade-in duration-300 pb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-main tracking-tight">Events</h1>
          <p className="text-muted mt-1 text-sm">
            Create and manage upcoming church events.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Event</span>
        </button>
      </div>

      <PlanLimitBanner currentCount={thisMonthCount} metric="events" />

      {/* Events List Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted">
          <Spinner size="md" className="text-brand-500 mb-3" />
          <p className="text-sm font-medium">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="py-12 px-4 text-center rounded-xl border border-dashed border-subtle bg-surface/50">
          <CalendarDays className="w-8 h-8 text-muted mx-auto mb-3" />
          <p className="text-sm text-muted">No events yet — create your first one above.</p>
        </div>
      ) : (
        <div className="space-y-4"> {/* Increased gap between cards */}
          {events.map((e) => (
            <div
              key={e.id}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:px-5 bg-surface border border-subtle rounded-xl shadow-sm hover:border-brand-500/40 transition-colors"
            >
              <div className="space-y-2.5"> {/* Added more breathing room between title and details */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-base font-semibold text-main">{e.title}</h3>
                  {e.is_mandatory && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                      Mandatory
                    </span>
                  )}
                  {e.group_id && (
                    <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-brand-soft text-brand-600 border border-brand-500/20">
                      <Users className="w-3 h-3" /> Restricted
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-muted">
                  <span className="flex items-center gap-1.5 bg-app px-2 py-1 rounded-md border border-subtle">
                    <Clock className="w-3.5 h-3.5 text-brand-500" />
                    {formatFullDate(e.start_time)} · {formatTime(e.start_time)}
                  </span>
                  
                  {e.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[200px]">{e.location}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0 mt-3 sm:mt-0">
                <button
                  type="button"
                  onClick={() => setEventToDelete(e.id)}
                  className="p-2 text-muted hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Delete event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {eventToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-sm rounded-xl shadow-2xl border border-subtle p-6 animate-in zoom-in-95 duration-200 text-center">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-red-500/10 mb-4 border border-red-500/20">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-main mb-2">Delete Event?</h3>
            <p className="text-sm text-muted mb-6">
              Are you sure you want to delete this event? This action cannot be undone and attendees will no longer see it.
            </p>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setEventToDelete(null)}
                className="flex-1 px-4 py-2 bg-app border border-subtle hover:bg-subtle rounded-lg text-sm font-semibold text-main transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Overlay for Create Event */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-sm rounded-xl shadow-xl border border-subtle overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-subtle bg-app/50">
              <h2 className="text-base font-semibold text-main">Create event</h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-1.5 text-muted hover:text-main hover:bg-surface rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body (Hidden Scrollbar Implementation) */}
            <div className="p-5 overflow-y-auto max-h-[80vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {error && (
                <div className="flex items-start gap-2 p-3 mb-5 text-xs rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                  <span className="leading-snug">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-main mb-1.5">Event Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Sunday Service"
                    className="w-full px-3 py-2 bg-app border border-subtle rounded-lg text-sm text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-main mb-1.5">Start Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2 bg-app border border-subtle rounded-lg text-sm text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-main mb-1.5">End Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-3 py-2 bg-app border border-subtle rounded-lg text-sm text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-main mb-1.5">
                    Location <span className="text-muted font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Main Auditorium"
                    className="w-full px-3 py-2 bg-app border border-subtle rounded-lg text-sm text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-main mb-1.5">
                    Restrict to group <span className="text-muted font-normal">(optional)</span>
                  </label>
                  <select
                    value={groupId}
                    onChange={(e) => setGroupId(e.target.value)}
                    className="w-full px-3 py-2 bg-app border border-subtle rounded-lg text-sm text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Open to everyone</option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>

                {/* SaaS Custom Toggle Switch */}
                <div 
                  onClick={() => setIsMandatory(!isMandatory)}
                  className="flex items-center justify-between p-3.5 border border-subtle rounded-xl bg-app cursor-pointer hover:border-brand-500/30 transition-all select-none group"
                >
                  <div>
                    <label className="block text-sm font-medium text-main cursor-pointer group-hover:text-brand-600 transition-colors">
                      Mandatory Event
                    </label>
                    <p className="text-[11px] text-muted mt-0.5">
                      Mark this event as strictly required for attendees
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isMandatory}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isMandatory ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                  >
                    <span 
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isMandatory ? 'translate-x-4' : 'translate-x-0'}`} 
                    />
                  </button>
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
                        <span>Creating event...</span>
                      </>
                    ) : (
                      <span>Create event</span>
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