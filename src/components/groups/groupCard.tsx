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
    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 shadow-[var(--card-shadow)]">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-[var(--text-main)]">{name}</h3>
          {description && (
            <p className="text-sm text-[var(--text-muted)] mt-0.5">{description}</p>
          )}
        </div>

        {(onEdit || onDelete) && (
          <div className="flex gap-1 shrink-0">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Edit group"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                aria-label="Delete group"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
          <Users className="w-4 h-4" />
          {memberCount} {memberCount === 1 ? 'member' : 'members'}
        </div>
        {leaderName && (
          <span className="text-[var(--text-muted)]">
            Led by <span className="text-[var(--text-main)] font-medium">{leaderName}</span>
          </span>
        )}
      </div>
    </div>
  );
}