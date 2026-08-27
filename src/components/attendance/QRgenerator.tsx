import { QRCodeSVG } from 'qrcode.react';

interface Props {
  qrToken: string;
  size?: number;
}

export default function QRGenerator({ qrToken, size = 220 }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-surface border border-subtle rounded-2xl text-center shadow-sm">
      {/* High-contrast container ensures scanner readability in dark mode */}
      <div className="p-4 bg-white rounded-xl shadow-inner border border-subtle/50 flex items-center justify-center">
        <QRCodeSVG value={qrToken} size={size} level="M" />
      </div>
      <div className="space-y-0.5">
        <p className="text-xs font-semibold text-main">Passcode QR Code</p>
        <p className="text-xs text-muted">Scan to mark event attendance</p>
      </div>
    </div>
  );
}