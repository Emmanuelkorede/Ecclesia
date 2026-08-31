import { useState, useEffect, useRef, type ChangeEvent, type SyntheticEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { updateProfile, uploadAvatar } from '../../services/profileServices';
import { getInitials, getAvatarColor } from '../../utils/formatters';
import { useNavigate } from 'react-router';
import { LogOut, Bell, CheckCircle2, AlertCircle, Camera, User, Phone, Mail, Palette, UserCheck } from 'lucide-react';
import { isValidNigerianPhone, normalizeNigerianPhone, denormalizeNigerianPhone } from '../../utils/phoneValidation';
import { Spinner } from '../../components/ui/Spinner';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { AccentPicker } from '../../components/ui/AccentPicker';
import OneSignal from 'react-onesignal';

const enableNotifications = async () => {
  await OneSignal.Notifications.requestPermission();
};

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { profile, loading, refreshProfile } = useProfile();
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name);
      setPhone(profile.phone ? denormalizeNigerianPhone(profile.phone) : '');
    }
  }, [profile]);

  const handleAvatarSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be under 2MB.');
      return;
    }

    setError(null);
    setUploadingAvatar(true);
    try {
      await uploadAvatar(user.id, file);
      await refreshProfile();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Avatar upload failed.';
      setError(message);
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!user) return;

    if (!isValidNigerianPhone(phone)) {
      setError('Please enter a valid Nigerian phone number (e.g. 08122865246).');
      return;
    }

    setSaving(true);
    try {
      await updateProfile(user.id, {
        fullName,
        phone: normalizeNigerianPhone(phone),
        avatarUrl: profile?.avatar_url ?? undefined,
      });
      await refreshProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update profile.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading || !profile) {
    return (
      <div className="max-w-5xl mx-auto w-full animate-in fade-in duration-300">
        <div className="flex flex-col items-center justify-center py-16 bg-surface border border-subtle rounded-xl text-muted shadow-sm">
          <Spinner size="md" className="text-brand-500 mb-3" />
          <p className="text-xs font-medium">Loading profile details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6 animate-in fade-in duration-300 pb-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-main tracking-tight">Account Profile</h1>
        <p className="text-muted mt-1 text-sm">
          Manage your personal information, workspace appearance, and account preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Avatar & Personal Details Form */}
        <div className="space-y-6">
          {/* Avatar Section Card */}
          <div className="bg-surface border border-subtle rounded-xl shadow-sm p-5 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group shrink-0">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-subtle shadow-sm"
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm border-2 border-subtle"
                  style={{ backgroundColor: getAvatarColor(profile.full_name) }}
                >
                  {getInitials(profile.full_name)}
                </div>
              )}

              {uploadingAvatar && (
                <div className="absolute inset-0 bg-surface/80 rounded-full flex items-center justify-center backdrop-blur-xs">
                  <Spinner size="sm" className="text-brand-500" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2 min-w-0">
              <div>
                <h2 className="text-base font-bold text-main truncate">{profile.full_name}</h2>
                <p className="text-xs text-muted truncate">{profile.email}</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarSelect}
                id="avatar-upload"
                disabled={uploadingAvatar}
                hidden
              />

              <label
                htmlFor="avatar-upload"
                className={`inline-flex items-center gap-2 px-3 py-1.5 bg-app border border-subtle hover:bg-surface text-main text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer ${
                  uploadingAvatar ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <Camera className="w-3.5 h-3.5 text-brand-500" />
                <span>{uploadingAvatar ? 'Uploading...' : 'Change photo'}</span>
              </label>
            </div>
          </div>

          {/* Personal Details Form */}
          <div className="bg-surface border border-subtle rounded-xl shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-3 border-b border-subtle pb-4">
              <div className="w-9 h-9 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center shrink-0 border border-brand-500/20">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-main leading-tight">Personal Details</h2>
                <p className="text-xs text-muted mt-0.5">Update your contact details and account name</p>
              </div>
            </div>

            <div className="space-y-4">
              {error && (
                <div className="flex items-center gap-2.5 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-medium animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-medium animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Profile updated successfully.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="full-name" className="text-xs font-semibold text-main block">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="full-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-app border border-subtle rounded-lg text-xs text-main placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="phone-number" className="text-xs font-semibold text-main block">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      id="phone-number"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="08122865246"
                      className="w-full pl-9 pr-3 py-2 bg-app border border-subtle rounded-lg text-xs text-main placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-main block">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted opacity-60">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      disabled
                      value={profile.email}
                      className="w-full pl-9 pr-3 py-2 bg-app/50 border border-subtle rounded-lg text-xs text-muted cursor-not-allowed opacity-75"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Spinner size="sm" className="text-white" />
                        <span>Saving changes...</span>
                      </>
                    ) : (
                      <span>Save changes</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Appearance & Account Options */}
        <div className="space-y-6">
          {/* Appearance Card */}
<div className="bg-surface border border-subtle rounded-xl shadow-sm p-5 space-y-4">
  <div className="flex items-center gap-3 border-b border-subtle pb-4">
    <div className="w-9 h-9 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center shrink-0 border border-brand-500/20">
      <Palette className="w-5 h-5" />
    </div>
    <div>
      <h2 className="text-base font-semibold text-main leading-tight">Appearance</h2>
      <p className="text-xs text-muted mt-0.5">Customize your workspace look and theme</p>
    </div>
  </div>

  <div className="space-y-5">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 items-start">
      <label className="text-xs font-semibold text-main">
        Interface Theme
      </label>
      <ThemeToggle />
    </div>

    <div className="h-px bg-subtle" />

    <div className="space-y-2">
      <AccentPicker />
    </div>
  </div>
</div>

          {/* Account Options Card */}
          <div className="bg-surface border border-subtle rounded-xl shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-3 border-b border-subtle pb-4">
              <div className="w-9 h-9 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center shrink-0 border border-brand-500/20">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-main leading-tight">Account Options</h2>
                <p className="text-xs text-muted mt-0.5">Manage notifications and active sessions</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={enableNotifications}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-app hover:bg-surface border border-subtle text-main text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer"
              >
                <Bell className="w-4 h-4 text-brand-500" />
                <span>Enable Push Notifications</span>
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-lg transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}