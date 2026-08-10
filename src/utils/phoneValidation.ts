const NIGERIAN_LOCAL_REGEX = /^0(70|71|80|81|90|91|701|702|703|704|705|706|707|708|709)\d{7,8}$/;

export function isValidNigerianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s|-/g, '');
  return NIGERIAN_LOCAL_REGEX.test(cleaned) && cleaned.length === 11;
}

export function normalizeNigerianPhone(phone: string): string {
  const cleaned = phone.replace(/\s|-/g, '');
  if (cleaned.startsWith('0')) {
    return `+234${cleaned.slice(1)}`;
  }
  if (cleaned.startsWith('+234')) {
    return cleaned;
  }
  return cleaned;
}

// NEW — reverses normalizeNigerianPhone, for pre-filling edit forms
// with the local format users actually recognize/typed originally.
export function denormalizeNigerianPhone(e164Phone: string): string {
  if (e164Phone.startsWith('+234')) {
    return `0${e164Phone.slice(4)}`;
  }
  return e164Phone;
}