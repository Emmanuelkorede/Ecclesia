// 4-6 digit numeric passcode for attendance check-in
export function generatePasscode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString().slice(0, 6);
}

// Random token used to build the QR code payload (a URL or encoded string
// your QRGenerator/QRScanner components will use later)
export function generateQrToken(): string {
  return crypto.randomUUID();
}