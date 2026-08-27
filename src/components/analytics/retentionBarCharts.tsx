import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { GroupBreakdown } from '../../services/analytics';

interface Props {
  data: GroupBreakdown[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-subtle shadow-md rounded-lg p-2.5 text-xs space-y-1">
        <p className="font-semibold text-main">{label}</p>
        <p className="text-muted flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
          <span>Attendees:</span>
          <span className="font-bold text-main">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function RetentionBarChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-xs text-muted border border-dashed border-subtle rounded-xl">
        No group activity recorded yet.
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: d.groupName,
    attendees: d.attendeeCount,
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="var(--text)" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
            dy={8}
          />
          <YAxis 
            stroke="var(--text)" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
            allowDecimals={false} 
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ fill: 'var(--accent-soft)', opacity: 0.3 }} 
          />
          <Bar 
            dataKey="attendees" 
            fill="var(--accent)" 
            radius={[6, 6, 0, 0]} 
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}