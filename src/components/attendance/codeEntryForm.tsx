import { useState } from 'react';
import { useCheckIn } from '../../hooks/useCheckin';

interface Props {
  onSuccess?: () => void;
}

export default function CodeEntryForm({ onSuccess }: Props) {
  const { checkInWithCode, submitting, error } = useCheckIn();
  const [code, setCode] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await checkInWithCode(code.trim());
      setSuccess(true);
      onSuccess?.();
    } catch {
      // error already captured by the hook
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <p className="text-lg font-semibold text-[var(--text-main)]">You're checked in! ✅</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
          Enter attendance code
        </label>
        <input
          type="text"
          required
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={6}
          className="w-full text-center text-2xl font-mono tracking-widest rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-3 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="000000"
        />
      </div>

      {error && <p className="text-sm text-red-600 text-center">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg py-2.5 transition-colors disabled:opacity-50"
      >
        {submitting ? 'Checking in...' : 'Check In'}
      </button>
    </form>
  );
}