import { useState, useRef } from 'react';
import { uploadChurchLogo } from '../../services/orgService';
import { Image as ImageIcon, Upload, AlertCircle } from 'lucide-react';
import { Spinner } from '../ui/Spinner';

interface Props {
  orgId: string;
  currentLogoUrl: string | null;
  canEdit: boolean;
  onUploaded: (url: string) => void;
}

export default function LogoUploader({ orgId, currentLogoUrl, canEdit, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be under 2MB.');
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const url = await uploadChurchLogo(orgId, file);
      onUploaded(url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setError(message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-surface border border-subtle rounded-xl shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-subtle pb-4">
        <div className="w-9 h-9 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center shrink-0 border border-brand-500/20">
          <ImageIcon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-main leading-tight">Church Logo</h2>
          <p className="text-xs text-muted mt-0.5">Shown across the app and in push notifications</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-xs font-medium animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex items-center gap-4">
          {/* Logo Preview */}
          <div className="relative w-16 h-16 rounded-xl bg-app border border-subtle overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
            {currentLogoUrl ? (
              <img src={currentLogoUrl} alt="Church logo" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-7 h-7 text-muted" />
            )}
          </div>

          {/* Upload Controls */}
          {canEdit && (
            <div className="space-y-1.5 flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                id="logo-upload"
                disabled={uploading}
                className="hidden"
              />
              <label
                htmlFor="logo-upload"
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 bg-app hover:bg-subtle border border-subtle text-main font-semibold text-xs rounded-lg cursor-pointer transition-colors shadow-sm select-none ${
                  uploading ? 'opacity-60 pointer-events-none' : ''
                }`}
              >
                {uploading ? (
                  <>
                    <Spinner size="sm" className="text-brand-500" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5 text-muted" />
                    <span>{currentLogoUrl ? 'Change logo' : 'Upload logo'}</span>
                  </>
                )}
              </label>
              <p className="text-[11px] text-muted">PNG or JPG, up to 2MB</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}