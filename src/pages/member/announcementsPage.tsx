import { useAnnouncements } from '../../hooks/useAnnouncements';
import AnnouncementCard from '../../components/announcements/announcementsCard';
import { Megaphone } from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';

export default function MemberAnnouncementsPage() {
  const { announcements, loading } = useAnnouncements();

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6 animate-in fade-in duration-300 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-main tracking-tight">Announcements</h1>
        <p className="text-muted mt-1 text-sm">
          Stay up to date with the latest news, updates, and community notices.
        </p>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted">
          <Spinner size="md" className="text-brand-500 mb-3" />
          <p className="text-sm font-medium">Loading announcements...</p>
        </div>
      ) : announcements.length === 0 ? (
        <div className="py-16 px-4 text-center rounded-xl border border-dashed border-subtle bg-surface/50">
          <Megaphone className="w-10 h-10 text-muted mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium text-main">No announcements yet</p>
          <p className="text-xs text-muted mt-1">Check back later for important ministry updates.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <AnnouncementCard 
              key={a.id} 
              id={a.id} 
              title={a.title} 
              content={a.content} 
              createdAt={a.created_at} 
            />
          ))}
        </div>
      )}
    </div>
  );
}