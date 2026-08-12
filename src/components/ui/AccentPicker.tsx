import React from 'react';
import { Check } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import {type AccentColor } from '../../context/ThemeContext';

interface AccentOption {
  id: AccentColor;
  label: string;
  bgClass: string;
}

const accentOptions: AccentOption[] = [
  { id: 'purple', label: 'Purple', bgClass: 'bg-purple-500' },
  { id: 'indigo', label: 'Indigo', bgClass: 'bg-indigo-500' },
  { id: 'blue', label: 'Blue', bgClass: 'bg-blue-500' },
  { id: 'emerald', label: 'Emerald', bgClass: 'bg-emerald-500' },
  { id: 'amber', label: 'Amber', bgClass: 'bg-amber-500' },
  { id: 'rose', label: 'Rose', bgClass: 'bg-rose-500' },
];

export const AccentPicker: React.FC = () => {
  const { accent, setAccent } = useTheme();

  return (
    <div className="flex flex-col gap-2 align-left text-left">
      <label className="text-xs font-semibold text-muted uppercase tracking-wider">
        Theme Accent Color
      </label>
      <div className="flex items-center gap-3 flex-wrap">
        {accentOptions.map((opt) => {
          const isActive = accent === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setAccent(opt.id)}
              className={`group relative flex items-center justify-center w-8 h-8 rounded-full ${opt.bgClass} transition-transform active:scale-95 cursor-pointer ring-offset-2 ring-offset-surface focus:outline-none ${
                isActive ? 'ring-2 ring-brand-600 scale-110' : 'hover:scale-105'
              }`}
              title={opt.label}
            >
              {isActive && <Check className="w-4 h-4 text-white" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};