import { motion } from 'framer-motion';
import PublicNavbar from '../../components/layout/publicNavbar';
import { Mail, MessageSquare, MapPin, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { Logo } from '../../components/ui/Logo';

export default function ContactPage() {
  const supportEmail = 'support@ecclesia.ng';
  const whatsappNumber = '+2348000000000';
  const whatsappMessage = 'Hello Ecclesia Support, I need assistance with my church management account.';

  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-[#0B0A10] text-white/70 selection:bg-violet-500/30 font-sans overflow-hidden flex flex-col">
      <PublicNavbar />

      {/* Ambient Background Glows */}
      <motion.div className="fixed inset-0 z-0 pointer-events-none flex justify-center items-start">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/10 blur-[120px]" />
      </motion.div>

      <main className="relative z-10 flex-grow pt-28 md:pt-36 pb-24">
        
        {/* Header Section */}
        <section className="max-w-4xl mx-auto px-6 text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md mb-6 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-violet-200">We Are Here To Help</span>
          </div>
          <motion.h1 
            style={{ fontFamily: "'Outfit', sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 leading-tight"
          >
            Get in touch with our <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 drop-shadow-lg">
              support team.
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm md:text-base text-white/60 max-w-xl mx-auto leading-relaxed"
          >
            Have questions about pricing tiers, account setup, or bank transfer verification? We're here to ensure your ministry runs smoothly.
          </motion.p>
        </section>

        {/* Contact Cards Section */}
        <section className="max-w-4xl mx-auto px-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Email Card */}
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              href={`mailto:${supportEmail}`}
              className="group relative bg-[#12111A] border border-white/[0.08] hover:border-violet-500/40 rounded-3xl p-8 shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-violet-500/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-300 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-white mb-2">Email Support</h3>
                <p className="text-sm text-white/60 mb-8 leading-relaxed">
                  Send us an email anytime for account assistance, feature inquiries, or payment receipt verification.
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-2 text-sm font-bold text-violet-400 group-hover:gap-3 transition-all">
                <span>{supportEmail}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.a>

            {/* WhatsApp Card */}
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-[#12111A] border border-white/[0.08] hover:border-emerald-500/40 rounded-3xl p-8 shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-white mb-2">WhatsApp Chat</h3>
                <p className="text-sm text-white/60 mb-8 leading-relaxed">
                  Connect directly with our support team on WhatsApp for instant assistance during active business hours.
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-2 text-sm font-bold text-emerald-400 group-hover:gap-3 transition-all">
                <span>Chat on WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.a>
          </div>

          {/* Operating Hours Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 bg-[#12111A] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Operating Hours & Location</h4>
                <p className="text-xs text-white/60 mt-0.5">Monday – Friday: 9:00 AM – 5:00 PM WAT • Lagos, Nigeria</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs font-semibold text-white/90 bg-white/[0.03] px-3.5 py-2.5 rounded-xl border border-white/[0.08] shadow-inner">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Bank Verification Active</span>
            </div>
          </motion.div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative border-t border-white/[0.05] py-12 md:py-28 bg-[#08070D] overflow-hidden mt-auto">
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
            <Logo className="h-6 w-auto text-violet-500 font-bold" />
            <p className="hidden md:block text-white/20">|</p>
            <p>© {new Date().getFullYear()} Ecclesia. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 font-medium text-[14px] text-white/90">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <a href="/pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="/pricing#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="/auth" className="hover:text-white transition-colors">Log In</a>
          </div>
        </div>
      </footer>
    </div>
  );
}