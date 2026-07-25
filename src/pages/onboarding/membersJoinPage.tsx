import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useActiveOrg } from '../../hooks/useActiveOrg';
import { getOrgByCode } from '../../services/orgService';
import { supabase } from '../../lib/supabase';

export default function MemberJoinPage() {
  const { user } = useAuth();
  const { refreshMemberships } = useActiveOrg();
  const navigate = useNavigate();

  const [churchCode, setChurchCode] = useState('');
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
      const org = await getOrgByCode(churchCode.trim().toUpperCase());

      if (!org) {
        setError('No church found with that code. Please check and try again.');
        setSubmitting(false);
        return;
      }

      // Create the membership directly here — this is a one-off action
      // used only on this page, so it doesn't need its own service file yet.
      // If you later reuse this insert logic elsewhere, move it into
      // membershipService.ts.
      const { error: membershipError } = await supabase.from('memberships').insert({
        user_id: user.id,
        org_id: org.id,
        role: 'member',
        status: 'active',
      });

      if (membershipError) throw membershipError;

      await refreshMemberships();
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message ?? 'Failed to join church. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-app)] px-4">
      <div className="w-full max-w-md bg-[var(--bg-surface)] rounded-2xl shadow-[var(--card-shadow)] p-8">
        <h1 className="text-2xl font-semibold text-[var(--text-main)] mb-1">Join your church</h1>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          Enter the church code you were given
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/40 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
              Church code
            </label>
            <input
              type="text"
              required
              value={churchCode}
              onChange={(e) => setChurchCode(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-[var(--text-main)] uppercase focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="CH-4F2A"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg py-2.5 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Joining...' : 'Join church'}
          </button>
        </form>
      </div>
    </div>
  );
}