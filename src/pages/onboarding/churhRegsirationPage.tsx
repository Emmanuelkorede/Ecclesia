import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { useActiveOrg } from '../../hooks/useActiveOrg';
import { createOrg } from '../../services/orgService';
import { generateSlug, generateChurchCode } from '../../utils/orgHelpers';

import { Logo } from '../../components/ui/Logo';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { Spinner } from '../../components/ui/Spinner';
import { Building2, MapPin, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

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

      await refreshMemberships();

      navigate('/admin/dashboard', { replace: true });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create church. Please try again.';
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
        
        {/* Widened, Breathable Card */}
        <div className="w-full max-w-md bg-surface border border-subtle rounded-3xl p-8 sm:p-10 shadow-xl transition-all">
          
          {/* Header & Branding */}
          <div className="flex flex-col items-center text-center mb-8">
            <Logo className="h-10 w-auto text-brand-600 dark:text-brand-500 mb-5" />
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-soft text-brand-600 text-xs font-semibold mb-4">
              <Building2 className="w-4 h-4" />
              <span>Admin Setup</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight mb-2 text-main">
              Register your church
            </h1>
            <p className="text-sm text-muted">
              We'll generate your unique church code automatically.
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
                Church Name
              </label>
              <div className="relative flex items-center">
                <Building2 className="absolute left-4 w-5 h-5 text-muted pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Grace Chapel Lagos"
                  className="w-full pl-12 pr-4 py-3 text-base bg-app border border-subtle rounded-xl text-main placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                Address <span className="normal-case font-normal text-slate-400 ml-1">(optional)</span>
              </label>
              <div className="relative flex items-center">
                <MapPin className="absolute left-4 w-5 h-5 text-muted pointer-events-none" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="12 Adeola Odeku, Victoria Island"
                  className="w-full pl-12 pr-4 py-3 text-base bg-app border border-subtle rounded-xl text-main placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 pt-2 pb-2 py-3 px-4 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-base font-semibold rounded-xl shadow-md shadow-brand-600/20 transition-all disabled:opacity-70 cursor-pointer mt-2"
            >
              {submitting ? (
                <>
                  <Spinner size="sm" className="text-white" />
                  <span>Creating church...</span>
                </>
              ) : (
                <>
                  <span>Create church</span>
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