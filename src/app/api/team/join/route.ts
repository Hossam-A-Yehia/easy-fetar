import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { makeGuestMemberSlug } from "@/lib/guest-slug";
import {
  extFromMime,
  TEAM_PHOTO_ALLOWED_TYPES,
  TEAM_PHOTO_MAX_BYTES,
} from "@/lib/team-upload-rules";
import { withImageCacheBust } from "@/lib/team-image-display";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { ok: false, code: "not_configured" },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { ok: false, code: "bad_form" },
      { status: 400 },
    );
  }

  const name = String(form.get("name") ?? "").trim();
  if (!name) {
    return NextResponse.json({ ok: false, code: "empty_name" }, { status: 400 });
  }

  const file = form.get("photo");
  let imageUrl: string | null = null;

  if (file instanceof File && file.size > 0) {
    if (file.size > TEAM_PHOTO_MAX_BYTES) {
      return NextResponse.json(
        { ok: false, code: "file_too_large" },
        { status: 400 },
      );
    }
    const mime = file.type || "application/octet-stream";
    if (!TEAM_PHOTO_ALLOWED_TYPES.has(mime)) {
      return NextResponse.json({ ok: false, code: "bad_type" }, { status: 400 });
    }
  }

  const slug = makeGuestMemberSlug(name);

  if (file instanceof File && file.size > 0) {
    const mime = file.type;
    const ext = extFromMime(mime);
    const path = `${slug}.${ext}`;
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
    imageUrl = pub.publicUrl;
  }

  const { data: row, error: insErr } = await admin
    .from("guest_team_members")
    .insert({ slug, name, image_url: imageUrl })
    .select("id,slug,name,image_url,created_at")
    .single();

  if (insErr || !row) {
    return NextResponse.json(
      { ok: false, code: "insert_failed", detail: insErr?.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    employee: {
      id: row.id,
      slug: row.slug,
      name: row.name,
      imageUrl: withImageCacheBust(row.image_url, row.created_at),
    },
  });
}
