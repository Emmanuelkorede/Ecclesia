import { useNavigate } from 'react-router';
import { motion, useScroll, useTransform } from 'framer-motion';
import PublicNavbar from '../../components/layout/publicNavbar';
import { 
  QrCode, Building2, Sparkles, ArrowRight, CheckCircle2, 
  ChevronRight, Users, Shield, CalendarSync, BellRing, BarChart3, 
  Smartphone, Globe2, Terminal
} from 'lucide-react';
import { Logo } from '../../components/ui/Logo';

const features = [
  { icon: CalendarSync, title: 'Custom & Recurring Events', description: 'Set up Sunday Service once and let it run weekly, or create one-off conferences. Attendance logic adapts seamlessly to both.' },
  { icon: QrCode, title: 'Smart Attendance Check-in', description: 'Expiring 15-minute passcodes, dynamic QR scans, or manual admin overrides. Zero duplicated records, enforced at the database level.' },
  { icon: Sparkles, title: 'AI Absentee Outreach', description: 'Automatic missed-service detection that drafts warm, personalized WhatsApp or SMS follow-ups before a member slips away.' },
  { icon: Building2, title: 'True Multi-Tenancy', description: 'Manage multiple branches or switch between your role as a Pastor at one church and a volunteer at another—without logging out.' },
  { icon: BellRing, title: 'Push Announcements', description: 'Bypass crowded WhatsApp groups. Send targeted announcements with native push notifications directly to ministry sub-groups.' },
  { icon: BarChart3, title: 'Retention Analytics', description: 'Track 30-day active vs. inactive rolling windows, group-specific attendance trends, and instantly export branded PDF reports.' },
];

const testimonials = [
  { quote: 'We went from messy paper registers to real-time attendance tracking in a single Sunday. Our absentee follow-ups actually happen now.', name: 'Pastor Emeka O.', role: 'Senior Pastor, Grace Chapel' },
  { quote: 'Managing Choir and Youth ministry attendance separately used to be an administrative nightmare. Now it takes our team two taps.', name: 'Sis. Adaeze N.', role: 'Youth Ministry Lead' },
  { quote: 'The ability to switch between our main campus and the student fellowship branch without creating new accounts is a game-changer.', name: 'Rev. Samuel T.', role: 'Network Director' },
  { quote: 'No more generic text messages. The system tells us exactly who missed 3 consecutive services so we can call them directly.', name: 'Deaconess Sarah M.', role: 'Follow-up Department' },
];

