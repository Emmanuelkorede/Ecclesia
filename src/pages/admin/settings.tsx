import { useState, useEffect } from 'react';
import { useActiveOrg } from '../../hooks/useActiveOrg';
import { generateSlug } from '../../utils/orgHelpers';
import { updateOrganization } from '../../services/orgService';
import { canManageOrgSettings } from '../../utils/permissions';
import { Copy, Check } from 'lucide-react';

export default function SettingsPage() {
  const { activeOrg, role, refreshMemberships } = useActiveOrg();
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
      await refreshMemberships(); // re-pulls org data so the UI reflects the change
    } catch (err: any) {
      setError(err.message ?? 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (!activeOrg) return null;

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-2xl font-semibold text-[var(--text-main)]">Settings</h1>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
        <p className="text-sm text-[var(--text-muted)] mb-2">Your church code</p>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xl font-bold text-[var(--text-main)] tracking-wider">
            {activeOrg.church_code}
          </span>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1 text-xs text-brand-600 hover:underline"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-2">
          Share this code with members so they can join your church.
        </p>
      </div>

      {canEdit && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
          <h2 className="font-semibold text-[var(--text-main)] mb-4">Church details</h2>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/40 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Church name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg px-5 py-2.5 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}