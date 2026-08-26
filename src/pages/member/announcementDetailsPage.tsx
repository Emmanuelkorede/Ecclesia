import { useParams, useNavigate } from 'react-router';
import { useAnnouncements } from '../../hooks/useAnnoucments';
import { formatFullDate } from '../../utils/dateHelpers';
import { ArrowLeft } from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';

export default function AnnouncementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { announcements, loading } = useAnnouncements();
  const navigate = useNavigate();

  const announcement = announcements.find((a) => a.id === id);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted">
        <Spinner size="md" className="text-brand-500 mb-3" />
        <p className="text-sm font-medium">Loading announcement...</p>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center rounded-xl border border-dashed border-subtle bg-surface/50">
        <p className="text-sm font-medium text-main">Announcement not found</p>
        <p className="text-xs text-muted mt-1">This announcement may have been removed or does not exist.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-subtle text-main text-xs font-semibold rounded-lg hover:bg-app transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Go back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full space-y-6 animate-in fade-in duration-300 pb-8">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-main transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to announcements
      </button>

      {/* Detail Card */}
      <div className="bg-surface border border-subtle rounded-xl p-6 shadow-sm space-y-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-main tracking-tight">{announcement.title}</h1>
          <p className="text-xs font-medium text-muted">{formatFullDate(announcement.created_at ?? '')}</p>
        </div>
        
        <div className="pt-4 border-t border-subtle">
          <p className="text-sm text-main whitespace-pre-wrap leading-relaxed opacity-90">
            {announcement.content}
          </p>
        </div>
      </div>
    </div>
  );
}