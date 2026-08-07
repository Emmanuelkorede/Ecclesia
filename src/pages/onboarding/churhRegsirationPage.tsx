import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { useActiveOrg } from '../../hooks/useActiveOrg';
import { createOrg } from '../../services/orgService';
import { generateSlug, generateChurchCode } from '../../utils/orgHelpers';

export default function ChurchRegistrationPage() {
  const { user } = useAuth();
  const { refreshMemberships } = useActiveOrg();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError('You must be logged in.');
      return;
    }

    setSubmitting(true);
    try {
      const slug = generateSlug(name);
      const churchCode = generateChurchCode();

      await createOrg(
        { name, churchCode, slug, address: address || undefined },
        user.id
      );

      // refreshMemberships re-pulls memberships + sets the new org as active,
      // since it's the only membership this user now has (or the newest one)
      await refreshMemberships();

      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message ?? 'Failed to create church. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-app)] px-4">
      <div className="w-full max-w-md bg-[var(--bg-surface)] rounded-2xl shadow-[var(--card-shadow)] p-8">
        <h1 className="text-2xl font-semibold text-[var(--text-main)] mb-1">Register your church</h1>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          We'll generate your unique church code automatically
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/40 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
              Church name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Grace Chapel Lagos"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
              Address <span className="text-[var(--text-muted)]">(optional)</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="12 Adeola Odeku, Victoria Island"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg py-2.5 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Creating church...' : 'Create church'}
          </button>
        </form>
      </div>
    </div>
  );
}