import { useState } from 'react';
import { useSchedule } from '../../hooks/useSchedule';
import { useGroups } from '../../hooks/useGoups';
import { 
  Plus, 
  X, 
  MapPin, 
  Users, 
  AlertCircle, 
  CalendarDays, 
  Trash2, 
  Clock, 
  AlertTriangle,
  ShieldAlert
} from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';

const DAYS = [
  'Sunday', 
  'Monday', 
  'Tuesday', 
  'Wednesday', 
  'Thursday', 
  'Friday', 
  'Saturday'
];

export default function SchedulePage() {
  const { schedules, loading, createSchedule, deleteSchedule } = useSchedule();
  const { groups } = useGroups();

  // Modal & Form State
  const [showForm, setShowForm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState<number>(0);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [groupId, setGroupId] = useState('');
  const [isMandatory, setIsMandatory] = useState(false);

  // Status State
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const currentDayIndex = new Date().getDay();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createSchedule({
        title,
        dayOfWeek,
        startTime,
        endTime,
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to create schedule item.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    await deleteSchedule(itemToDelete);
    setItemToDelete(null);
  };

  const grouped = DAYS.map((day, i) => ({ 
    day, 
    isToday: i === currentDayIndex,
    items: schedules.filter((s) => s.day_of_week === i) 
  }));

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6 animate-in fade-in duration-300 pb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-main tracking-tight">Schedule Management</h1>
          <p className="text-muted mt-1 text-sm">
            Create and update recurring weekly schedules and activities.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Schedule</span>
        </button>
      </div>

      {/* Main Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted">
          <Spinner size="md" className="text-brand-500 mb-3" />
          <p className="text-sm font-medium">Loading schedule...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {grouped.map(({ day, isToday, items }) => (
            <div 
              key={day} 
              className={`space-y-3 transition-all ${
                isToday 
                  ? 'p-3.5 rounded-2xl bg-brand-500/5 border border-brand-500/20' 
                  : ''
              }`}
            >
              
              {/* Day Header */}
              <div className="flex items-center gap-2 pb-1.5 border-b border-subtle">
                <CalendarDays className={`w-4 h-4 ${isToday ? 'text-brand-600' : 'text-brand-500'}`} />
                <h2 className="text-base font-semibold text-main flex items-center gap-2">
                  {day}
                  {isToday && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-600 text-white px-2 py-0.5 rounded">
                      Today
                    </span>
                  )}
                </h2>
                <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-muted">
                  {items.length}
                </span>
              </div>

              {/* Items List */}
              {items.length === 0 ? (
                <div className="py-4 px-3 text-center rounded-xl border border-dashed border-subtle bg-surface/50">
                  <p className="text-xs text-muted">No activities scheduled</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {items.map((s) => (
                    <div 
                      key={s.id}
                      className="group flex items-center justify-between gap-3 p-3.5 bg-surface border border-subtle rounded-xl shadow-sm hover:border-brand-500/40 transition-colors"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-main truncate">{s.title}</h3>
                          
                          {s.is_mandatory && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                              <ShieldAlert className="w-3 h-3" />
                              Mandatory
                            </span>
                          )}

                          {s.group_id && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-brand-soft text-brand-600 border border-brand-500/20">
                              <Users className="w-3 h-3" />
                              Restricted
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-muted">
                          <span className="flex items-center gap-1 bg-app px-2 py-0.5 rounded border border-subtle">
                            <Clock className="w-3 h-3 text-brand-500" />
                            {s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}
                          </span>

                          {s.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-muted" />
                              <span className="truncate max-w-[140px]">{s.location}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Delete Action */}
                      <button
                        type="button"
                        onClick={() => setItemToDelete(s.id)}
                        className="p-1.5 text-muted hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer shrink-0 sm:opacity-0 sm:group-hover:opacity-100"
                        title="Delete schedule item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-sm rounded-xl shadow-2xl border border-subtle p-6 animate-in zoom-in-95 duration-200 text-center">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-red-500/10 mb-4 border border-red-500/20">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-main mb-2">Delete Schedule Item?</h3>
            <p className="text-sm text-muted mb-6">
              Are you sure you want to remove this schedule entry? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setItemToDelete(null)}
                className="flex-1 px-4 py-2 bg-app border border-subtle hover:bg-subtle rounded-lg text-sm font-semibold text-main transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Overlay for Create Schedule */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-sm rounded-xl shadow-xl border border-subtle overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-subtle bg-app/50">
              <h2 className="text-base font-semibold text-main">New Schedule Entry</h2>
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
                  <label className="block text-xs font-medium text-main mb-1.5">Activity Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Mid-Week Choir Practice"
                    className="w-full px-3 py-2 bg-app border border-subtle rounded-lg text-sm text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-main mb-1.5">Day of the Week</label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-app border border-subtle rounded-lg text-sm text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all appearance-none cursor-pointer"
                  >
                    {DAYS.map((day, idx) => (
                      <option key={day} value={idx}>{day}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-main mb-1.5">Start Time</label>
                    <input
                      type="time"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2 bg-app border border-subtle rounded-lg text-sm text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-main mb-1.5">End Time</label>
                    <input
                      type="time"
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
                    placeholder="e.g. Choir Room"
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
                      Mandatory Activity
                    </label>
                    <p className="text-[11px] text-muted mt-0.5">
                      Mark this activity as strictly required for attendees
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
                        <span>Creating schedule...</span>
                      </>
                    ) : (
                      <span>Save Schedule Entry</span>
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