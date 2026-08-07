import { useState } from 'react';
import { useSchedule } from '../../hooks/useSchedule';
import { Plus, X, Trash2, Pencil } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function SchedulePage() {
  const { schedules, loading, createSchedule, updateSchedule, deleteSchedule } = useSchedule();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState(0);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const openCreate = () => {
    setEditingId(null);
    setTitle(''); setDayOfWeek(0); setStartTime(''); setEndTime(''); setLocation('');
    setShowForm(true);
  };

  const openEdit = (s: (typeof schedules)[number]) => {
    setEditingId(s.id);
    setTitle(s.title);
    setDayOfWeek(s.day_of_week);
    setStartTime(s.start_time.slice(0, 5));
    setEndTime(s.end_time.slice(0, 5));
    setLocation(s.location ?? '');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (editingId) {
        await updateSchedule(editingId, { title, dayOfWeek, startTime, endTime, location: location || undefined });
      } else {
        await createSchedule({ title, dayOfWeek, startTime, endTime, location: location || undefined });
      }
      setShowForm(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const grouped = DAYS.map((day, i) => ({ day, items: schedules.filter((s) => s.day_of_week === i) }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Weekly Schedule</h1>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-4 py-2">
          <Plus className="w-4 h-4" /> Add Activity
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {editingId ? 'Edit activity' : 'Add weekly activity'}
              </h2>
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
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1">Day</label>
                <select value={dayOfWeek} onChange={(e) => setDayOfWeek(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-white">
                  {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1">Start</label>
                  <input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1">End</label>
                  <input type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1">Location (optional)</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-white" />
              </div>
              <button type="submit" disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg py-2.5 disabled:opacity-50">
                {submitting ? 'Saving...' : editingId ? 'Save changes' : 'Add activity'}
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading schedule...</p>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
          {grouped.map(({ day, items }) => (
            <div key={day} className="border-b border-slate-200 dark:border-slate-700 last:border-0">
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 text-sm font-semibold text-slate-700 dark:text-slate-300">{day}</div>
              {items.length === 0 ? (
                <p className="px-4 py-3 text-sm text-slate-400">No activities</p>
              ) : (
                items.map((s) => (
                  <div key={s.id} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{s.title}</p>
                      <p className="text-xs text-slate-500">
                        {s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}{s.location && ` · ${s.location}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(s)}><Pencil className="w-4 h-4 text-slate-400 hover:text-indigo-600" /></button>
                      <button onClick={() => deleteSchedule(s.id)}><Trash2 className="w-4 h-4 text-red-500" /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}