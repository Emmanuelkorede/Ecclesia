import { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface Props {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[]; // e.g. ['Choir', 'Usher', 'Media Team']
}

export default function MemberTagPicker({ tags, onChange, suggestions = [] }: Props) {
  const [input, setInput] = useState('');

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    onChange([...tags, trimmed]);
    setInput('');
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const unusedSuggestions = suggestions.filter((s) => !tags.includes(s));

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 text-xs font-medium px-2.5 py-1 rounded-full"
          >
            {tag}
            <button onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag(input);
            }
          }}
          placeholder="Add a tag..."
          className="flex-1 rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-1.5 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          onClick={() => addTag(input)}
          className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {unusedSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {unusedSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => addTag(s)}
              className="text-xs text-[var(--text-muted)] border border-dashed border-[var(--border-subtle)] px-2 py-0.5 rounded-full hover:border-brand-500 hover:text-brand-600"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}