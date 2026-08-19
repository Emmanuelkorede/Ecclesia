import { Users, Pencil, Trash2 } from 'lucide-react';

interface Props {
  name: string;
  description: string | null;
  leaderName: string | null;
  memberCount: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function GroupCard({ name, description, leaderName, memberCount, onEdit, onDelete }: Props) {
  return (
    <div className="group bg-surface border border-subtle rounded-xl p-4 shadow-sm hover:border-brand-500/40 transition-colors flex flex-col justify-between gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-main">{name}</h3>
          {description && (
            <p className="text-xs text-muted line-clamp-2">{description}</p>
          )}
        </div>

        {(onEdit || onDelete) && (
          <div className="flex items-center gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-1.5 text-muted hover:text-brand-600 hover:bg-brand-500/10 rounded-md transition-colors cursor-pointer"
                aria-label="Edit group"
                title="Edit group"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1.5 text-muted hover:text-red-600 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer"
                aria-label="Delete group"
                title="Delete group"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs pt-2 border-t border-subtle/60">
        <div className="flex items-center gap-1.5 text-muted">
          <Users className="w-3.5 h-3.5 text-brand-500" />
          {memberCount} {memberCount === 1 ? 'member' : 'members'}
        </div>
        {leaderName && (
          <span className="text-muted">
            Led by <span className="text-main font-medium">{leaderName}</span>
          </span>
        )}
      </div>
    </div>
  );
}