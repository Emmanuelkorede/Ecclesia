import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatShortDate } from '../../utils/dateHelpers';
import type { AttendanceTrendPoint } from '../../services/analytics';

interface Props {
  data: AttendanceTrendPoint[];
}

export default function AttendanceLineChart({ data }: Props) {
  if (!data || data.length === 0) {
    return <p className="text-sm text-slate-500 py-8 text-center">No attendance data yet.</p>;
  }

  const chartData = data.map((d) => ({
    name: formatShortDate(d.date),
    attendees: d.attendeeCount,
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              color: '#0f172a',
            }}
          />
          <Line type="monotone" dataKey="attendees" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}