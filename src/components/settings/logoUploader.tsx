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
    } catch (err: any) {
      setError(err.message ?? 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-surface border border-subtle rounded-xl overflow-hidden shadow-sm">
      <div className="px-5 py-3.5 border-b border-subtle bg-app/30 flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <ImageIcon className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-main">Church Logo</h2>
          <p className="text-xs text-muted">Shown across the app and in push notifications</p>
        </div>
      </div>

      <div className="p-5 space-y-3.5">
        {error && (
          <div className="flex items-start gap-2 p-3 text-xs rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-app border border-subtle flex items-center justify-center overflow-hidden shrink-0">
            {currentLogoUrl ? (
              <img src={currentLogoUrl} alt="Church logo" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-6 h-6 text-muted" />
            )}
          </div>

          {canEdit && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-surface hover:bg-slate-100 dark:hover:bg-slate-800 border border-subtle text-main text-xs font-medium rounded-lg cursor-pointer transition-colors"
              >
                {uploading ? (
                  <>
                    <Spinner size="sm" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>{currentLogoUrl ? 'Change logo' : 'Upload logo'}</span>
                  </>
                )}
              </label>
              <p className="text-[10px] text-muted mt-1.5">PNG or JPG, up to 2MB</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}