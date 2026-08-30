// pages/admin/AIOutreachPage.tsx — temporary static version for the demo
import { Sparkles, MessageCircle } from 'lucide-react';

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
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">AI Outreach</h1>
        <span className="text-xs font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 px-2.5 py-1 rounded-full">
          Preview
        </span>
      </div>

      <p className="text-sm text-slate-500">
        Ecclesia automatically detects members who've missed recent mandatory services and drafts
        a warm, personal check-in message for you to review and send.
      </p>

      <div className="space-y-3">
        {DEMO_ABSENTEES.map((person) => (
          <div
            key={person.name}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{person.name}</p>
                <p className="text-xs text-slate-500">{person.phone}</p>
              </div>
              <span className="flex items-center gap-1 text-xs text-indigo-600">
                <Sparkles className="w-3.5 h-3.5" /> AI-drafted
              </span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
              {person.draft}
            </p>
            <button
              disabled
              className="mt-3 flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg px-3 py-2 opacity-60 cursor-not-allowed"
            >
              <MessageCircle className="w-3.5 h-3.5" /> Open in WhatsApp
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}