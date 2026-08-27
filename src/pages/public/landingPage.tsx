import { useState } from 'react';
import { useNavigate } from 'react-router';
import PublicNavbar from '../../components/layout/publicNavbar';
import { Logo } from '../../components/ui/Logo';
import { 
  QrCode, 
  Building2, 
  Sparkles, 
  Video, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  ShieldCheck, 
  BarChart3, 
  Clock, 
  Smartphone,
  ChevronRight,
  Zap
} from 'lucide-react';

const features = [
  {
    id: 'attendance',
    icon: QrCode,
    title: 'Smart Attendance Engine',
    tagline: 'Passcodes & Dynamic QR',
    description: 'Launch 15-minute expiring passcodes or dynamic QR codes for Sunday service and weekly mid-week meetings.',
    screenshotLabel: 'Active Attendance Session Screen',
    screenshotDesc: 'Live countdown timer, expiring passcode display, real-time check-in ticker, and instant manual override panel.',
    bullets: ['15-minute auto-expiring passcodes', 'Camera-scannable dynamic QR codes', 'Offline & manual admin fallback']
  },
  {
    id: 'outreach',
    icon: Sparkles,
    title: 'AI Absentee Outreach',
    tagline: 'Automated Member Care',
    description: 'Detect missed services automatically and generate personalized, warm care messages ready to send via WhatsApp or SMS.',
    screenshotLabel: 'Absentee Management Drawer',
    screenshotDesc: 'List of members missing 2+ consecutive services with single-click AI WhatsApp draft generation.',
    bullets: ['Automated 2-week absence alerts', 'Context-aware AI draft generator', 'Direct WhatsApp & SMS dispatch']
  },
  {
    id: 'groups',
    icon: Users,
    title: 'Sub-Ministry & Department Tracking',
    tagline: 'Choir, Ushers & Youth',
    description: 'Separate general church attendance from departmental meetings. Track attendance for specific ministries independently.',
    screenshotLabel: 'Group Roster & Attendance View',
    screenshotDesc: 'Departmental dashboard showing Choir and Youth ministry check-in rates and member rosters.',
    bullets: ['Group-restricted check-in codes', 'Departmental leader permissions', 'Targeted group announcements']
  },
  {
    id: 'media',
    icon: Video,
    title: 'Sermon & Media Hub',
    tagline: 'Zero Storage Cost Streaming',
    description: 'Embed sermon videos directly from YouTube, Vimeo, or Facebook Live so your congregation stays connected all week.',
    screenshotLabel: 'Media Library & Sermon Player',
    screenshotDesc: 'Video lightbox display with sermon notes, series tagging, and quick share links for members.',
    bullets: ['Embed from major video platforms', 'Sermon series categorization', 'In-app congregational access']
  }
];

const highlights = [
  {
    icon: Building2,
    title: 'Multi-Tenant Architecture',
    description: 'Manage multiple branches or church plants under one administrative account with isolated data boundaries.'
  },
  {
    icon: ShieldCheck,
    title: 'Row-Level Security',
    description: 'Strict database permissions ensure member records and financial attendance data stay entirely private.'
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Check-in',
    description: 'Fast loading on any smartphone screen without requiring congregants to download heavy app store builds.'
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Instant visualization of attendance growth trends, gender distribution, and service-over-service retention.'
  }
];

