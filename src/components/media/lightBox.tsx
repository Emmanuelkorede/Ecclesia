import { useState, useEffect } from 'react';
import { Play, X, Video } from 'lucide-react';
import VideoEmbed from './videoEmbed';
import {parseVideoUrl } from '../../utils/videoHelpers';


interface Props {
  url: string;
  thumbnailLabel?: string;
}

export default function VideoLightbox({ url, thumbnailLabel }: Props) {
  const [open, setOpen] = useState(false);
  const video = parseVideoUrl(url);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative block w-full aspect-video group bg-surface cursor-pointer overflow-hidden border-0 p-0"
      >
        {/* Thumbnail Background */}
        {video?.type === 'youtube' && video.id ? (
          <img
            src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
            alt={thumbnailLabel || "Video thumbnail"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-600/20 to-brand-800/10 dark:from-brand-600/10 dark:to-brand-800/5 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
            <Video className="w-12 h-12 text-brand-500/40" />
          </div>
        )}

        {/* Hover / Overlay Gradient */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
        
        {/* Play Button Icon (Glassmorphic) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-brand-600 group-hover:border-brand-500 transition-all duration-300 shadow-lg group-hover:scale-110">
            <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
          </div>
        </div>

        {/* Optional Overlaid Label */}
        {thumbnailLabel && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 text-left">
            <span className="text-white text-xs font-semibold line-clamp-1">{thumbnailLabel}</span>
          </div>
        )}
      </button>

      {/* Cinematic Modal */}
      {open && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
          
          <div className="absolute top-0 inset-x-0 p-4 flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close video"
              className="p-2 text-white/70 hover:text-white bg-black/50 hover:bg-black rounded-full transition-all cursor-pointer backdrop-blur-sm"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Theater View Container */}
          <div className="w-full max-w-5xl px-4 animate-in zoom-in-95 duration-300">
            <VideoEmbed url={url} />
          </div>
          
          {/* Click away area to close */}
          <div 
            className="absolute inset-0 -z-10 cursor-pointer" 
            onClick={() => setOpen(false)} 
          />
        </div>
      )}
    </>
  );
}