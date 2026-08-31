import React, { useState, useEffect, useCallback } from 'react';
import { useActiveOrg } from '../../hooks/useActiveOrg';
import { useAuth } from '../../hooks/useAuth';
import * as outreachService from '../../services/outReachService';
import { buildWhatsAppLink } from '../../utils/whatsappHelpers';
import { Sparkles, Send, RefreshCw, User, MessageSquare } from 'lucide-react';
import type { AbsenteeMember } from '../../services/outReachService';
import { Spinner } from '../../components/ui/Spinner';

// --- MAIN PAGE COMPONENT ---
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
        if (!ignore) setAbsentees(data);
      } finally {
        if (!ignore) setLoading(false);
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
    <div className="w-full max-w-4xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-subtle">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Smart Follow-Ups</span>
          </div>
          <h1 className="text-xl font-bold text-main tracking-tight">AI Outreach</h1>
          <p className="text-muted text-xs">
            Detect missing members and draft warm, personalized messages.
          </p>
        </div>
        <button
          onClick={loadAbsentees}
          className="group flex items-center gap-1.5 text-xs font-medium text-main bg-surface border border-subtle hover:border-brand-500/30 hover:bg-app px-3 py-1.5 rounded-lg transition-all shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-muted group-hover:text-brand-500 transition-colors ${loading ? 'animate-spin' : ''}`} /> 
          Refresh
        </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 bg-surface border border-subtle rounded-xl">
          <Spinner size="md" className="text-brand-500 mb-2" />
          <p className="text-muted text-xs font-medium">Analyzing attendance history...</p>
        </div>
      ) : absentees.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 bg-surface border border-subtle rounded-xl text-center px-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center mb-2 border border-brand-500/20">
            <User className="w-5 h-5 text-brand-500" />
          </div>
          <h3 className="text-sm font-bold text-main mb-1">No Absentees Detected</h3>
          <p className="text-muted text-xs max-w-sm">
            Either everyone is attending, or there isn't enough attendance history yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {absentees.map((member) => {
            const draft = drafts.find((d) => d.member.userId === member.userId);
            const isGenerating = generatingFor === member.userId;

            return (
              <div
                key={member.userId}
                className="group relative bg-surface border border-subtle rounded-xl p-4 overflow-hidden hover:border-brand-500/30 transition-all duration-200 shadow-sm"
              >
                <div className="relative z-10 flex items-center justify-between gap-4">
                  {/* Member Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-app border border-subtle flex items-center justify-center text-main font-bold text-sm shadow-sm flex-shrink-0">
                      {member.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-main leading-tight">{member.fullName}</p>
                      <p className="text-xs text-muted font-medium mt-0.5">
                        {member.phone ?? 'No phone number'}
                      </p>
                    </div>
                  </div>

                  {/* Generate Button */}
                  {!draft && (
                    <button
                      onClick={() => handleGenerate(member)}
                      disabled={isGenerating || !member.phone}
                      className="flex items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg px-3 py-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    >
                      {isGenerating ? (
                        <>
                          <Spinner size="sm" />
                          <span>Drafting...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Generate</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Draft Textarea Area */}
                {draft && (
                  <div className="mt-3 pt-3 border-t border-subtle relative z-10 animate-in fade-in slide-in-from-top-1">
                    <div className="flex items-center gap-1.5 mb-2">
                      <MessageSquare className="w-3.5 h-3.5 text-brand-500" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-main">AI Draft</span>
                    </div>
                    <textarea
                      value={draft.text}
                      onChange={(e) => updateDraftText(member.userId, e.target.value)}
                      rows={2}
                      className="w-full rounded-lg border border-subtle bg-app px-3 py-2 text-xs text-main focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-all resize-none shadow-inner"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => handleSend(draft)}
                        disabled={!member.phone}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg px-3 py-1.5 transition-all disabled:opacity-50 shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" /> 
                        <span>Send via WhatsApp</span>
                      </button>
                    </div>
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