// Nigerian mobile numbers: 11 digits starting with 0, followed by a valid
// network prefix. Covers all major Nigerian networks (MTN, Glo, Airtel, 9mobile).
const NIGERIAN_LOCAL_REGEX = /^0(70|71|80|81|90|91|701|702|703|704|705|706|707|708|709)\d{7,8}$/;

export function isValidNigerianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s|-/g, ''); // strip spaces/dashes if user typed them
  return NIGERIAN_LOCAL_REGEX.test(cleaned) && cleaned.length === 11;
}

// Converts local format (08122865246) to E.164 format (+2348122865246)
export function normalizeNigerianPhone(phone: string): string {
  const cleaned = phone.replace(/\s|-/g, '');
  if (cleaned.startsWith('0')) {
    return `+234${cleaned.slice(1)}`;
  }
  if (cleaned.startsWith('+234')) {
    return cleaned;
  }
  return cleaned; // fallback, shouldn't reach here if validated first
}