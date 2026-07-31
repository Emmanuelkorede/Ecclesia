import { QRCodeSVG } from 'qrcode.react';

interface Props {
  qrToken: string;
  size?: number;
}

// The token is just a string — this component doesn't decide the URL
// scheme, it just encodes whatever it's given. QRScanner reads this
// same raw string back out and passes it to checkInWithQr().
export default function QRGenerator({ qrToken, size = 220 }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 bg-white p-6 rounded-2xl border border-[var(--border-subtle)]">
      <QRCodeSVG value={qrToken} size={size} level="M" />
      <p className="text-xs text-slate-500">Scan to check in</p>
    </div>
  );
}