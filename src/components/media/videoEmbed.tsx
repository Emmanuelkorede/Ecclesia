import { AlertCircle } from 'lucide-react';
import {parseVideoUrl } from '../../utils/videoHelpers';

interface Props {
  url: string;
}

export default function VideoEmbed({ url }: Props) {
  const video = parseVideoUrl(url);

  if (!video) {
    return (
      <div className="w-full aspect-video bg-surface border border-dashed border-subtle rounded-lg flex flex-col items-center justify-center p-4 text-center text-muted">
        <AlertCircle className="w-6 h-6 mb-2 opacity-50" />
        <p className="text-sm font-medium">Unsupported video format</p>
        <p className="text-xs mt-1">Please provide a valid YouTube, Vimeo, or Facebook link.</p>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative shadow-inner">
      <iframe
        src={video.embedUrl}
        title="Sermon video"
        className="absolute inset-0 w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}