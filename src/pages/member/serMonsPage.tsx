import { useState } from 'react';
import { useSchedule } from '../../hooks/useSchedule';
import { useSermons } from '../../hooks/useSermons';
import VideoEmbed from '../../components/media/videoEmbed';
import { formatShortDate } from '../../utils/dateHelpers';
import { CalendarDays, Play } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
type Tab = 'schedule' | 'sermons';

export default function ScheduleSermonsPage() {
  const [tab, setTab] = useState<Tab>('schedule');
  const { schedules, loading: scheduleLoading } = useSchedule();
  const { sermons, loading: sermonsLoading } = useSermons();

  const grouped = DAYS.map((day, i) => ({ day, items: schedules.filter((s) => s.day_of_week === i) }));

  return (
    <div className="space-y-6">
      <div className="flex items-center p-1 rounded-xl bg-slate-200/60 dark:bg-slate-800/80 max-w-xs">
        <button onClick={() => setTab('schedule')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-lg ${tab === 'schedule' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white' : 'text-slate-500'}`}>
          <CalendarDays className="w-4 h-4" /> Schedule
        </button>
        <button onClick={() => setTab('sermons')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-lg ${tab === 'sermons' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white' : 'text-slate-500'}`}>
          <Play className="w-4 h-4" /> Sermons
        </button>
      </div>

      {tab === 'schedule' && (
        scheduleLoading ? (
          <p className="text-sm text-slate-500">Loading schedule...</p>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            {grouped.map(({ day, items }) => (
              <div key={day} className="border-b border-slate-200 dark:border-slate-700 last:border-0">
                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 text-sm font-semibold text-slate-700 dark:text-slate-300">{day}</div>
                {items.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-slate-400">Nothing scheduled</p>
                ) : (
                  items.map((s) => (
                    <div key={s.id} className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{s.title}</p>
                      <p className="text-xs text-slate-500">
                        {s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}{s.location && ` · ${s.location}`}
                      </p>
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'sermons' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {sermonsLoading ? (
            <p className="text-sm text-slate-500">Loading sermons...</p>
          ) : sermons.length === 0 ? (
            <p className="text-sm text-slate-500">No sermons available yet.</p>
          ) : (
            sermons.map((s) => (
              <div key={s.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                <VideoEmbed url={s.media_url} />
                <div className="p-4">
                  <h3 className="font-medium text-slate-900 dark:text-white text-sm">{s.title}</h3>
                  {s.speaker && <p className="text-xs text-slate-500 mt-1">{s.speaker}</p>}
                  <p className="text-xs text-slate-500">{formatShortDate(s.date_preached ?? '')}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}