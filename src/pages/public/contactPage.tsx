import PublicNavbar from '../../components/layout/publicNavbar';
import { Mail, MessageSquare, MapPin, Phone, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  const supportEmail = 'support@ecclesia.ng';
  const whatsappNumber = '+2348000000000';
  const whatsappMessage = 'Hello Ecclesia Support, I need assistance with my church management account.';

  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-200">
      <PublicNavbar />

      <section className="max-w-4xl mx-auto px-4 md:px-6 pt-20 pb-16 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-h)] tracking-tight">
          Get in touch with our team
        </h1>
        <p className="text-[var(--text)] mt-4 max-w-lg mx-auto text-base">
          Have questions about pricing tiers, account setup, or bank transfer verification? We're here to help your ministry succeed.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-4 md:px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Card */}
          <a
            href={`mailto:${supportEmail}`}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[var(--text-h)] mb-1">Email Support</h3>
              <p className="text-sm text-[var(--text)] mb-6 leading-relaxed">
                Send us an email anytime for account assistance, feature inquiries, or payment receipt verification.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-400 group-hover:gap-3 transition-all">
              <span>{supportEmail}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </a>

          {/* WhatsApp Card */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[var(--text-h)] mb-1">WhatsApp Chat</h3>
              <p className="text-sm text-[var(--text)] mb-6 leading-relaxed">
                Connect directly with our support team on WhatsApp for instant assistance during active business hours.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 group-hover:gap-3 transition-all">
              <span>Chat on WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </a>
        </div>

        {/* Operating Hours Banner */}
        <div className="mt-8 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[var(--text-h)]">Operating Hours & Location</h4>
              <p className="text-xs text-[var(--text)] mt-0.5">Monday – Friday: 9:00 AM – 5:00 PM WAT • Lagos, Nigeria</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-h)] bg-[var(--bg)] px-3.5 py-2.5 rounded-xl border border-[var(--border)] shadow-xs">
            <Phone className="w-3.5 h-3.5 text-brand-600" />
            <span>Bank Verification Active</span>
          </div>
        </div>
      </section>
    </div>
  );
}