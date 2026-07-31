import { useState, useEffect } from 'react';
import { formatCountdown, getTimeUntil } from '../../utils/dateHelpers';

interface Props {
  expiresAt: string;
  onExpire?: () => void;
}

export default function SessionCountdown({ expiresAt, onExpire }: Props) {
  const [display, setDisplay] = useState(() => formatCountdown(expiresAt));

  useEffect(() => {
    const interval = setInterval(() => {
      const { isExpired } = getTimeUntil(expiresAt);
      setDisplay(formatCountdown(expiresAt));
      if (isExpired) {
        clearInterval(interval);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const isUrgent = getTimeUntil(expiresAt).minutes < 2;

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-2xl font-bold ${
        isUrgent ? 'bg-red-50 text-red-600 dark:bg-red-950/40' : 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
      }`}
    >
      {display}
    </div>
  );
}