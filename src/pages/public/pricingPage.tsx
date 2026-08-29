import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import PublicNavbar from '../../components/layout/publicNavbar';
import { Check, ChevronDown, Sparkles, HelpCircle, ShieldCheck, Zap } from 'lucide-react';
import { Logo } from '../../components/ui/Logo';

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
    audience: 'Large churches & multi-branch',
    cta: 'Start Enterprise',
    members: 'Unlimited members',
    events: 'Unlimited events',
    groups: 'Unlimited groups',
    attendance: 'Passcode + QR + Self check-in',
    ai: 'Unlimited AI drafts',
    push: 'Push + Direct SMS',
    analytics: 'Full analytics + custom PDF export',
    highlighted: false,
  },
];

const faqs = [
  {
    q: 'How do expiring attendance codes work?',
    a: 'When you launch an attendance session, we generate a secure code that automatically expires after 10-15 minutes, preventing sharing or reuse after the service window closes.',
    tag: 'Security'
  },
  {
    q: 'Can I track Choir and Youth attendance separately from general service?',
    a: 'Yes. Any event can be restricted to a specific sub-ministry or group — only members tagged in that group can check in, tracking attendance independently.',
    tag: 'Ministries'
  },
  {
    q: 'How does bank transfer payment work?',
    a: 'You make a direct bank transfer for your chosen plan, then upload a screenshot of your transfer receipt in your dashboard. Our finance team verifies and activates your subscription quickly.',
    tag: 'Billing'
  },
  {
    q: 'What happens if my subscription expires?',
    a: 'Your existing data stays fully safe and intact. Actions exceeding free plan limits are temporarily paused until you renew — nothing is ever deleted.',
    tag: 'Account'
  },
  {
    q: 'Can I switch plans later?',
    a: 'Yes, you can upgrade or adjust your tier at any time from your Billing page with prorated adjustments.',
    tag: 'Billing'
  },
];

function FeatureRow({ label, free, growth, enterprise } : { label: string; free: string; growth: string; enterprise: string; }) {
  return (
    <tr className="border-t border-white/[0.05] hover:bg-white/[0.02] transition-colors group">
      <td className="px-5 py-4 text-sm text-white/90 font-medium flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-500/40 group-hover:bg-violet-400 transition-colors" />
        {label}
      </td>
      <td className="px-5 py-4 text-sm text-white/60 text-center">{free}</td>
      <td className="px-5 py-4 text-sm text-center font-bold text-violet-300 bg-violet-500/[0.04] border-x border-violet-500/10 shadow-[inset_0_0_15px_rgba(139,92,246,0.03)]">{growth}</td>
      <td className="px-5 py-4 text-sm text-white/70 text-center font-medium">{enterprise}</td>
    </tr>
  );
}

