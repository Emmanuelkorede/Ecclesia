import React, { useState } from 'react';
import { useSchedule } from '../../hooks/useSchedule';
import { useGroups } from '../../hooks/useGoups';
import { 
  Plus, 
  X, 
  Trash2, 
  Pencil, 
  Clock, 
  MapPin, 
  CalendarDays,
  AlertCircle,
  Users,
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
  const { schedules, loading, createSchedule, updateSchedule, deleteSchedule } = useSchedule();
  const { groups } = useGroups();
  
  // Modal & Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Field State
  const [title, setTitle] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState(0);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [groupId, setGroupId] = useState('');
  const [isMandatory, setIsMandatory] = useState(false);
  
  // Status State
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const openCreate = () => {
    setEditingId(null);
    setTitle(''); 
    setDayOfWeek(0); 
    setStartTime(''); 
    setEndTime(''); 
    setLocation('');
    setGroupId('');
    setIsMandatory(false);
    setShowForm(true);
  };

  const openEdit = (s: (typeof schedules)[number]) => {
    setEditingId(s.id);
    setTitle(s.title);
    setDayOfWeek(s.day_of_week);
    setStartTime(s.start_time.slice(0, 5));
    setEndTime(s.end_time.slice(0, 5));
    setLocation(s.location ?? '');
    setGroupId(s.group_id ?? '');
    setIsMandatory(s.is_mandatory ?? false);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const params = {
        title,
        dayOfWeek,
        startTime,
        endTime,
        location: location || undefined,
        groupId: groupId || undefined,
        isMandatory,
      };
      if (editingId) {
        await updateSchedule(editingId, params);
      } else {
        await createSchedule(params);
      }
      setShowForm(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred saving the schedule.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const grouped = DAYS.map((day, i) => ({ 
    day, 
    items: schedules.filter((s) => s.day_of_week === i) 
  }));

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6 animate-in fade-in duration-300 pb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-main tracking-tight">Weekly Schedule</h1>
          <p className="text-muted mt-1 text-sm">
            Manage recurring weekly activities and services.
          </p>
        </div>
        <button 
          type="button" 
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Activity</span>
        </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted">
          <Spinner size="md" className="text-brand-500 mb-3" />
          <p className="text-sm font-medium">Loading schedule...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {grouped.map(({ day, items }) => (
            <div key={day} className="space-y-3">
              
              {/* Day Header */}
              <div className="flex items-center gap-2 pb-1.5 border-b border-subtle">
                <CalendarDays className="w-4 h-4 text-brand-500" />
                <h2 className="text-base font-semibold text-main">{day}</h2>
                <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-muted">
                  {items.length}
                </span>
              </div>

              {/* Day Activities List */}
              {items.length === 0 ? (
                <div className="py-4 px-3 text-center rounded-xl border border-dashed border-subtle bg-surface/50">
                  <p className="text-xs text-muted">No activities scheduled</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {items.map((s) => (
                    <div 
                      key={s.id}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 px-3.5 bg-surface border border-subtle rounded-xl shadow-sm hover:border-brand-500/40 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h3 className="text-sm font-semibold text-main">{s.title}</h3>
                          {s.is_mandatory && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-red-500/10 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full">
                              <ShieldAlert className="w-2.5 h-2.5" />
                              Mandatory
                            </span>
                          )}
                          {s.group_id && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-muted px-1.5 py-0.5 rounded-full">
                              <Users className="w-2.5 h-2.5" />
                              Restricted
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-muted">
                          <span className="flex items-center gap-1 bg-app px-1.5 py-0.5 rounded border border-subtle">
                            <Clock className="w-3 h-3 text-brand-500" />
                            {s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}
                          </span>
                          {s.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate max-w-[140px]">{s.location}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button 
                          type="button" 
                          onClick={() => openEdit(s)}
                          className="p-1.5 text-muted hover:text-brand-600 hover:bg-brand-500/10 rounded-md transition-colors cursor-pointer"
                          title="Edit activity"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => deleteSchedule(s.id)}
                          className="p-1.5 text-muted hover:text-red-600 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer"
                          title="Delete activity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal Overlay for Add/Edit */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-sm rounded-xl shadow-xl border border-subtle overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-subtle bg-app/50">
              <h2 className="text-base font-semibold text-main">
                {editingId ? 'Edit Activity' : 'Add Activity'}
              </h2>
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="p-1.5 text-muted hover:text-main hover:bg-surface rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 max-h-[80vh] overflow-y-auto">
              {error && (
                <div className="flex items-start gap-2 p-3 mb-4 text-xs rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                  <span className="leading-snug">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-main mb-1">Activity Title</label>
                  <input 
                    type="text" 
                    required 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="e.g. Sunday Service"
                    className="w-full px-3 py-2 bg-app border border-subtle rounded-lg text-sm text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-main mb-1">Day of the Week</label>
                  <select 
                    value={dayOfWeek} 
                    onChange={(e) => setDayOfWeek(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-app border border-subtle rounded-lg text-sm text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all appearance-none cursor-pointer"
                  >
                    {DAYS.map((d, i) => (
                      <option key={d} value={i}>{d}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-main mb-1">Start Time</label>
                    <input 
                      type="time" 
                      required 
                      value={startTime} 
                      onChange={(e) => setStartTime(e.target.value)} 
                      className="w-full px-3 py-2 bg-app border border-subtle rounded-lg text-sm text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-main mb-1">End Time</label>
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
                  <label className="block text-xs font-medium text-main mb-1">
                    Location <span className="text-muted font-normal">(Optional)</span>
                  </label>
                  <input 
                    type="text" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    placeholder="e.g. Main Sanctuary"
                    className="w-full px-3 py-2 bg-app border border-subtle rounded-lg text-sm text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-main mb-1">
                    Restrict to Group <span className="text-muted font-normal">(Optional)</span>
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

                <label className="flex items-center gap-2 text-xs font-medium text-main cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={isMandatory} 
                    onChange={(e) => setIsMandatory(e.target.checked)} 
                    className="rounded border-subtle text-brand-600 focus:ring-brand-500/30 cursor-pointer"
                  />
                  Mandatory attendance
                </label>
                
                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Spinner size="sm" className="text-white" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{editingId ? 'Save Changes' : 'Add Activity'}</span>
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