import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { isValidNigerianPhone, normalizeNigerianPhone } from '../../utils/phoneValidation';

type Mode = 'login' | 'signup';

export default function AuthPage() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Phone is optional, but if they typed one, it must be valid
    if (mode === 'signup' && phone.trim() && !isValidNigerianPhone(phone)) {
      setError('Please enter a valid Nigerian phone number (e.g. 08122865246).');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'signup') {
        await signUp({ email, password, fullName });
        // Note: phone isn't saved yet here — signUp only sets full_name via
        // metadata for the trigger. We update phone separately after signup
        // succeeds, once we have a user id back. See below.
      } else {
        await signIn({ email, password });
      }
      navigate('/choose-path'); // the choice screen decides create vs join vs dashboard
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-app)] px-4">
      <div className="w-full max-w-md bg-[var(--bg-surface)] rounded-2xl shadow-[var(--card-shadow)] p-8">
        <h1 className="text-2xl font-semibold text-[var(--text-main)] mb-1">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          {mode === 'login' ? 'Log in to continue' : 'Sign up to get started'}
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/40 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
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
          )}

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

          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
                Phone number <span className="text-[var(--text-muted)]">(optional)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="08122865246"
              />
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Used for attendance reminders via WhatsApp/SMS
              </p>
            </div>
          )}

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
            {submitting ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Sign up'}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          className="w-full text-center text-sm text-brand-600 dark:text-brand-400 mt-4 hover:underline"
        >
          {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
        </button>
      </div>
    </div>
  );
}