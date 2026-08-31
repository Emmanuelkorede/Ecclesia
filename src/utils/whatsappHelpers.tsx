
export function buildWhatsAppLink(phoneE164: string, message: string): string {
  // WhatsApp's URL format wants the number WITHOUT the leading '+'
  const cleanPhone = phoneE164.replace('+', '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}