import { useState, useEffect, useCallback } from 'react';
import { useActiveOrg } from '../../hooks/useActiveOrg';
import { useAuth } from '../../hooks/useAuth';
import * as outreachService from '../../services/outReachService';
import { buildWhatsAppLink } from '../../utils/whatsappHelpers';
import { Sparkles, Send, RefreshCw } from 'lucide-react';
import type { AbsenteeMember } from '../../services/outReachService';

interface DraftItem {
  id?: string;
  member: AbsenteeMember;
  text: string;
  editing: boolean;
}

export default function AIOutreachPage() {
  const { activeOrg } = useActiveOrg();
  const { user } = useAuth();
  const [absentees, setAbsentees] = useState<AbsenteeMember[]>([]);
  const [drafts, setDrafts] = useState<DraftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);

  const orgId = activeOrg?.id;

  const loadAbsentees = useCallback(async () => {
    if (!orgId) {
      setAbsentees([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await outreachService.getAbsentees(orgId);
      setAbsentees(data);
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    let ignore = false;

    async function fetchAbsentees() {
      if (!orgId) {
        if (!ignore) {
          setAbsentees([]);
          setLoading(false);
        }
        return;
      }

      try {
        const data = await outreachService.getAbsentees(orgId);
        if (!ignore) {
          setAbsentees(data);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchAbsentees();

    return () => {
      ignore = true;
    };
  }, [orgId]);

  const handleGenerate = async (member: AbsenteeMember) => {
    if (!activeOrg) return;
    setGeneratingFor(member.userId);
    try {
      const text = await outreachService.generateDraftMessage(activeOrg.name, member.fullName);
      const saved = await outreachService.saveDraft({
        orgId: activeOrg.id,
        memberId: member.userId,
        draftContent: text,
      });
      setDrafts((prev) => [...prev, { id: saved.id, member, text, editing: false }]);
    } finally {
      setGeneratingFor(null);
    }
  };

  const updateDraftText = (memberId: string, newText: string) => {
    setDrafts((prev) =>
      prev.map((d) => (d.member.userId === memberId ? { ...d, text: newText } : d))
    );
  };

  const handleSend = async (draft: DraftItem) => {
    if (!draft.member.phone || !draft.id || !user) return;

    const waLink = buildWhatsAppLink(draft.member.phone, draft.text);
    window.open(waLink, '_blank');

    await outreachService.markAsSent(draft.id, draft.text, user.id);
    setDrafts((prev) => prev.filter((d) => d.member.userId !== draft.member.userId));
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">AI Outreach</h1>
        <button
          onClick={loadAbsentees}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Checking attendance history...</p>
      ) : absentees.length === 0 ? (
        <p className="text-sm text-slate-500">
          No absentees detected right now — either everyone's attending, or there isn't enough
          mandatory attendance history yet to judge.
        </p>
      ) : (
        <div className="space-y-3">
          {absentees.map((member) => {
            const draft = drafts.find((d) => d.member.userId === member.userId);
            return (
              <div
                key={member.userId}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{member.fullName}</p>
                    <p className="text-xs text-slate-500">
                      {member.phone ?? 'No phone number on file'}
                    </p>
                  </div>
                  {!draft && (
                    <button
                      onClick={() => handleGenerate(member)}
                      disabled={generatingFor === member.userId || !member.phone}
                      className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg px-3 py-2 disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {generatingFor === member.userId ? 'Drafting...' : 'Generate message'}
                    </button>
                  )}
                </div>

                {draft && (
                  <div className="mt-3 space-y-2">
                    <textarea
                      value={draft.text}
                      onChange={(e) => updateDraftText(member.userId, e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-white"
                    />
                    <button
                      onClick={() => handleSend(draft)}
                      disabled={!member.phone}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg px-3 py-2 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" /> Open in WhatsApp
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}