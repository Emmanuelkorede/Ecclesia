import { useState } from 'react';
import { useNavigate } from 'react-router';
import PublicNavbar from '../../components/layout/publicNavbar';
import { Check, ChevronDown, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '₦0',
    period: '/month',
    audience: 'Small fellowships & plant churches',
    cta: 'Start Free',
    members: 'Up to 20 members',
    events: '4 events/month',
    groups: 'Max 2 groups',
    attendance: 'Passcode & Manual',
    ai: '5 AI drafts/month',
    push: 'Web announcements only',
    analytics: 'Basic dashboard',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: '₦10,500',
    period: '/month',
    promo: '₦5,250 for 1st month (50% off)',
    audience: 'Mid-size churches (20–150 members)',
    cta: 'Start Growth',
    members: 'Up to 150 members',
    events: '20 events/month',
    groups: 'Max 10 groups',
    attendance: 'Passcode + Dynamic QR',
    ai: '100 AI drafts/month',
    push: 'Push notifications',
    analytics: 'Advanced charts + CSV export',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '₦29,500',
    period: '/month',
    promo: '₦14,750 for 1st month (50% off)',
    audience: 'Large churches & multi-branch networks',
    cta: 'Start Enterprise',
    members: 'Unlimited members',
    events: 'Unlimited events',
    groups: 'Unlimited groups',
    attendance: 'Passcode + QR + Self check-in',
    ai: 'Unlimited AI drafts',
    push: 'Push + Direct SMS/WhatsApp',
    analytics: 'Full analytics + custom PDF export',
    highlighted: false,
  },
];

const faqs = [
  {
    q: 'How do expiring attendance codes work?',
    a: 'When you launch an attendance session, we generate a secure code that automatically expires after 10-15 minutes, preventing sharing or reuse after the service window closes.',
  },
  {
    q: 'Can I track Choir and Youth attendance separately from general service?',
    a: 'Yes. Any event can be restricted to a specific sub-ministry or group — only members tagged in that group can check in, tracking attendance independently.',
  },
  {
    q: 'How does the 50% first-month promotion work?',
    a: 'When you upgrade to Growth or Enterprise for the first time, your initial month is billed at half price when submitting your bank transfer payment proof.',
  },
  {
    q: 'How does bank transfer payment work?',
    a: 'You make a direct bank transfer for your chosen plan, then upload a screenshot of your transfer receipt in your dashboard. Our finance team verifies and activates your subscription quickly.',
  },
  {
    q: 'What happens if my subscription expires?',
    a: 'Your existing data stays fully safe and intact. Actions exceeding free plan limits are temporarily paused until you renew — nothing is ever deleted.',
  },
  {
    q: 'Can I switch plans later?',
    a: 'Yes, you can upgrade or adjust your tier at any time from your Billing page.',
  },
];

function FeatureRow({ label, free, growth, enterprise }: { label: string; free: string; growth: string; enterprise: string }) {
  return (
    <tr className="border-t border-[var(--border)]">
      <td className="px-5 py-4 text-sm text-[var(--text-h)] font-medium">{label}</td>
      <td className="px-5 py-4 text-sm text-[var(--text)] text-center">{free}</td>
      <td className="px-5 py-4 text-sm text-[var(--text)] text-center font-semibold text-brand-600 dark:text-brand-400">{growth}</td>
      <td className="px-5 py-4 text-sm text-[var(--text)] text-center">{enterprise}</td>
    </tr>
  );
}

export default function PricingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-200">
      <PublicNavbar />

      {/* Header Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-20 pb-12 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-h)] tracking-tight">
          Simple, transparent pricing for Nigerian churches
        </h1>
        <p className="text-[var(--text)] mt-4 max-w-xl mx-auto text-base">
          Start free and scale up as your congregation expands. No credit card required to get started.
        </p>

        <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-xl px-4 py-3 mt-8 text-sm text-brand-600 dark:text-brand-400 font-medium">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>Get 50% off your first month on Growth or Enterprise plans!</span>
        </div>
      </section>

      {/* Plan Cards */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-7 border flex flex-col justify-between shadow-sm transition-all bg-[var(--surface)] ${
                plan.highlighted
                  ? 'border-brand-500 ring-2 ring-brand-500/30 shadow-xl relative'
                  : 'border-[var(--border)]'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  Most Popular for Churches
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold text-[var(--text-h)]">{plan.name}</h3>
                <p className="text-xs text-[var(--text)] mt-1 min-h-[2rem]">{plan.audience}</p>
                
                <div className="flex items-baseline gap-1 mt-6">
                  <span className="text-4xl font-extrabold text-[var(--text-h)] tracking-tight">{plan.price}</span>
                  <span className="text-sm text-[var(--text)]">{plan.period}</span>
                </div>
                {plan.promo && (
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1.5">
                    🎉 {plan.promo}
                  </p>
                )}

                <button
                  onClick={() => navigate('/auth')}
                  className={`w-full mt-7 rounded-xl py-3 text-sm font-semibold transition-all cursor-pointer shadow-sm ${
                    plan.highlighted
                      ? 'bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white shadow-brand-600/20'
                      : 'border border-[var(--border)] text-[var(--text-h)] hover:bg-slate-100 dark:hover:bg-slate-800/80 bg-[var(--bg)]'
                  }`}
                >
                  {plan.cta}
                </button>

                <ul className="mt-8 space-y-3.5 text-sm text-[var(--text)]">
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" /> {plan.members}</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" /> {plan.events}</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" /> {plan.groups}</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" /> {plan.attendance}</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" /> {plan.ai}</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" /> {plan.push}</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" /> {plan.analytics}</li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 pb-24">
        <h2 className="text-2xl font-bold text-[var(--text-h)] mb-6 tracking-tight text-center">Compare plans in detail</h2>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-[var(--border)]">
              <tr>
                <th className="px-5 py-4 text-sm font-semibold text-[var(--text-h)]">Feature</th>
                <th className="px-5 py-4 text-sm font-semibold text-[var(--text-h)] text-center">Free</th>
                <th className="px-5 py-4 text-sm font-semibold text-brand-600 dark:text-brand-400 text-center">Growth</th>
                <th className="px-5 py-4 text-sm font-semibold text-[var(--text-h)] text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <FeatureRow label="Member limit" free="20" growth="150" enterprise="Unlimited" />
              <FeatureRow label="Events / month" free="4" growth="20" enterprise="Unlimited" />
              <FeatureRow label="Groups / ministries" free="2" growth="10" enterprise="Unlimited" />
              <FeatureRow label="Attendance methods" free="Passcode, Manual" growth="+ Dynamic QR" enterprise="+ Self check-in" />
              <FeatureRow label="AI outreach drafts" free="5/month" growth="100/month" enterprise="Unlimited" />
              <FeatureRow label="Notifications" free="Web announcements" growth="Push notifications" enterprise="Push + SMS/WhatsApp" />
              <FeatureRow label="Analytics & export" free="Basic dashboard" growth="Advanced + CSV" enterprise="Full + custom PDF" />
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="max-w-3xl mx-auto px-4 md:px-6 pb-28">
        <h2 className="text-2xl font-bold text-[var(--text-h)] text-center mb-10 tracking-tight">
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
              >
                <span className="text-sm font-semibold text-[var(--text-h)]">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[var(--text)] shrink-0 transition-transform duration-200 ${
                    openFaq === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 pt-1 text-sm text-[var(--text)] leading-relaxed border-t border-[var(--border)]/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}