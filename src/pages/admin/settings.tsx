import React, { useState, useEffect } from 'react';
import { useActiveOrg } from '../../hooks/useActiveOrg';
import { generateSlug } from '../../utils/orgHelpers';
import { updateOrganization } from '../../services/orgService';
import { canManageOrgSettings } from '../../utils/permissions';
import LogoUploader from '../../components/settings/logoUploader';

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
    <div className="max-w-5xl mx-auto w-full space-y-6 animate-in fade-in duration-300 pb-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-main tracking-tight">Organization Settings</h1>
        <p className="text-muted mt-1 text-sm">
          Manage {activeOrg.name}'s details, member access, and workspace appearance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: General Settings Form */}
        <div className="space-y-6">
          <div className="bg-surface border border-subtle rounded-xl shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-3 border-b border-subtle pb-4">
              <div className="w-9 h-9 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center shrink-0 border border-brand-500/20">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-main leading-tight">Church Details</h2>
                <p className="text-xs text-muted mt-0.5">Update your organization's core information</p>
              </div>
            </div>

            <div className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-xs font-medium animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-main">
                    Church Name
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!canEdit}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter church name"
                    className="w-full px-3 py-2 bg-app border border-subtle rounded-lg text-sm text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all placeholder:text-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-main">
                    Address <span className="text-muted font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g., 123 Faith Avenue"
                    className="w-full px-3 py-2 bg-app border border-subtle rounded-lg text-sm text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all placeholder:text-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {canEdit && (
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={saving || !name.trim()}
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
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

        {/* Right Column: Code, Logo & Appearance */}
        <div className="space-y-6">
          {/* Member Access Card */}
          <div className="bg-surface border border-subtle rounded-xl shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-3 border-b border-subtle pb-4">
              <div className="w-9 h-9 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center shrink-0 border border-brand-500/20">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-main leading-tight">Member Access</h2>
                <p className="text-xs text-muted mt-0.5">Invite members to your workspace</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-muted leading-relaxed">
                Share this unique code with your congregation so they can join your workspace during sign-up.
              </p>

              <div className="flex items-center justify-between gap-3 p-2.5 bg-app border border-subtle rounded-lg">
                <span className="font-mono text-sm font-bold text-main tracking-wider pl-1">
                  {activeOrg.church_code}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 bg-surface hover:bg-subtle border border-subtle text-main rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-muted" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Logo Uploader */}
          <LogoUploader
            orgId={activeOrg.id}
            currentLogoUrl={activeOrg.logo_url}
            canEdit={canEdit}
            onUploaded={() => refreshMemberships()}
          />

          {/* Appearance Card */}
          <div className="bg-surface border border-subtle rounded-xl shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-3 border-b border-subtle pb-4">
              <div className="w-9 h-9 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center shrink-0 border border-brand-500/20">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-main leading-tight">Appearance</h2>
                <p className="text-xs text-muted mt-0.5">Customize your experience</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between gap-4">
                <label className="text-xs font-semibold text-main">
                  Interface Theme
                </label>
                <ThemeToggle />
              </div>

              <div className="h-px bg-subtle" />

              {/* Accent Picker */}
              <div className="space-y-2">
                <AccentPicker />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}