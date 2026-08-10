import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { updateProfile } from '../../services/profileServices';
import { isValidNigerianPhone , normalizeNigerianPhone } from '../../utils/phoneValidation';

export default function ProfileCompletionPage() {
  const { user } = useAuth();
  const { profile, loading, refreshProfile } = useProfile();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill full_name if Google already gave us one (not the 'New User' fallback)
  useEffect(() => {
    if (profile && profile.full_name !== 'New User') {
      setFullName(profile.full_name);
    }
    if (profile?.phone) {
      setPhone(profile.phone);
    }
  }, [profile]);



const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  if (!isValidNigerianPhone(phone)) {
    setError('Please enter a valid Nigerian phone number (e.g. 08122865246).');
    return;
  }
  if (!user) return;

  setSubmitting(true);
  try {
    await updateProfile(user.id, {
      fullName,
      phone: normalizeNigerianPhone(phone), // <-- now saves as +234...
      avatarUrl: profile?.avatar_url ?? undefined,
    });
    await refreshProfile();
    navigate('/choose-path');
  } catch (err: any) {
    setError(err.message ?? 'Failed to save profile.');
  } finally {
    setSubmitting(false);
  }
};
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-app)]">
        <p className="text-[var(--text-muted)]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-app)] px-4">
      <div className="w-full max-w-md bg-[var(--bg-surface)] rounded-2xl shadow-[var(--card-shadow)] p-8">
        <h1 className="text-2xl font-semibold text-[var(--text-main)] mb-1">
          Complete your profile
        </h1>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          Just a couple more details before you continue
        </p>

        {profile?.avatar_url && (
          <div className="flex justify-center mb-4">
            <img
              src={profile.avatar_url}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover border border-[var(--border-subtle)]"
            />
          </div>
        )}

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/40 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
              Full name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Emma Johnson"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
              Phone number
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="08122865246"
            />
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Used for attendance reminders via WhatsApp/SMS
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg py-2.5 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}