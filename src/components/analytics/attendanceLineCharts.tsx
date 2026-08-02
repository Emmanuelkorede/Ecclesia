import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatShortDate } from '../../utils/dateHelpers';
import {type  AttendanceTrendPoint } from '../../services/analytics';

interface Props {
  data: AttendanceTrendPoint[];
}

export default function AttendanceLineChart({ data }: Props) {
  if (data.length === 0) {
    return <p className="text-sm text-[var(--text-muted)] py-8 text-center">No attendance data yet.</p>;
  }

  const chartData = data.map((d) => ({
    name: formatShortDate(d.eventDate),
    attendees: d.attendeeCount,
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
          <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
          <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 8,
              color: 'var(--text-main)',
            }}
          />
          <Line type="monotone" dataKey="attendees" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}