import React, { useState, useEffect } from 'react';
import { useActiveOrg } from '../../hooks/useActiveOrg';
import { generateSlug } from '../../utils/orgHelpers';
import { updateOrganization } from '../../services/orgService';
import { canManageOrgSettings } from '../../utils/permissions';

// Icons & UI
import { Copy, Check, AlertCircle, Building, KeyRound, Palette, Save } from 'lucide-react';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { AccentPicker } from '../../components/ui/AccentPicker';
import { Spinner } from '../../components/ui/Spinner';

export default function SettingsPage() {
  const { activeOrg, role, refreshMemberships } = useActiveOrg();
  
  // Form State
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeOrg) {
      setName(activeOrg.name);
      setAddress(activeOrg.address ?? '');
    }
  }, [activeOrg]);

  const canEdit = canManageOrgSettings(role);

  const handleCopyCode = () => {
    if (!activeOrg) return;
    navigator.clipboard.writeText(activeOrg.church_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeOrg) return;
    setError(null);
    setSaving(true);
    try {
      await updateOrganization(activeOrg.id, {
        name,
        address,
        slug: generateSlug(name),
      });
      await refreshMemberships(); 
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save changes.';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (!activeOrg) return null;

  return (
    <div className="max-w-4xl mx-auto w-full space-y-5 pb-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-main tracking-tight">Organization Settings</h1>
        <p className="text-muted mt-1 text-sm">
          Manage {activeOrg.name}'s details, member access, and workspace appearance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6">
        
        {/* Left Column: Forms & Primary Settings */}
        <div className="md:col-span-7 space-y-5">
          
          {/* General Information Card */}
          <div className="bg-surface border border-subtle rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-subtle bg-app/30 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
                <Building className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-main">Church Details</h2>
                <p className="text-xs text-muted">Update your organization's core information</p>
              </div>
            </div>
            
            <div className="p-5">
              {error && (
                <div className="flex items-start gap-2 p-3 mb-4 text-xs rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                  <span className="leading-snug">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-main mb-1">
                    Church Name
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!canEdit}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-app border border-subtle rounded-lg text-sm text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="Enter church name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-main mb-1">
                    Address <span className="text-muted font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-app border border-subtle rounded-lg text-sm text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="e.g., 123 Faith Avenue"
                  />
                </div>
                
                {canEdit && (
                  <div className="pt-1.5 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving || (!name.trim())}
                      className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {saving ? (
                        <>
                          <Spinner size="sm" className="text-white" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Code & Appearance */}
        <div className="md:col-span-5 space-y-5">
          
          {/* Member Invitation Code Card */}
          <div className="bg-surface border border-subtle rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-subtle bg-app/30 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-main">Member Access</h2>
                <p className="text-xs text-muted">Invite members to your workspace</p>
              </div>
            </div>
            
            <div className="p-5 space-y-3.5">
              <p className="text-xs text-main leading-relaxed">
                Share this unique code with your congregation so they can join your workspace during sign-up.
              </p>
              
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-app border border-subtle">
                <span className="font-mono text-base font-bold tracking-wider text-brand-600 dark:text-brand-400 ml-1.5">
                  {activeOrg.church_code}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    copied 
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-surface hover:bg-slate-100 dark:hover:bg-slate-800 border border-subtle text-main'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* Appearance Card */}
          <div className="bg-surface border border-subtle rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-subtle bg-app/30 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-main">Appearance</h2>
                <p className="text-xs text-muted">Customize your experience</p>
              </div>
            </div>
            
            <div className="p-5 space-y-5">
              
              {/* Theme Toggle Component */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-semibold text-muted uppercase tracking-wider">
                  Interface Theme
                </label>
                <ThemeToggle />
              </div>

              <div className="h-px w-full bg-subtle" />

              {/* Accent Picker Component */}
              <AccentPicker />

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}