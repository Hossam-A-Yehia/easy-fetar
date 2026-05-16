/** slug آمن للتخزين والمسارات (أسماء عربية → فارغ، فنضيف member-) */
export function slugifyAscii(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function randomSuffix(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().slice(0, 8);
  }
  return Math.random().toString(36).slice(2, 10);
}

export function makeGuestMemberSlug(displayName: string): string {
  let base = slugifyAscii(displayName);
  if (!base) base = "member";
  return `${base}-${randomSuffix()}`;
}
