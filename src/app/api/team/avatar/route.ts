import { NextResponse } from "next/server";
import { isBuiltinEmployeeSlug } from "@/data/employees";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
  extFromMime,
  TEAM_PHOTO_ALLOWED_TYPES,
  TEAM_PHOTO_MAX_BYTES,
} from "@/lib/team-upload-rules";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ ok: false, code: "not_configured" }, { status: 503 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, code: "bad_form" }, { status: 400 });
  }

  const slug = String(form.get("slug") ?? "").trim();
  const file = form.get("file");

  if (!slug || !isBuiltinEmployeeSlug(slug)) {
    return NextResponse.json({ ok: false, code: "bad_slug" }, { status: 400 });
  }
  if (!(file instanceof File) || file.size <= 0) {
    return NextResponse.json({ ok: false, code: "no_file" }, { status: 400 });
  }
  if (file.size > TEAM_PHOTO_MAX_BYTES) {
    return NextResponse.json({ ok: false, code: "file_too_large" }, { status: 400 });
  }
  const mime = file.type || "application/octet-stream";
  if (!TEAM_PHOTO_ALLOWED_TYPES.has(mime)) {
    return NextResponse.json({ ok: false, code: "bad_type" }, { status: 400 });
  }

  const ext = extFromMime(mime);
  const path = `override-${slug}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  const { error: upErr } = await admin.storage
    .from("team-avatars")
    .upload(path, buf, { contentType: mime, upsert: true });
  if (upErr) {
    return NextResponse.json(
      { ok: false, code: "upload_failed", detail: upErr.message },
      { status: 500 },
    );
  }
  const { data: pub } = admin.storage.from("team-avatars").getPublicUrl(path);
  return NextResponse.json({ ok: true, url: pub.publicUrl });
}
