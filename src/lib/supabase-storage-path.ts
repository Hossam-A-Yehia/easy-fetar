/** يستخرج مسار الملف داخل باكت team-avatars من رابط العلانية */
export function teamAvatarPathFromPublicUrl(url: string | null): string | null {
  if (!url) return null;
  const withoutQuery = url.split("?")[0];
  const marker = "/object/public/team-avatars/";
  const i = withoutQuery.indexOf(marker);
  if (i === -1) return null;
  return decodeURIComponent(withoutQuery.slice(i + marker.length));
}
