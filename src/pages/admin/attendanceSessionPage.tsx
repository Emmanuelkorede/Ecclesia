import { useState } from 'react';
import CustomEventAttendance from '../../components/attendance/customEventAttendance';
import RecurringAttendance from '../../components/attendance/recurringEventAttendance';
import { CalendarRange, Ticket } from 'lucide-react';

type Tab = 'recurring' | 'custom';

export default function AttendanceSessionPage() {
  const [tab, setTab] = useState<Tab>('recurring');

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-main tracking-tight">Attendance</h1>
        <p className="text-sm text-muted">
          Manage check-ins and live sessions for your programs and one-off events.
        </p>
      </div>

      {/* Modern Segmented Control / Tabs */}
      <div className="inline-flex p-1 bg-surface border border-subtle rounded-xl shadow-sm w-full sm:w-auto">
        <button
          onClick={() => setTab('recurring')}
          className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
            tab === 'recurring'
              ? 'bg-app text-brand-600 shadow-sm border border-subtle/50'
              : 'text-muted hover:text-main hover:bg-app/50 border border-transparent'
          }`}
        >
          <CalendarRange className="w-4 h-4" />
          <span>Recurring Programs</span>
        </button>
        <button
          onClick={() => setTab('custom')}
          className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
            tab === 'custom'
              ? 'bg-app text-brand-600 shadow-sm border border-subtle/50'
              : 'text-muted hover:text-main hover:bg-app/50 border border-transparent'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>Custom Events</span>
        </button>
      </div>

      {/* Render Active Component */}
      <div className="pt-2 animate-in slide-in-from-bottom-2 duration-300 fade-in">
        {tab === 'recurring' ? <RecurringAttendance /> : <CustomEventAttendance />}
      </div>
    </div>
  );
}