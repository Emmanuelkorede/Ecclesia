import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatShortDate } from '../../utils/dateHelpers';
import type { AttendanceTrendPoint } from '../../services/analytics';
import { canUsePdfExport, canUseCsvExport, getEffectivePlanForLimits } from '../../utils/planLimits';
import { useSubscription } from '../../hooks/useSubscirptionservcies';

interface Props {
  data: AttendanceTrendPoint[];
  orgName: string;
}

export default function ExportButtons({ data, orgName }: Props) {
  const { currentPlan, isExpired } = useSubscription();
  const effectivePlan = getEffectivePlanForLimits(currentPlan, isExpired);

  const exportCsv = () => {
    const header = 'Label,Date,Attendees\n';
    const rows = data.map((d) => `"${d.label}",${formatShortDate(d.date)},${d.attendeeCount}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${orgName}-attendance.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    const doc = new jsPDF();
    doc.text(`${orgName} — Attendance Report`, 14, 16);
    autoTable(doc, {
      startY: 24,
      head: [['Label', 'Date', 'Attendees']],
      body: data.map((d) => [d.label, formatShortDate(d.date), d.attendeeCount.toString()]),
    });
    doc.save(`${orgName}-attendance.pdf`);
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={exportCsv}
        disabled={!canUseCsvExport(effectivePlan)}
        className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--border-subtle)] text-[var(--text-main)] hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
        title={!canUseCsvExport(effectivePlan) ? 'Upgrade your plan to export CSV' : undefined}
      >
        Export CSV
      </button>
      <button
        onClick={exportPdf}
        disabled={!canUsePdfExport(effectivePlan)}
        className="px-4 py-2 text-sm font-medium rounded-lg bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-40 disabled:cursor-not-allowed"
        title={!canUsePdfExport(effectivePlan) ? 'Upgrade your plan to export PDF' : undefined}
      >
        Export PDF
      </button>
    </div>
  );
}