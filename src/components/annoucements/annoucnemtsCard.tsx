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
      onClick={() => navigate(`/member/announcements/${id}`)}
      className="group p-4 bg-surface border border-subtle rounded-xl shadow-sm hover:border-brand-500/40 transition-all cursor-pointer space-y-1.5"
    >
      <h3 className="text-base font-semibold text-main group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted line-clamp-2 leading-relaxed">
        {content}
      </p>
      <p className="text-xs font-medium text-muted pt-1">
        Posted {formatRelativeTime(createdAt ?? '')}
      </p>
    </div>
  );
}