// Human-friendly "time left" for the attendance session countdown
export function getTimeUntil(expiresAt: string): { minutes: number; seconds: number; isExpired: boolean } {
  const diffMs = new Date(expiresAt).getTime() - Date.now();
  if (diffMs <= 0) return { minutes: 0, seconds: 0, isExpired: true };

  const totalSeconds = Math.floor(diffMs / 1000);
  return {
    minutes: Math.floor(totalSeconds / 60),
    seconds: totalSeconds % 60,
    isExpired: false,
  };
}

// "MM:SS" display format for SessionCountdown component
export function formatCountdown(expiresAt: string): string {
  const { minutes, seconds, isExpired } = getTimeUntil(expiresAt);
  if (isExpired) return '00:00';
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// "Sunday, 26 July 2026" — used on event cards, sermon dates, etc.
export function formatFullDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-NG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// "9:00 AM" — used alongside event start/end times
export function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-NG', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// "26 Jul 2026" — compact form for tables
export function formatShortDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Used by the AI Outreach absentee-detection query: "has this member missed
// the last 3 mandatory events?" — returns a cutoff ISO string N days back
export function getDateDaysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

// Relative time like "2 hours ago" / "3 days ago" — for notifications/announcements
export function formatRelativeTime(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatShortDate(isoString);
}