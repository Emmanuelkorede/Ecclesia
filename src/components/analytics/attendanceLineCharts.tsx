import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatShortDate } from '../../utils/dateHelpers';
import type { AttendanceTrendPoint } from '../../services/analytics';

interface Props {
  data: AttendanceTrendPoint[];
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

export default function AttendanceLineChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-xs text-muted border border-dashed border-subtle rounded-xl">
        No attendance data recorded yet.
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: formatShortDate(d.date),
    attendees: d.attendeeCount,
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="attendees"
            stroke="var(--accent)"
            strokeWidth={2.5}
            dot={{ r: 4, fill: 'var(--surface)', stroke: 'var(--accent)', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: 'var(--accent)' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}