import React from 'react';
import { useSchedule } from '../../hooks/useSchedule';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  Users 
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

export default function MemberSchedulePage() {
  const { schedules, loading } = useSchedule();
  const currentDayIndex = new Date().getDay();

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
          <h1 className="text-2xl font-bold text-main tracking-tight">Weekly Schedule</h1>
          <p className="text-muted mt-1 text-sm">
            View upcoming weekly activities, service times, and group gatherings.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
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

              {/* Day Activities List */}
              {items.length === 0 ? (
                <div className="py-4 px-3 text-center rounded-xl border border-dashed border-subtle bg-surface/50">
                  <p className="text-xs text-muted">Nothing scheduled</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {items.map((s) => (
                    <div 
                      key={s.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-surface border border-subtle rounded-xl shadow-sm hover:border-brand-500/30 transition-colors"
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-main">{s.title}</h3>
                          
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
                              <span className="truncate max-w-[160px]">{s.location}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}