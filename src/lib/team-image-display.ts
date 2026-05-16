/** يكسر كاش المتصفح/Next عند نفس مسار الملف بعد استبدال الصورة */
export function withImageCacheBust(
  url: string | null,
  revisionIso: string | null | undefined,
): string | null {
  if (!url) return null;
  if (!revisionIso) return url;
  const ms = new Date(revisionIso).getTime();
  if (!Number.isFinite(ms)) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}v=${ms}`;
}