export default function PricingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-[#0B0A10] text-white/70 selection:bg-violet-500/30 font-sans overflow-hidden flex flex-col">
      <PublicNavbar />

      {/* Ambient Background Glows */}
      <motion.div className="fixed inset-0 z-0 pointer-events-none flex justify-center items-start">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/10 blur-[120px]" />
      </motion.div>

      <main className="relative z-10 flex-grow pt-24 md:pt-32 pb-20">
        
        {/* Header Section */}
        <section className="max-w-4xl mx-auto px-6 text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md mb-6 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-violet-200">Investment in Growth</span>
          </div>
          <motion.h1 
            style={{ fontFamily: "'Outfit', sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 leading-tight"
          >
            Simple pricing built for <br className="hidden md:px-0" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 drop-shadow-lg">
              modern ministries.
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm md:text-base text-white/60 max-w-xl mx-auto leading-relaxed"
          >
            Scale your engagement tracking seamlessly with zero hidden fees. Pick a tier that fits your congregation size.
          </motion.p>
        </section>

        {/* Compact Plan Cards */}
        <section className="max-w-6xl mx-auto px-6 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
            {plans.map((plan, i) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                key={plan.name}
                className={`relative rounded-3xl p-6 lg:p-8 flex flex-col h-full transition-all duration-300 group ${
                  plan.highlighted
                    ? 'bg-[#12111A] border-2 border-violet-500/50 shadow-[0_0_40px_rgba(139,92,246,0.18)] lg:-translate-y-2 lg:scale-[1.02] z-10'
                    : 'bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                    <Zap className="w-3 h-3 fill-current" />
                    Most Popular Choice
                  </div>
                )}
                
                {/* Ambient Card Hover Glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/10 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="mb-6 relative z-10">
                  <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-[13px] text-white/50 min-h-[2.5rem] leading-snug">{plan.audience}</p>
                  
                  <div className="flex items-baseline gap-1 mt-4">
                    <span style={{ fontFamily: "'Outfit', sans-serif" }} className="text-4xl font-black text-white tracking-tight">{plan.price}</span>
                    <span className="text-[13px] font-medium text-white/40">{plan.period}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/auth')}
                  className={`w-full relative group/btn rounded-full py-3 text-sm font-bold transition-all mb-6 cursor-pointer ${
                    plan.highlighted
                      ? 'bg-white text-[#0B0A10] hover:scale-[1.02] active:scale-[0.98]'
                      : 'border border-white/[0.12] bg-white/[0.02] text-white hover:bg-white/[0.08]'
                  }`}
                >
                  {plan.highlighted && (
                    <span className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] group-hover/btn:shadow-[0_0_35px_rgba(255,255,255,0.5)] transition-shadow duration-500" />
                  )}
                  <span className="relative z-10">{plan.cta}</span>
                </button>

                <ul className="space-y-3 flex-grow relative z-10">
                  {[plan.members, plan.events, plan.groups, plan.attendance, plan.ai, plan.push, plan.analytics].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-[13px] text-white/75">
                      <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${plan.highlighted ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : 'bg-white/[0.05] text-white/40'}`}>
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className="leading-tight font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Upgraded Preppy Comparison Table */}
        <section className="max-w-5xl mx-auto px-6 mb-28">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/60">Matrix Breakdown</span>
            </div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-3xl font-black text-white tracking-tight">Compare plan capabilities</h2>
          </div>
          
          <div className="bg-[#12111A]/90 border border-white/[0.08] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-x-auto backdrop-blur-xl">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead className="bg-white/[0.03] border-b border-white/[0.08]">
                <tr>
                  <th className="px-5 py-5 text-xs font-bold uppercase tracking-wider text-white/40 w-[28%]">Core Feature</th>
                  <th className="px-5 py-5 text-xs font-bold uppercase tracking-wider text-white/60 text-center w-[24%]">Free Tier</th>
                  <th className="px-5 py-5 text-xs font-bold uppercase tracking-wider text-violet-300 text-center w-[24%] bg-violet-500/[0.06] border-x border-violet-500/10">Growth Tier</th>
                  <th className="px-5 py-5 text-xs font-bold uppercase tracking-wider text-white/60 text-center w-[24%]">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <FeatureRow label="Active Member Limit" free="20 Members" growth="150 Members" enterprise="Unlimited" />
                <FeatureRow label="Monthly Events" free="4 Events" growth="20 Events" enterprise="Unlimited" />
                <FeatureRow label="Ministry Sub-groups" free="Max 2 Groups" growth="Max 10 Groups" enterprise="Unlimited Groups" />
                <FeatureRow label="Attendance Protocols" free="Passcode, Manual" growth="Passcode + Dynamic QR" enterprise="Passcode + QR + Self Check-in" />
                <FeatureRow label="AI Absentee Outreach" free="5 Drafts / mo" growth="100 Drafts / mo" enterprise="Unlimited Custom AI" />
                <FeatureRow label="Push & Notifications" free="Web Announcements" growth="Native Push Alerting" enterprise="Push + Direct SMS & WhatsApp" />
                <FeatureRow label="Data Analytics & Exports" free="Basic Dashboard" growth="Advanced + CSV Export" enterprise="Full Suite + Custom PDF" />
              </tbody>
            </table>
          </div>
        </section>

        {/* Upgraded FAQ Accordion */}
        <section id="faq" className="max-w-3xl mx-auto px-6 scroll-mt-24">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/60">Got Questions?</span>
            </div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-3xl font-black text-white tracking-tight">Everything you need to know</h2>
          </div>
          
          <div className="space-y-3.5">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  openFaq === i 
                    ? 'bg-[#12111A] border-violet-500/40 shadow-[0_4px_25px_rgba(139,92,246,0.08)]' 
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03]'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4.5 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3 pr-4">
                    <span className="text-xs font-mono font-bold text-violet-400 px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 shrink-0">
                      {faq.tag}
                    </span>
                    <span className="text-sm font-semibold text-white/95">{faq.q}</span>
                  </div>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${openFaq === i ? 'bg-violet-500/20 text-violet-300 rotate-180' : 'bg-white/[0.05] text-white/40'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 text-[13.5px] text-white/65 leading-relaxed border-t border-white/[0.05] pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER - Updated to match homepage styling */}
      <footer className="relative border-t border-white/[0.05] py-12 md:py-28 bg-[#08070D] overflow-hidden mt-auto">
        {/* Massive Background Name Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
          <span 
            style={{ fontFamily: "'Outfit', sans-serif" }}
            className="text-[18vw] font-black text-white/[0.04] tracking-tighter leading-none"
          >
            ECCLESIA
          </span>
        </div>

        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-4 text-[13px] text-white/40">
            {/* Bold Purple Logo */}
            <Logo className="h-6 w-auto text-violet-500 font-bold" />
            <p className="hidden md:block text-white/20">|</p>
            <p>© {new Date().getFullYear()} Ecclesia. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 font-medium text-[14px] text-white/90">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <a href="/pricing#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="/contact" className="hover:text-white transition-colors">Contact</a>
            <a href="/auth" className="hover:text-white transition-colors">Log In</a>
          </div>
        </div>
      </footer>
    </div>
  );
}