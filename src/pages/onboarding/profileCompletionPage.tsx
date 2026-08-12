import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { updateProfile } from '../../services/profileServices';
import { isValidNigerianPhone, normalizeNigerianPhone } from '../../utils/phoneValidation';

import { Logo } from '../../components/ui/Logo';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { Spinner } from '../../components/ui/Spinner';
import { BrandLoader } from '../../components/ui/BrandLoader';
import { User, Phone, AlertCircle, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ProfileCompletionPage() {
  const { user } = useAuth();
  const { profile, loading, refreshProfile } = useProfile();
  const navigate = useNavigate();

  // Initialize state directly from profile data
  const [fullName, setFullName] = useState(
    profile && profile.full_name !== 'New User' ? profile.full_name : ''
  );
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Sync state when profile finishes initial fetch
  useEffect(() => {
    if (profile) {
      if (profile.full_name && profile.full_name !== 'New User' && !fullName) {
        setFullName(profile.full_name);
      }
      if (profile.phone && !phone) {
        setPhone(profile.phone);
      }
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
        phone: normalizeNigerianPhone(phone),
        avatarUrl: profile?.avatar_url ?? undefined,
      });
      await refreshProfile();
      navigate('/choose-path');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save profile.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Full-Screen loader for initial profile state fetching
  if (loading) {
    return <BrandLoader fullScreen message="Preparing your setup..." />;
  }

  return (
    <div key={profile?.id ?? 'loading'} className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-app text-main transition-colors duration-200 relative">
      
      {/* Top Navigation Bar: Theme Toggle */}
      <div className="w-full flex justify-end p-4 lg:p-6 absolute top-0 right-0 z-10">
        <ThemeToggle />
      </div>

      {/* Main Content Card */}
      <div className="w-full max-w-sm bg-surface border border-subtle rounded-2xl p-6 sm:p-8 shadow-xl transition-all my-auto">
        
        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <Logo className="h-8 w-auto text-brand-600 dark:text-brand-500 mb-4" />
          
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-soft text-brand-600 text-[11px] font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Profile Setup</span>
          </div>

          <h1 className="text-xl font-bold tracking-tight mb-1 text-main">
            Complete your profile
          </h1>
          <p className="text-xs text-muted">
            Just a couple more details before you continue
          </p>
        </div>

        {/* User Avatar Badge (if present) */}
        {profile?.avatar_url && (
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover ring-2 ring-brand-500/30 border-2 border-surface shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 bg-brand-600 text-white rounded-full p-1 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-2.5 p-3 mb-5 text-xs rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 w-4 h-4 text-muted pointer-events-none" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Emma Johnson"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-app border border-subtle rounded-xl text-main placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <div className="relative flex items-center">
              <Phone className="absolute left-3.5 w-4 h-4 text-muted pointer-events-none" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08122865246"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-app border border-subtle rounded-xl text-main placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
              />
            </div>
            <p className="text-[11px] text-muted mt-1.5 leading-tight">
              Used for attendance reminders via WhatsApp/SMS
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 mt-2 py-2.5 px-4 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-sm font-semibold rounded-xl shadow-md shadow-brand-600/20 transition-all disabled:opacity-70 cursor-pointer"
          >
            {submitting ? (
              <>
                <Spinner size="sm" className="text-white" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}