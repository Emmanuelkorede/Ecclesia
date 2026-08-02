import { useState } from 'react';
import { useNavigate } from 'react-router';
import PublicNavbar from '../../components/layout/publicNavbar';
import { Check,  ChevronDown } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    audience: 'Small fellowships, plant churches',
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
    name: 'Pro',
    price: '$29',
    period: '/month',
    audience: 'Mid-size churches (20–150 members)',
    cta: 'Start Pro',
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
    name: 'Master',
    price: '$99',
    period: '/month',
    audience: 'Large churches / multi-branch',
    cta: 'Start Master',
    members: 'Unlimited',
    events: 'Unlimited',
    groups: 'Unlimited',
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
    a: 'When you launch an attendance session, we generate a 4-6 digit code that automatically expires after 10-15 minutes, so it can\'t be shared or reused after the service window closes.',
  },
  {
    q: 'Can I track Choir attendance separately from general service attendance?',
    a: 'Yes. Any event can be restricted to a specific group — only members tagged in that group can check in, and their attendance is tracked independently from church-wide services.',
  },
  {
    q: 'How does the 50% first-month promotion work?',
    a: 'When you upgrade to Pro or Master for the first time, your first month is billed at 50% off. Just mention it when you submit your payment proof and we\'ll apply the discount.',
  },
  {
    q: 'How does payment work if there\'s no card checkout?',
    a: 'You make a bank transfer for your chosen plan, then upload a screenshot of the receipt in your dashboard. Our team reviews and activates your plan, typically within 24-48 hours.',
  },
  {
    q: 'What happens if my subscription expires?',
    a: 'Your existing data stays fully intact. New actions beyond your plan\'s limits are paused until you renew — nothing is deleted.',
  },
  {
    q: 'Can I switch plans later?',
    a: 'Yes, you can upgrade at any time from your Billing page. Downgrades take effect at the end of your current billing cycle.',
  },
];

function FeatureRow({ label, free, pro, master }: { label: string; free: string; pro: string; master: string }) {
  return (
    <tr className="border-t border-[var(--border-subtle)]">
      <td className="px-4 py-3 text-sm text-[var(--text-main)] font-medium">{label}</td>
      <td className="px-4 py-3 text-sm text-[var(--text-muted)] text-center">{free}</td>
      <td className="px-4 py-3 text-sm text-[var(--text-muted)] text-center">{pro}</td>
      <td className="px-4 py-3 text-sm text-[var(--text-muted)] text-center">{master}</td>
    </tr>
  );
}

export default function PricingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-[var(--bg-app)] min-h-screen">
      <PublicNavbar />

      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-16 pb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-main)]">
          Simple pricing for churches of every size
        </h1>
        <p className="text-[var(--text-muted)] mt-3 max-w-lg mx-auto">
          Start free. Upgrade as your congregation grows. No card required to get started.
        </p>

        <div className="bg-accent-50 dark:bg-accent-950/30 border border-accent-200 dark:border-accent-900 rounded-xl px-4 py-3 mt-6 max-w-md mx-auto text-sm text-accent-700 dark:text-accent-300">
          🎉 Get 50% off your first month on Pro or Master plans
        </div>
      </section>

      {/* Plan cards */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 border shadow-[var(--card-shadow)] ${
                plan.highlighted
                  ? 'border-brand-500 bg-[var(--bg-surface)] ring-2 ring-brand-500'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]'
              }`}
            >
              {plan.highlighted && (
                <span className="text-xs font-medium bg-brand-600 text-white px-2.5 py-1 rounded-full">
                  Most popular
                </span>
              )}
              <h3 className="text-xl font-semibold text-[var(--text-main)] mt-3">{plan.name}</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">{plan.audience}</p>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-3xl font-bold text-[var(--text-main)]">{plan.price}</span>
                <span className="text-sm text-[var(--text-muted)]">{plan.period}</span>
              </div>

              <button
                onClick={() => navigate('/auth')}
                className={`w-full mt-5 rounded-lg py-2.5 text-sm font-medium ${
                  plan.highlighted
                    ? 'bg-brand-600 hover:bg-brand-700 text-white'
                    : 'border border-[var(--border-subtle)] text-[var(--text-main)] hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {plan.cta}
              </button>

              <ul className="mt-6 space-y-2.5 text-sm text-[var(--text-muted)]">
                <li className="flex gap-2"><Check className="w-4 h-4 text-accent-600 shrink-0" /> {plan.members}</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-accent-600 shrink-0" /> {plan.events}</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-accent-600 shrink-0" /> {plan.groups}</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-accent-600 shrink-0" /> {plan.attendance}</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-accent-600 shrink-0" /> {plan.ai}</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-accent-600 shrink-0" /> {plan.push}</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-accent-600 shrink-0" /> {plan.analytics}</li>
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 pb-20 overflow-x-auto">
        <h2 className="text-xl font-semibold text-[var(--text-main)] mb-4">Compare plans in detail</h2>
        <table className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-main)]">Feature</th>
              <th className="px-4 py-3 text-sm font-medium text-[var(--text-main)]">Free</th>
              <th className="px-4 py-3 text-sm font-medium text-[var(--text-main)]">Pro</th>
              <th className="px-4 py-3 text-sm font-medium text-[var(--text-main)]">Master</th>
            </tr>
          </thead>
          <tbody>
            <FeatureRow label="Member limit" free="20" pro="150" master="Unlimited" />
            <FeatureRow label="Events / month" free="4" pro="20" master="Unlimited" />
            <FeatureRow label="Groups / ministries" free="2" pro="10" master="Unlimited" />
            <FeatureRow label="Attendance methods" free="Passcode, Manual" pro="+ Dynamic QR" master="+ Self check-in" />
            <FeatureRow label="AI outreach drafts" free="5/month" pro="100/month" master="Unlimited" />
            <FeatureRow label="Notifications" free="Web only" pro="Push (OneSignal)" master="Push + SMS/WhatsApp" />
            <FeatureRow label="Analytics & export" free="Basic dashboard" pro="Advanced + CSV" master="Full + custom PDF" />
          </tbody>
        </table>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-4 md:px-6 pb-20">
        <h2 className="text-2xl font-semibold text-[var(--text-main)] text-center mb-8">
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <span className="text-sm font-medium text-[var(--text-main)]">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[var(--text-muted)] shrink-0 transition-transform ${
                    openFaq === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === i && (
                <p className="px-4 pb-4 text-sm text-[var(--text-muted)]">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}