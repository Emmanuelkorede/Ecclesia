import { useSermons } from '../../hooks/useSermons';
import { formatShortDate } from '../../utils/dateHelpers';
import { Mic, CalendarDays, Video } from 'lucide-react';
import VideoLightbox from '../../components/media/lightBox';
import { Spinner } from '../../components/ui/Spinner';

export default function MemberSermonsPage() {
  const { sermons, loading } = useSermons();

  return (
    <div className="max-w-6xl mx-auto w-full space-y-6 animate-in fade-in duration-300 pb-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-main tracking-tight">Sermons & Messages</h1>
        <p className="text-muted mt-1 text-sm">
          Explore and watch recent teachings, Sunday services, and spiritual messages from our ministry.
        </p>
      </div>

      {/* Sermons Grid / List Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted">
          <Spinner size="md" className="text-brand-500 mb-3" />
          <p className="text-sm font-medium">Loading sermons...</p>
        </div>
      ) : sermons.length === 0 ? (
        <div className="py-16 px-4 text-center rounded-xl border border-dashed border-subtle bg-surface/50">
          <Video className="w-10 h-10 text-muted mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium text-main">No sermons available</p>
          <p className="text-xs text-muted mt-1">Check back soon for new messages and video uploads.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sermons.map((s) => (
            <div 
              key={s.id} 
              className="group flex flex-col bg-surface border border-subtle rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-brand-500/30"
            >
              {/* Media Thumbnail / Lightbox */}
              <div className="w-full shrink-0 border-b border-subtle relative">
                <VideoLightbox url={s.media_url} thumbnailLabel={s.title} />
              </div>
              
              {/* Card Body */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-base font-semibold text-main line-clamp-2 leading-tight mb-3">
                  {s.title}
                </h3>
                
                <div className="space-y-1.5 mt-auto">
                  {s.speaker && (
                    <div className="flex items-center gap-2 text-xs font-medium text-muted">
                      <Mic className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{s.speaker}</span>
                    </div>
                  )}
                  {s.date_preached && (
                    <div className="flex items-center gap-2 text-xs font-medium text-muted">
                      <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                      <span>{formatShortDate(s.date_preached)}</span>
                    </div>
                  )}
                </div>

                {(s.tags ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-subtle">
                    {s.tags!.map((t) => (
                      <span 
                        key={t}
                        className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-brand-soft text-brand-700 dark:text-brand-400 border border-brand-500/20"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}