interface Props {
  url: string;
}

function parseVideoUrl(url: string) {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId ? { type: 'youtube', embedUrl: `https://www.youtube.com/embed/${videoId}` } : null;
  }

  if (url.includes('vimeo.com')) {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? { type: 'vimeo', embedUrl: `https://player.vimeo.com/video/${match[1]}` } : null;
  }

  if (url.includes('facebook.com')) {
    return { type: 'facebook', embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}` };
  }

  return null;
}

export default function VideoEmbed({ url }: Props) {
  const video = parseVideoUrl(url);

  if (!video) {
    return (
      <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 text-xs rounded-lg">
        Unsupported video link.
      </div>
    );
  }

  return (
    <div className="aspect-video w-full bg-black rounded-xl overflow-hidden">
      <iframe
        className="w-full h-full"
        src={video.embedUrl}
        title="Sermon video"
        style={{ border: 0 }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}