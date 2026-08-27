import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatShortDate } from '../../utils/dateHelpers';
import type { AttendanceTrendPoint } from '../../services/analytics';
import { canUsePdfExport, canUseCsvExport, getEffectivePlanForLimits } from '../../utils/planLimits';
import { useSubscription } from '../../hooks/useSubscriptionServices';
import { FileSpreadsheet, FileText } from 'lucide-react';

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
    <div className="flex items-center gap-3">
      <button
        onClick={exportCsv}
        disabled={!canUseCsvExport(effectivePlan)}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-surface border border-subtle text-main hover:bg-app transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        title={!canUseCsvExport(effectivePlan) ? 'Upgrade your plan to export CSV' : undefined}
      >
        <FileSpreadsheet className="w-4 h-4 text-brand-500" />
        <span>Export CSV</span>
      </button>
      <button
        onClick={exportPdf}
        disabled={!canUsePdfExport(effectivePlan)}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        title={!canUsePdfExport(effectivePlan) ? 'Upgrade your plan to export PDF' : undefined}
      >
        <FileText className="w-4 h-4" />
        <span>Export PDF</span>
      </button>
    </div>
  );
}