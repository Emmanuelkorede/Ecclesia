// The random suffix guarantees uniqueness even if two churches share a name,
export function generateSlug(churchName: string): string {
  const base = churchName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // strip anything that isn't a letter/number/space/dash
    .replace(/\s+/g, '-');         // spaces become dashes

  const randomSuffix = Math.random().toString(36).slice(2, 6); // 4 random chars
  return `${base}-${randomSuffix}`;
}

// Generates a short human-friendly code members will type to join,
export function generateChurchCode(): string {
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CH-${randomPart}`;
}