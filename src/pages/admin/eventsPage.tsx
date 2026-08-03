import { useState } from 'react';
import { useEvents } from '../../hooks/useEvents';
import { useGroups } from '../../hooks/useGoups';
import PlanLimitBanner from '../../components/billing/planLimitBanner';
import { formatFullDate, formatTime } from '../../utils/dateHelpers';
import { Plus, X, MapPin, Users } from 'lucide-react';

export default function EventsPage() {
  const { events, loading, createEvent, deleteEvent } = useEvents();
  const { groups } = useGroups();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [groupId, setGroupId] = useState('');
  const [isMandatory, setIsMandatory] = useState(false);
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--text-main)]">Events</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-black-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg px-4 py-2"
        >
          <Plus className="w-4 h-4" /> New Event
        </button>
      </div>

      <PlanLimitBanner currentCount={thisMonthCount} metric="events" />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 overflow-y-auto py-8">
          <div className="w-full max-w-md bg-[var(--bg-surface)] rounded-2xl shadow-[var(--card-shadow)] p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[var(--text-main)]">Create event</h2>
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
                  placeholder="Sunday Service"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Start</label>
                  <input
                    type="datetime-local"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">End</label>
                  <input
                    type="datetime-local"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
                  Location <span className="text-[var(--text-muted)]">(optional)</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Main Auditorium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
                  Restrict to group <span className="text-[var(--text-muted)]">(optional)</span>
                </label>
                <select
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Open to everyone</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm text-[var(--text-main)]">
                <input
                  type="checkbox"
                  checked={isMandatory}
                  onChange={(e) => setIsMandatory(e.target.checked)}
                  className="rounded"
                />
                Mandatory attendance
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg py-2.5 disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Create event'}
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-[var(--text-muted)]">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No events yet — create your first one above.</p>
      ) : (
        <div className="space-y-3">
          {events.map((e) => (
            <div
              key={e.id}
              className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-4 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-[var(--text-main)]">{e.title}</h3>
                  {e.is_mandatory && (
                    <span className="text-xs font-medium bg-red-50 dark:bg-red-950/40 text-red-600 px-2 py-0.5 rounded-full">
                      Mandatory
                    </span>
                  )}
                  {e.group_id && (
                    <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                      <Users className="w-3 h-3" /> Restricted
                    </span>
                  )}
                </div>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  {formatFullDate(e.start_time)} · {formatTime(e.start_time)}
                </p>
                {e.location && (
                  <p className="text-sm text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {e.location}
                  </p>
                )}
              </div>
              <button
                onClick={() => deleteEvent(e.id)}
                className="text-sm text-red-600 hover:underline shrink-0"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}