import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';import type { GroupBreakdown } from '../../services/analytics';

interface Props {
  data: GroupBreakdown[];
}

export default function RetentionBarChart({ data }: Props) {
  if (data.length === 0) {
    return <p className="text-sm text-[var(--text-muted)] py-8 text-center">No group activity yet.</p>;
  }

  const chartData = data.map((d) => ({ name: d.groupName, attendees: d.attendeeCount }));
  console.log('chartData:', chartData);

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
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
          <Bar dataKey="attendees" fill="#10b981" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}