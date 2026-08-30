import { Sparkles, MessageCircle, User } from 'lucide-react';

const DEMO_ABSENTEES = [
  {
    name: 'Emmanuel Josiah',
    phone: '0812 345 6789',
    draft:
      "Hey Emmanuel! We noticed you haven't been able to make it the past few Sundays and just wanted to check in — we've missed having you around. Hope everything's okay, and we'd love to see you this week 💙",
  },
  {
    name: 'Grace Adeyemi',
    phone: '0803 222 1190',
    draft:
      "Hi Grace, hope you're doing well! We haven't seen you at service in a bit and wanted to reach out — no pressure at all, just wanted you to know you're on our minds. See you soon, hopefully!",
  },
  {
    name: 'David Okonkwo',
    phone: '0705 998 4432',
    draft:
      "Hey David! Just checking in since we missed you the last couple of services. Everything alright? Would love to catch up whenever you're free to come by again.",
  },
];

export default function AIOutreachPage() {
  return (
    <div className="max-w-3xl mx-auto w-full space-y-6 animate-in fade-in duration-300 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface border border-subtle rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-main tracking-tight">AI Outreach</h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-600 dark:text-brand-400 px-2.5 py-1 rounded-md border border-brand-500/20">
              Preview
            </span>
          </div>
          <p className="text-sm text-muted mt-2 max-w-xl leading-relaxed">
            Ecclesia automatically detects members who've missed recent mandatory services and drafts a warm, personal check-in message for you to review and send.
          </p>
        </div>
      </div>

      {/* Outreach Cards List */}
      <div className="space-y-4">
        {DEMO_ABSENTEES.map((person) => (
          <div
            key={person.name}
            className="bg-surface border border-subtle rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group"
          >
            {/* Header: User Info & AI Badge */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-app border border-subtle flex items-center justify-center text-muted shrink-0 group-hover:scale-105 transition-transform">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-main">{person.name}</p>
                  <p className="text-xs text-muted mt-0.5">{person.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Drafted</span>
              </div>
            </div>
            
            {/* Draft Message Bubble */}
            <div className="bg-app border border-subtle rounded-xl p-4 relative shadow-inner">
              <p className="text-sm text-main leading-relaxed">
                {person.draft}
              </p>
            </div>
            
            {/* Action Bar */}
            <div className="flex justify-end mt-4">
              <button
                disabled
                className="flex items-center gap-2 bg-[#25D366]/10 text-[#128C7E] dark:text-[#25D366] border border-[#25D366]/20 px-4 py-2 text-xs font-semibold rounded-lg opacity-60 cursor-not-allowed transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open in WhatsApp</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}