const testimonials = [
  {
    quote: 'We moved from messy paper registers to real-time check-ins on our very first Sunday. Our follow-up team reaches absent members before Tuesday now.',
    name: 'Pastor Emeka O.',
    role: 'Senior Pastor, Grace Chapel Intl.',
    location: 'Lagos, Nigeria'
  },
  {
    quote: 'Tracking Choir and Youth ministry attendance separately used to take hours of manual collation. Now ministry leads handle it in 30 seconds.',
    name: 'Sis. Adaeze N.',
    role: 'Head of Ministries & Executive Secretariat',
    location: 'Port Harcourt, Nigeria'
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="bg-[var(--bg-app)] min-h-screen text-[var(--text-main)] selection:bg-brand-500/20 selection:text-brand-600">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Glow ambient background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/10 dark:bg-brand-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />
        
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Zap className="w-3.5 h-3.5" /> Built for Growing Congregations
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Modern Church Management & Attendance, <span className="text-brand-600 dark:text-brand-400">Automated by AI</span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-muted)] mt-6 max-w-2xl mx-auto font-normal leading-relaxed">
            Run fast Sunday check-ins with expiring codes, track sub-ministries, and automatically draft warm WhatsApp outreach for absent members.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-8 sm:mt-10">
            <button
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold rounded-xl px-7 py-3.5 shadow-lg shadow-brand-600/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              Start Free 14-Day Trial
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="w-full sm:w-auto bg-[var(--bg-surface)] hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-[var(--border-subtle)] font-medium rounded-xl px-7 py-3.5 transition-all text-[var(--text-main)] cursor-pointer"
            >
              View Launch Pricing (from ₦10,500)
            </button>
          </div>

          {/* Screenshot 1: Hero Dashboard Preview */}
          <div className="mt-12 md:mt-16 relative max-w-5xl mx-auto">
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 sm:p-3 shadow-2xl shadow-slate-900/10 dark:shadow-none backdrop-blur-xl">
              <div className="relative rounded-xl border border-[var(--border-subtle)] bg-slate-950/5 dark:bg-slate-900/60 aspect-[16/9] sm:aspect-[21/9] overflow-hidden flex flex-col items-center justify-center text-center p-6 group">
                {/* Visual grid line overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                
                <div className="relative z-10 max-w-md bg-[var(--bg-surface)]/90 backdrop-blur-md p-6 rounded-2xl border border-[var(--border-subtle)] shadow-xl">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                    Screenshot Placeholder #1
                  </span>
                  <h3 className="text-base font-bold text-[var(--text-main)] mt-1">
                    Main Admin Dashboard Screen
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
                    Capture your logged-in Admin Overview showing Total Congregation metric card, Sunday Attendance chart, and Recent Check-in Feed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="border-y border-[var(--border-subtle)] bg-[var(--bg-surface)] py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-4">
            Designed for forward-thinking congregations across Africa & globally
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-70 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-main)]">
              <Logo className="h-6 w-auto text-brand-600" /> Ecclesia ChMS
            </div>
            <span className="text-xs font-semibold text-[var(--text-muted)]">⚡ 15-Min Expiring Passcodes</span>
            <span className="text-xs font-semibold text-[var(--text-muted)]">📱 Dynamic QR Check-ins</span>
            <span className="text-xs font-semibold text-[var(--text-muted)]">💬 AI WhatsApp Drafts</span>
          </div>
        </div>
      </section>

      {/* Interactive Feature Showcase Section */}
      <section id="features" className="max-w-6xl mx-auto px-4 md:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Everything your ministry needs in one connected workflow
          </h2>
          <p className="text-[var(--text-muted)] mt-4 text-base">
            No bloated software you won't use. Just clear, purposeful tools built specifically for church administrators and department leads.
          </p>
        </div>

        {/* Feature Tabs Nav */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-10 bg-[var(--bg-surface)] p-1.5 rounded-2xl border border-[var(--border-subtle)]">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            const isActive = activeTab === index;
            return (
              <button
                key={feat.id}
                onClick={() => setActiveTab(index)}
                className={`flex items-center justify-center md:justify-start gap-2.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate hidden sm:inline">{feat.title}</span>
                <span className="truncate sm:hidden">{feat.tagline}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Feature Card Display */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 md:p-10 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold">
              {features[activeTab].tagline}
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-main)]">
              {features[activeTab].title}
            </h3>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed">
              {features[activeTab].description}
            </p>
            <ul className="space-y-2.5 pt-2">
              {features[activeTab].bullets.map((bullet, i) => (
                <li key={i} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <div className="pt-2">
              <button
                onClick={() => navigate('/auth')}
                className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
              >
                Try this feature in trial <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Screenshot Placeholder 2, 3, or 4 */}
          <div className="lg:col-span-7">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-slate-950/5 dark:bg-slate-900/80 aspect-[16/10] overflow-hidden flex flex-col items-center justify-center p-6 text-center relative group">
              <div className="w-10 h-10 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Screenshot Placeholder #{activeTab + 2}
              </span>
              <h4 className="text-sm font-bold text-[var(--text-main)] mt-1">
                {features[activeTab].screenshotLabel}
              </h4>
              <p className="text-xs text-[var(--text-muted)] mt-2 max-w-md leading-relaxed">
                {features[activeTab].screenshotDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Infrastructure Grid */}
      <section className="bg-[var(--bg-surface)] border-y border-[var(--border-subtle)] py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Built on modern multi-tenant architecture
            </h2>
            <p className="text-[var(--text-muted)] text-sm mt-3">
              Reliable infrastructure engineered to scale seamlessly from 20-member fellowships to mega-churches.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-[var(--bg-app)] border border-[var(--border-subtle)] rounded-2xl p-6 transition-all hover:border-brand-500/40"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-sm text-[var(--text-main)] mb-1.5">{title}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold">Loved by pastors & ministry leaders</h2>
          <p className="text-[var(--text-muted)] text-sm mt-2">
            See how churches are transforming their weekly attendance and member retention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-7 shadow-sm flex flex-col justify-between"
            >
              <p className="text-sm leading-relaxed text-[var(--text-main)] italic">
                "{t.quote}"
              </p>
              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-main)]">{t.name}</h4>
                  <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[var(--text-muted)]">
                  {t.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* High-Converting CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-20">
        <div className="relative rounded-3xl bg-brand-600 text-white p-8 sm:p-12 md:p-16 overflow-hidden shadow-2xl">
          {/* Decorative ambient radial light */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-3xl rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to modernize your Sunday service operations?
            </h2>
            <p className="text-brand-100 text-sm sm:text-base mt-4 leading-relaxed">
              Start with our Free tier or try Growth Plan at 50% off your first month (₦5,250 promo rate).
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <button
                onClick={() => navigate('/auth')}
                className="w-full sm:w-auto bg-white hover:bg-slate-100 text-brand-700 font-bold rounded-xl px-8 py-3.5 shadow-md transition-all cursor-pointer"
              >
                Get Started Free
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="w-full sm:w-auto bg-brand-700/60 hover:bg-brand-700 text-white font-medium rounded-xl px-8 py-3.5 border border-brand-400/30 transition-all cursor-pointer"
              >
                View Plans & FAQs
              </button>
            </div>
            
            <p className="text-xs text-brand-200 mt-6">
              No credit card required for setup • Instant account activation
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] py-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Logo className="h-7 w-auto text-brand-600" />
              <span className="font-bold text-base text-[var(--text-main)]">Ecclesia</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-[var(--text-muted)]">
              <button onClick={() => navigate('/pricing')} className="hover:text-[var(--text-main)] cursor-pointer">
                Pricing & Plans
              </button>
              <button onClick={() => navigate('/contact')} className="hover:text-[var(--text-main)] cursor-pointer">
                Contact & Support
              </button>
              <button onClick={() => navigate('/auth')} className="hover:text-[var(--text-main)] cursor-pointer">
                Sign In
              </button>
            </div>

            <p className="text-xs text-[var(--text-muted)] text-center md:text-right">
              © {new Date().getFullYear()} Ecclesia ChMS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}