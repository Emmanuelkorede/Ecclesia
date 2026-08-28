import { useNavigate } from 'react-router';
import PublicNavbar from '../../components/layout/publicNavbar';
import { QrCode, Building2, Sparkles, Video, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: QrCode,
    title: 'Smart Attendance',
    description: 'Expiring passcodes, dynamic QR codes, and group-restricted check-ins — replacing manual roll calls with precise data.',
  },
  {
    icon: Building2,
    title: 'Multi-Church Tenant',
    description: 'Switch effortlessly between branches or separate organizations under a single unified user account.',
  },
  {
    icon: Sparkles,
    title: 'AI Absentee Outreach',
    description: 'Automatic missed-service detection with warm, AI-drafted follow-up text messages to keep your congregation connected.',
  },
  {
    icon: Video,
    title: 'Sermon & Media Hub',
    description: 'Embed sermon videos directly from YouTube, Vimeo, or Facebook with clean inline playback and zero storage overhead.',
  },
];

const testimonials = [
  {
    quote: 'We went from messy paper registers to real-time attendance tracking in a single Sunday. Our absentee follow-ups actually happen now.',
    name: 'Pastor Emeka O.',
    role: 'Senior Pastor, Grace Chapel',
  },
  {
    quote: 'Managing Choir and Youth ministry attendance separately used to be an administrative nightmare. Now it takes our team two taps.',
    name: 'Sis. Adaeze N.',
    role: 'Youth Ministry Lead',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-200">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-6 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Church Management System</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extxl font-bold text-[var(--text-h)] leading-tight max-w-4xl mx-auto tracking-tight">
          Modern Church Management & Attendance, Automated for Growth
        </h1>
        
        <p className="text-base sm:text-lg text-[var(--text)] mt-6 max-w-2xl mx-auto leading-relaxed">
          Track engagement, manage sub-ministries, and reconnect with absent members — all from a single robust platform built for modern congregations.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-9">
          <button
            onClick={() => navigate('/auth')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold rounded-xl px-7 py-3.5 shadow-lg shadow-brand-600/20 transition-all cursor-pointer"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/pricing')}
            className="w-full sm:w-auto border border-[var(--border)] text-[var(--text-h)] font-semibold rounded-xl px-7 py-3.5 bg-[var(--surface)] hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all cursor-pointer shadow-xs"
          >
            View Naira Pricing
          </button>
        </div>

        {/* Dashboard Preview Slot */}
        <div className="mt-14 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl p-3 max-w-5xl mx-auto">
          <div className="bg-slate-100 dark:bg-[#12141c] rounded-xl aspect-[16/9] flex flex-col items-center justify-center text-[var(--text)] text-sm border border-dashed border-[var(--border)]">
            <div className="p-3 bg-brand-500/10 rounded-2xl text-brand-500 mb-3">
              <Building2 className="w-8 h-8" />
            </div>
            <span className="font-semibold text-[var(--text-h)]">Admin Dashboard Preview</span>
            <span className="text-xs text-[var(--text)] mt-1">Screenshot your live `/dashboard` view here</span>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-y border-[var(--border)] py-8 bg-[var(--surface)]/50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text)]">
            Trusted by growing ministries, campus fellowships, and multi-branch networks
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-6xl mx-auto px-4 md:px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-[var(--text-h)] tracking-tight">
            Everything your church needs, in one place
          </h2>
          <p className="text-[var(--text)] mt-3 text-sm">
            Purpose-built tools designed to eliminate paper spreadsheets and streamline your weekly operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[var(--text-h)] mb-2">{title}</h3>
              <p className="text-sm text-[var(--text)] leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo Tour Section */}
      <section className="bg-[var(--surface)] border-y border-[var(--border)] py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold text-[var(--text-h)] tracking-tight mb-4">
            See it in action
          </h2>
          <p className="text-[var(--text)] mb-12 max-w-lg mx-auto text-sm leading-relaxed">
            From a member's swift QR check-in to an admin's full attendance analytics report — watch how simple ministry management can be.
          </p>
          <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl aspect-[16/9] max-w-4xl mx-auto flex flex-col items-center justify-center text-[var(--text)] text-sm shadow-inner">
            <span className="font-semibold text-[var(--text-h)]">Interactive Attendance Roster Preview</span>
            <span className="text-xs text-[var(--text)] mt-1">Screenshot your live live-roster or check-in session screen here</span>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-24">
        <h2 className="text-3xl font-bold text-[var(--text-h)] text-center mb-16 tracking-tight">
          Loved by church leaders
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-sm flex flex-col justify-between"
            >
              <p className="text-[var(--text-h)] text-base italic mb-6 leading-relaxed">"{t.quote}"</p>
              <div>
                <p className="text-sm font-bold text-[var(--text-h)]">{t.name}</p>
                <p className="text-xs text-[var(--text)] mt-0.5">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-brand-600 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
            Ready to modernize your church operations?
          </h2>
          <p className="text-white/80 text-sm mb-8 max-w-lg mx-auto">
            Join forward-thinking ministries tracking engagement efficiently. No credit card required to start.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="bg-white text-brand-700 hover:bg-slate-100 font-semibold rounded-xl px-8 py-3.5 shadow-lg transition-all cursor-pointer"
          >
            Start Free Trial Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-12 bg-[var(--surface)]">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[var(--text)]">
          <p>© {new Date().getFullYear()} Ecclesia. All rights reserved.</p>
          <div className="flex items-center gap-8 font-medium">
            <a href="/pricing" className="hover:text-[var(--text-h)] transition-colors">Pricing</a>
            <a href="/pricing#faq" className="hover:text-[var(--text-h)] transition-colors">FAQ</a>
            <a href="/contact" className="hover:text-[var(--text-h)] transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}