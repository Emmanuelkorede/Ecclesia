import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { useActiveOrg } from '../../hooks/useActiveOrg';
import { getOrgByCode } from '../../services/orgService';
import { supabase } from '../../lib/supabase';

import { Logo } from '../../components/ui/Logo';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { Spinner } from '../../components/ui/Spinner';
import { KeyRound, AlertCircle, ArrowRight, ArrowLeft, UserPlus } from 'lucide-react';

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

      const { error: membershipError } = await supabase.from('memberships').insert({
        user_id: user.id,
        org_id: org.id,
        role: 'member',
        status: 'active',
      });

      if (membershipError) throw membershipError;

      await refreshMemberships();

      navigate('/member/dashboard', { replace: true });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join church. Please try again.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-app text-main transition-colors duration-200 relative">
      
      {/* Top Navigation Bar */}
      <header className="w-full flex items-center justify-between p-4 sm:p-6 max-w-6xl mx-auto z-10">
        <button
          type="button"
          onClick={() => navigate('/choose-path')}
          className="flex items-center gap-2 text-sm font-semibold text-muted hover:text-main transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <ThemeToggle />
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 w-full my-auto">
        
        {/* Widened, more breathable Card */}
        <div className="w-full max-w-md bg-surface border border-subtle rounded-3xl p-8 sm:p-10 shadow-xl transition-all">
          
          {/* Header & Branding */}
          <div className="flex flex-col items-center text-center mb-8">
            <Logo className="h-10 w-auto text-brand-600 dark:text-brand-500 mb-5" />
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-soft text-brand-600 text-xs font-semibold mb-4">
              <UserPlus className="w-4 h-4" />
              <span>Member Access</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight mb-2 text-main">
              Join your church
            </h1>
            <p className="text-sm text-muted">
              Enter the unique church code provided by your administrator.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-start gap-3 p-4 mb-6 text-sm rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
              <span className="leading-snug">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                Church Code
              </label>
              <div className="relative flex items-center">
                <KeyRound className="absolute left-4 w-5 h-5 text-muted pointer-events-none" />
                <input
                  type="text"
                  required
                  value={churchCode}
                  onChange={(e) => setChurchCode(e.target.value)}
                  placeholder="CH-4F2A"
                  className="w-full pl-12 pr-4 py-3 text-base bg-app border border-subtle rounded-xl text-main placeholder:text-slate-400 font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 pt-2 pb-2 py-3 px-4 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-base font-semibold rounded-xl shadow-md shadow-brand-600/20 transition-all disabled:opacity-70 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Spinner size="sm" className="text-white" />
                  <span>Joining...</span>
                </>
              ) : (
                <>
                  <span>Join church</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

    </div>
  );
}