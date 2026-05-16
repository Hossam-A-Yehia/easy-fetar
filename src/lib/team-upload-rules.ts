export const TEAM_PHOTO_MAX_BYTES = 3 * 1024 * 1024;

export const TEAM_PHOTO_ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export function extFromMime(mime: string): string {
  if (mime === "image/jpeg") return "jpg";
  const sub = mime.split("/")[1];
  return sub && sub !== "jpeg" ? sub : "jpg";
}
