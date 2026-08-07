import { useParams, useNavigate } from 'react-router';
import { useAnnouncements } from '../../hooks/useAnnoucments';
import { formatFullDate } from '../../utils/dateHelpers';
import { ArrowLeft } from 'lucide-react';

export default function AnnouncementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { announcements, loading } = useAnnouncements();
  const navigate = useNavigate();

  const announcement = announcements.find((a) => a.id === id);

  if (loading) return <p className="text-sm text-slate-500">Loading...</p>;
  if (!announcement) return <p className="text-sm text-slate-500">Announcement not found.</p>;

  return (
    <div className="max-w-2xl space-y-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">{announcement.title}</h1>
        <p className="text-xs text-slate-400 mt-1">{formatFullDate(announcement.created_at ?? '')}</p>
        <p className="text-sm text-slate-700 dark:text-slate-300 mt-4 whitespace-pre-wrap">{announcement.content}</p>
      </div>
    </div>
  );
}