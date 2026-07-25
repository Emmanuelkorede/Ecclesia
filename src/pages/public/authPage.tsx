import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

type Mode = 'login' | 'signup';

export default function AuthPage() {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'signup') {
        await signUp({ email, password });
      } else {
        await signIn({ email, password });
      }
      // Always land here first — this page decides if profile is complete
      // and forwards to tenant choice if it already is
      navigate('/complete-profile');
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    try {
      await signInWithGoogle();
      // Redirect happens via Supabase OAuth flow — redirectTo is already
      // set to /complete-profile inside authService
    } catch (err: any) {
      setError(err.message ?? 'Google sign-in failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-app)] px-4">
      <div className="w-full max-w-md bg-[var(--bg-surface)] rounded-2xl shadow-[var(--card-shadow)] p-8">
        {/* Tabs */}
        <div className="flex mb-6 rounded-xl bg-slate-200/60 dark:bg-slate-800/80 p-1">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              mode === 'login'
                ? 'bg-white dark:bg-slate-900 text-[var(--text-main)] shadow-xs'
                : 'text-[var(--text-muted)]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              mode === 'signup'
                ? 'bg-white dark:bg-slate-900 text-[var(--text-main)] shadow-xs'
                : 'text-[var(--text-muted)]'
            }`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/40 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg py-2.5 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[var(--border-subtle)]" />
          <span className="text-xs text-[var(--text-muted)]">OR</span>
          <div className="flex-1 h-px bg-[var(--border-subtle)]" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-2 border border-[var(--border-subtle)] rounded-lg py-2.5 text-sm font-medium text-[var(--text-main)] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          {mode === 'login' ? 'Sign In with Google' : 'Sign Up with Google'}
        </button>
      </div>
    </div>
  );
}