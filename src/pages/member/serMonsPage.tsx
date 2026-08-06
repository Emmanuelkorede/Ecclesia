import { useState } from 'react';
import { useEvents } from '../../hooks/useEvents';
import { useSermons } from '../../hooks/useSermons';
import { formatFullDate, formatTime } from '../../utils/dateHelpers';
import { CalendarDays, MapPin, Play, Users } from 'lucide-react';

type Tab = 'schedule' | 'sermons';

export default function ScheduleSermonsPage() {
  const [tab, setTab] = useState<Tab>('schedule');
  const { events, loading: eventsLoading } = useEvents();
  const { sermons, loading: sermonsLoading } = useSermons();

  const upcoming = events
    .filter((e) => new Date(e.start_time) > new Date())
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center p-1 rounded-xl bg-slate-200/60 dark:bg-slate-800/80 max-w-xs">
        <button
          onClick={() => setTab('schedule')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-lg transition-colors ${
            tab === 'schedule' ? 'bg-white dark:bg-slate-900 text-[var(--text-main)]' : 'text-[var(--text-muted)]'
          }`}
        >
          <CalendarDays className="w-4 h-4" /> Schedule
        </button>
        <button
          onClick={() => setTab('sermons')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-lg transition-colors ${
            tab === 'sermons' ? 'bg-white dark:bg-slate-900 text-[var(--text-main)]' : 'text-[var(--text-muted)]'
          }`}
        >
          <Play className="w-4 h-4" /> Sermons
        </button>
      </div>

      {tab === 'schedule' && (
        <div className="space-y-3">
          {eventsLoading ? (
            <p className="text-sm text-[var(--text-muted)]">Loading schedule...</p>
          ) : upcoming.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No upcoming events.</p>
          ) : (
            upcoming.map((e) => (
              <div
                key={e.id}
                className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-4"
              >
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
            ))
          )}
        </div>
      )}

      {tab === 'sermons' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sermonsLoading ? (
            <p className="text-sm text-[var(--text-muted)]">Loading sermons...</p>
          ) : sermons.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No sermons available yet.</p>
          ) : (
            sermons.map((s) => (
              <a
                key={s.id}
                href={s.media_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-4 hover:border-brand-500 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/40 text-brand-600 flex items-center justify-center shrink-0">
                    <Play className="w-4 h-4" />
                  </div>
                  <h3 className="font-medium text-[var(--text-main)] text-sm">{s.title}</h3>
                </div>
                {s.speaker && <p className="text-xs text-[var(--text-muted)]">{s.speaker}</p>}
              </a>
            ))
          )}
        </div>
      )}
    </div>
  );
}