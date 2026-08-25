import { formatRelativeTime } from '../../utils/dateHelpers';
import { useNavigate } from 'react-router';

interface Props {
  id: string;
  title: string;
  content: string;
  createdAt: string | null;
}

export default function AnnouncementCard({ id, title, content, createdAt }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="border-t border-slate-200 dark:border-slate-700 pt-3 first:border-0 first:pt-0 cursor-pointer"
      onClick={() => navigate(`/member/announcements/${id}`)}
    >
      <p className="text-sm font-medium text-slate-900 dark:text-white">{title}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{content}</p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{formatRelativeTime(createdAt ?? '')}</p>
    </div>
  );
}