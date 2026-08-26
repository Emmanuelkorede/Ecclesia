import { useSchedule } from '../../hooks/useSchedule';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function MemberSchedulePage() {
  const { schedules, loading } = useSchedule();

  const grouped = DAYS.map((day, i) => ({ day, items: schedules.filter((s) => s.day_of_week === i) }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Weekly Schedule</h1>

      {loading ? (
        <p className="text-sm text-slate-500">Loading schedule...</p>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
          {grouped.map(({ day, items }) => (
            <div key={day} className="border-b border-slate-200 dark:border-slate-700 last:border-0">
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 text-sm font-semibold text-slate-700 dark:text-slate-300">
                {day}
              </div>
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
      )}
    </div>
  );
}