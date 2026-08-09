import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { updateProfile } from '../../services/profileServices';
import { isValidNigerianPhone } from '../../utils/phoneValidation';
import { getInitials, getAvatarColor } from '../../utils/formatters';
import { useNavigate } from 'react-router';
import { LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { profile, loading, refreshProfile } = useProfile();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name);
      setPhone(profile.phone ?? '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!isValidNigerianPhone(phone)) {
      setError('Please enter a valid Nigerian phone number (e.g. 08122865246).');
      return;
    }
    if (!user) return;

    setSaving(true);
    try {
      await updateProfile(user.id, { fullName, phone, avatarUrl: profile?.avatar_url ?? undefined });
      await refreshProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err: any) {
      setError(err.message ?? 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading || !profile) {
    return <p className="text-sm text-slate-500">Loading...</p>;
  }

  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Profile</h1>

      <div className="flex items-center gap-4">
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover" />
        ) : (
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-semibold"
            style={{ backgroundColor: getAvatarColor(profile.full_name) }}
          >
            {getInitials(profile.full_name)}
          </div>
        )}
        <div>
          <p className="font-medium text-slate-900 dark:text-white">{profile.full_name}</p>
          <p className="text-sm text-slate-500">{profile.email}</p>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950/40 rounded-lg px-3 py-2">{error}</div>
      )}
      {success && (
        <div className="text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg px-3 py-2">
          Profile updated successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1">Full name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1">Phone number</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="08122865246"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1">Email</label>
          <input
            type="email"
            disabled
            value={profile.email}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-sm text-slate-400"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg py-2.5 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>

      <button
        onClick={handleSignOut}
        className="w-full flex items-center justify-center gap-2 border border-red-200 dark:border-red-900 text-red-600 font-medium rounded-lg py-2.5 hover:bg-red-50 dark:hover:bg-red-950/30"
      >
        <LogOut className="w-4 h-4" /> Sign out
      </button>
    </div>
  );
}