const trustBadges = [
  { icon: Shield, label: 'Pentecostal Assemblies' },
  { icon: Users, label: 'Campus Fellowships' },
  { icon: Building2, label: 'Multi-Branch Ministries' },
  { icon: Globe2, label: 'Global Outreach Centers' },
  { icon: Smartphone, label: 'Mobile-First Congregations' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <div className="min-h-screen bg-[#0B0A10] text-white/70 selection:bg-violet-500/30 font-sans overflow-hidden">
      <PublicNavbar />

      {/* Global Background Glows */}
      <motion.div style={{ y: yBg }} className="fixed inset-0 z-0 pointer-events-none flex justify-center items-start">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/10 blur-[120px]" />
      </motion.div>

      <main className="relative z-10">
        
        {/* HERO SECTION - Spacing tightened for compact view */}
        <section className="relative min-h-[100svh] flex flex-col items-center justify-between pt-24 md:pt-28 px-6 overflow-hidden">
          
          {/* Floating Background Elements to make it dynamic */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <motion.div 
              animate={{ y: [0, -40, 0], rotate: [0, 15, 0] }} 
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} 
              className="absolute top-[15%] left-[10%] md:left-[20%] w-20 h-20 bg-violet-500/5 backdrop-blur-3xl rounded-2xl border border-white/5" 
            />
            <motion.div 
              animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }} 
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} 
              className="absolute top-[40%] right-[10%] md:right-[20%] w-32 h-32 bg-indigo-500/5 backdrop-blur-3xl rounded-full border border-white/5" 
            />
            <motion.div 
              animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }} 
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} 
              className="absolute bottom-[30%] left-[15%] w-12 h-12 bg-fuchsia-500/5 backdrop-blur-3xl rounded-xl border border-white/5" 
            />
          </div>

          {/* Hero Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl mx-auto text-center relative z-10 flex-shrink-0"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md mb-4 hover:bg-white/[0.06] transition-colors cursor-default">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-violet-200">Built for Emerging Markets</span>
            </div>

            <h1 
              style={{ fontFamily: "'Outfit', sans-serif" }}
              className="text-5xl md:text-7xl lg:text-[5rem] font-black text-white leading-[1.05] tracking-tight mb-5"
            >
              Modern Church Attendance, <br className="hidden md:block" /> 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 drop-shadow-lg">
                Automated for Growth.
              </span>
            </h1>
            
            {/* AI-Style "What If" Text */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-7 max-w-2xl mx-auto bg-black/40 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex-shrink-0">
                <Terminal className="w-4 h-4 text-violet-400" />
              </div>
              <p className="text-sm md:text-base text-white/80 font-medium text-left">
                <span className="text-violet-300 font-bold">What if</span> tracking engagement, managing ministries, and reaching absentees was entirely automated?
                <span className="inline-block w-1.5 h-4 ml-1 bg-violet-400 animate-pulse align-middle" />
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/auth')}
                className="w-full sm:w-auto relative group flex items-center justify-center gap-2 rounded-full px-8 py-4 bg-white text-[#0B0A10] text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="absolute inset-0 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] group-hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] transition-shadow duration-500" />
                <span className="relative z-10 flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.08] text-white text-sm font-semibold rounded-full px-8 py-4 transition-all backdrop-blur-sm"
              >
                View Pricing
              </button>
            </div>
          </motion.div>

          {/* Dashboard Peek Mockup (Responsive & Centered) */}
          <motion.div 
            initial={{ opacity: 0, y: 150 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl mx-auto mt-10 md:mt-12 flex-1 flex items-end justify-center perspective-[2000px]"
          >
            <div className="absolute bottom-0 w-3/4 h-32 bg-violet-500/30 blur-[100px] rounded-full translate-y-1/2" />
            
            <div className="relative w-full rounded-t-[24px] border-x border-t border-white/[0.1] bg-[#0B0A10]/50 p-2 pb-0 shadow-[0_-20px_60px_-15px_rgba(139,92,246,0.2)] backdrop-blur-2xl">
              <div className="rounded-t-[16px] overflow-hidden border-x border-t border-white/[0.05] bg-[#12111A] flex flex-col">
                <div className="h-10 bg-white/[0.02] flex items-center px-4 gap-2 border-b border-white/[0.05] flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80" />
                </div>
                {/* Changed aspect ratio and image fitting so it shows the full screen on PC */}
                <div className="w-full aspect-video md:aspect-[16/9] lg:aspect-[16/10] bg-[#12111A] relative overflow-hidden group">
                  <img 
                    src="/dashboard.png" 
                    alt="Admin Dashboard Preview" 
                    className="absolute inset-0 w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* INFINITE TRUST MARQUEE */}
        <section className="border-y border-white/[0.05] py-6 bg-white/[0.01] backdrop-blur-sm overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-[#0B0A10] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-[#0B0A10] to-transparent z-10 pointer-events-none" />
          
          <div className="flex whitespace-nowrap opacity-50">
            <motion.div 
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
              className="flex gap-12 md:gap-16 min-w-max items-center"
            >
              {[...trustBadges, ...trustBadges].map((badge, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <badge.icon className="w-5 h-5 text-white/40" />
                  <span className="text-white/80 font-bold uppercase tracking-wider text-[11px]">{badge.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* BENTO GRID FEATURES */}
        <section id="features" className="max-w-6xl mx-auto px-6 py-24 scroll-mt-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.h2 
              style={{ fontFamily: "'Outfit', sans-serif" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4"
            >
              Everything your church needs.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1 }}
              className="text-base text-white/60 leading-relaxed"
            >
              Purpose-built tools designed to eliminate paper spreadsheets and put ministry data back in your hands.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: (i % 3) * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.04] hover:border-violet-500/30 transition-all duration-300 overflow-hidden min-h-[220px] flex flex-col justify-start"
              >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/10 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none translate-x-1/2 -translate-y-1/2" />
                
                {/* Background Number (01, 02, etc.) */}
                <div className="absolute top-6 right-6 text-6xl md:text-8xl font-black text-white/[0.08] pointer-events-none select-none group-hover:text-violet-500/[0.12] transition-colors duration-500 leading-none">
                  {String(i + 1).padStart(2, '0')}
                </div>

                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 bg-white/[0.04] border border-white/[0.08] group-hover:bg-violet-500/20 group-hover:border-violet-500/30 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-violet-300" />
                  </div>
                  <h3 className="font-bold text-lg text-white mb-2">{title}</h3>
                  <p className="text-white/60 leading-relaxed text-sm pr-6">{description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* DEMO SPLIT SECTION */}
        <section className="relative border-y border-white/[0.05] bg-white/[0.01] py-24 overflow-hidden">
          <div className="absolute top-1/2 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
                  <QrCode className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-indigo-300">Live Attendance</span>
                </div>
                <h2 
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                  className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4"
                >
                  Check-ins that actually work.
                </h2>
                <p className="text-base text-white/60 mb-8 leading-relaxed">
                  From a member's swift QR scan to an admin's full attendance analytics report — watch how simple your Sunday operations can be.
                </p>
                
                <ul className="space-y-4 mb-8">
                  {['Scan-to-check-in mobile flow', 'Real-time headcounts & updates', 'Group-restricted permissions', 'Exportable PDF/CSV reports'].map((item, i) => (
                    <motion.li 
                      key={item}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + (i * 0.1) }}
                      className="flex items-center gap-3 text-white/80 text-sm font-medium"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-violet-300" />
                      </div>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-indigo-600/20 blur-[60px] rounded-full" />
                <div className="relative rounded-2xl border border-white/[0.1] bg-[#12111A]/80 p-2 shadow-2xl backdrop-blur-xl">
                  <div className="rounded-xl overflow-hidden border border-white/[0.05] bg-[#0B0A10]">
                    <div className="bg-white/[0.02] border-b border-white/[0.05] px-4 py-3 flex items-center justify-center">
                       <span className="text-[10px] font-semibold tracking-widest text-white/40 uppercase">Live Roster Session</span>
                    </div>
                    {/* Fixed aspect ratio & object-contain ensures it never cuts off poorly on mobile */}
                    <div className="aspect-video w-full relative bg-[#0B0A10]">
                      <img 
                        src="/attendance.png" 
                        alt="Interactive Attendance Roster" 
                        className="absolute inset-0 w-full h-full object-contain md:object-cover object-center opacity-90"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="max-w-6xl mx-auto px-6 py-24 relative">
          <div className="text-center mb-16">
            <motion.h2 
              style={{ fontFamily: "'Outfit', sans-serif" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3"
            >
              Loved by church leaders.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-white/60 text-base"
            >
              See how we're transforming ministries around the globe.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: (i % 2) * 0.1, duration: 0.5 }}
                className="relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 flex flex-col justify-between hover:border-violet-500/30 hover:bg-white/[0.03] transition-all"
              >
                <div className="absolute top-4 right-6 text-7xl font-serif text-white/[0.04] pointer-events-none leading-none">"</div>
                <p className="relative z-10 text-white/80 text-sm leading-relaxed mb-8 font-medium">"{t.quote}"</p>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-white/[0.1] flex items-center justify-center font-bold text-violet-300 text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-[11px] text-white/50 uppercase tracking-wider mt-0.5">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="relative py-24 overflow-hidden border-t border-white/[0.05]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-violet-900/10 pointer-events-none" />
          <motion.div 
            animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute bottom-[-30%] left-1/2 -translate-x-1/2 w-[60vw] h-[300px] bg-violet-600/20 blur-[120px] pointer-events-none rounded-full" 
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto px-6 text-center relative z-10"
          >
            <h2 
              style={{ fontFamily: "'Outfit', sans-serif" }}
              className="text-4xl md:text-6xl font-black text-white mb-5 tracking-tight"
            >
              Ready to modernize?
            </h2>
            <p className="text-base text-white/60 mb-8 max-w-xl mx-auto">
              Join forward-thinking ministries tracking engagement efficiently. Flexible payment options. No credit card required to start.
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="relative group inline-flex items-center justify-center gap-2 bg-white text-[#0B0A10] font-bold rounded-full px-8 py-4 text-sm transition-transform hover:scale-[1.03] active:scale-[0.97]"
            >
              <span className="absolute inset-0 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-shadow duration-500" />
              <span className="relative z-10 flex items-center gap-1.5">
                Start Free Trial Today
                <ChevronRight className="w-4 h-4" />
              </span>
            </button>
          </motion.div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative border-t border-white/[0.05] py-12 md:py-28 bg-[#08070D] overflow-hidden">
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
            <a href="/pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="/pricing#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="/contact" className="hover:text-white transition-colors">Contact</a>
            <a href="/auth" className="hover:text-white transition-colors">Log In</a>
          </div>
        </div>
      </footer>
    </div>
  );
}