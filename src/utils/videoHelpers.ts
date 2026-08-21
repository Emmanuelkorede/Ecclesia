export function parseVideoUrl(url: string) {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId ? { type: 'youtube', id: videoId, embedUrl: `https://www.youtube.com/embed/${videoId}` } : null;
  }

  if (url.includes('vimeo.com')) {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? { type: 'vimeo', id: match[1], embedUrl: `https://player.vimeo.com/video/${match[1]}` } : null;
  }

  if (url.includes('facebook.com')) {
    return { type: 'facebook', id: null, embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}` };
  }

  return null;
}