// Nigerian Naira currency formatting — used on BillingPage/subscription history
export function formatCurrency(amount: number, currency: string = 'NGN'): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

// "John Doe" → "JD" — used as Avatar fallback when no avatar_url exists
export function getInitials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

// "super_admin" → "Super Admin" — used anywhere a raw role/status enum
// needs to display nicely in the UI instead of showing the raw snake_case
export function formatEnumLabel(value: string): string {
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Truncates long text with ellipsis — for announcement previews, sermon descriptions
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

// "08122865246" — light display formatting for showing phone numbers back
// to the user in a readable way (not for storage, storage stays E.164)
export function formatPhoneForDisplay(e164Phone: string): string {
  // +2348122865246 -> 0812 286 5246
  const local = e164Phone.startsWith('+234') ? `0${e164Phone.slice(4)}` : e164Phone;
  if (local.length !== 11) return local;
  return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7)}`;
}

// Generates initials-based deterministic background color for Avatar
// fallback, so the same person always gets the same color
export function getAvatarColor(fullName: string): string {
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#0d9488', '#ef4444'];
  const charCodeSum = fullName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[charCodeSum % colors.length];
}