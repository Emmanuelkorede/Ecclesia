import { useAnnouncements } from '../../hooks/useAnnoucments';
import AnnouncementCard from '../../components/annoucements/annoucnemtsCard';

export default function MemberAnnouncementsPage() {
  const { announcements, loading } = useAnnouncements();

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Announcements</h1>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : announcements.length === 0 ? (
          <p className="text-sm text-slate-500">No announcements yet.</p>
        ) : (
          <div className="space-y-3">
            {announcements.map((a) => (
              <AnnouncementCard key={a.id} id={a.id} title={a.title} content={a.content} createdAt={a.created_at} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}