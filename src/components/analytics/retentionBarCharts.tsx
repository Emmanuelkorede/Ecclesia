import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { GroupBreakdown } from '../../services/analytics';

interface Props {
  data: GroupBreakdown[];
}

export default function RetentionBarChart({ data }: Props) {
  if (data.length === 0) {
    return <p className="text-sm text-slate-500 py-8 text-center">No group activity yet.</p>;
  }

  const chartData = data.map((d) => ({ name: d.groupName, attendees: d.attendeeCount }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
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
          <Bar dataKey="attendees" fill="#10b981" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}