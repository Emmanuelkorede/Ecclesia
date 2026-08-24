import { useState } from 'react';
import CustomEventAttendance from '../../components/attendance/customEventAttendance';
import RecurringAttendance from '../../components/attendance/recurrringEventAttendance';

type Tab = 'custom' | 'recurring';

export default function AttendanceSessionPage() {
  const [tab, setTab] = useState<Tab>('recurring');

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Attendance Session</h1>

      <div className="flex items-center p-1 rounded-xl bg-slate-200/60 dark:bg-slate-800/80 max-w-xs">
        <button
          onClick={() => setTab('recurring')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg ${tab === 'recurring' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white' : 'text-slate-500'}`}
        >
          Recurring Program
        </button>
        <button
          onClick={() => setTab('custom')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg ${tab === 'custom' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white' : 'text-slate-500'}`}
        >
          Custom Event
        </button>
      </div>

      {tab === 'recurring' ? <RecurringAttendance /> : <CustomEventAttendance />}
    </div>
  );
}