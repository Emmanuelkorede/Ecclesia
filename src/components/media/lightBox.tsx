import { useState } from 'react';
import { Play, X } from 'lucide-react';
import VideoEmbed from './videoEmbed';

interface Props {
  url: string;
  thumbnailLabel?: string;
}

export default function VideoLightbox({ url, thumbnailLabel }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative w-full aspect-video bg-black rounded-t-2xl flex items-center justify-center group overflow-hidden"
      >
        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-105 transition-transform">
          <Play className="w-6 h-6 text-slate-900 ml-0.5" fill="currentColor" />
        </div>
        {thumbnailLabel && (
          <span className="absolute bottom-2 left-2 text-xs text-white/80">{thumbnailLabel}</span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="w-full max-w-4xl">
            <VideoEmbed url={url} />
          </div>
        </div>
      )}
    </>
  );
}