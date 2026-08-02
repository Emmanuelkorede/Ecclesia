import { useNavigate } from 'react-router';
import PublicNavbar from '../../components/layout/publicNavbar';
import { QrCode, Building2, Sparkles, Video } from 'lucide-react';

const features = [
  {
    icon: QrCode,
    title: 'Smart Attendance',
    description: 'Expiring passcodes, dynamic QR codes, and group-restricted check-ins — no more manual roll calls.',
  },
  {
    icon: Building2,
    title: 'Multi-Church Tenant',
    description: 'Switch between branches or organizations effortlessly, all under a single account.',
  },
  {
    icon: Sparkles,
    title: 'AI Absentee Outreach',
    description: 'Automatic missed-service detection with warm, AI-drafted WhatsApp/SMS care messages.',
  },
  {
    icon: Video,
    title: 'Sermon & Media Hub',
    description: 'Embed sermon videos directly from YouTube, Vimeo, or Facebook — no storage costs.',
  },
];

const testimonials = [
  {
    quote: 'We went from paper registers to real-time attendance in one Sunday. Our absentee follow-ups actually happen now.',
    name: 'Pastor Emeka O.',
    role: 'Senior Pastor, Grace Chapel',
  },
  {
    quote: 'Managing Choir and Youth attendance separately used to be a nightmare. Now it takes two taps.',
    name: 'Sis. Adaeze N.',
    role: 'Youth Ministry Lead',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[var(--bg-app)]">
      <PublicNavbar />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-16 pb-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-main)] leading-tight max-w-3xl mx-auto">
          Modern Church Management & Attendance, Automated by AI
        </h1>
        <p className="text-lg text-[var(--text-muted)] mt-5 max-w-xl mx-auto">
          Track attendance, manage ministries, and reconnect with absent members — all from one platform built for growing churches.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <button
            onClick={() => navigate('/auth')}
            className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg px-6 py-3"
          >
            Start Free Trial
          </button>
          <button
            onClick={() => navigate('/pricing')}
            className="w-full sm:w-auto border border-[var(--border-subtle)] text-[var(--text-main)] font-medium rounded-lg px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            View Pricing
          </button>
        </div>

        <div className="mt-14 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-[var(--card-shadow)] p-3 max-w-4xl mx-auto">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-xl aspect-video flex items-center justify-center text-[var(--text-muted)] text-sm">
            Dashboard preview screenshot goes here
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-y border-[var(--border-subtle)] py-6">
        <p className="text-center text-sm text-[var(--text-muted)]">
          Trusted by growing ministries and churches worldwide
        </p>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-4 md:px-6 py-20">
        <h2 className="text-2xl md:text-3xl font-semibold text-[var(--text-main)] text-center mb-12">
          Everything your church needs, in one place
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-[var(--card-shadow)]"
            >
              <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-[var(--text-main)] mb-1.5">{title}</h3>
              <p className="text-sm text-[var(--text-muted)]">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo tour */}
      <section className="bg-[var(--bg-surface)] border-y border-[var(--border-subtle)] py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-[var(--text-main)] text-center mb-4">
            See it in action
          </h2>
          <p className="text-center text-[var(--text-muted)] mb-12 max-w-lg mx-auto">
            From a member's quick check-in to an admin's full attendance report — watch how simple it is.
          </p>
          <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl aspect-video max-w-3xl mx-auto flex items-center justify-center text-[var(--text-muted)] text-sm">
            Interactive product demo goes here
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-20">
        <h2 className="text-2xl md:text-3xl font-semibold text-[var(--text-main)] text-center mb-12">
          Loved by church leaders
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-[var(--card-shadow)]"
            >
              <p className="text-[var(--text-main)] mb-4">"{t.quote}"</p>
              <p className="text-sm font-medium text-[var(--text-main)]">{t.name}</p>
              <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-brand-600 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Ready to modernize your church?
          </h2>
          <button
            onClick={() => navigate('/auth')}
            className="bg-white text-brand-700 font-medium rounded-lg px-6 py-3"
          >
            Start Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] py-10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--text-muted)]">
          <p>© {new Date().getFullYear()} ChMS. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/pricing">Pricing</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}