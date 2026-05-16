import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
  extFromMime,
  TEAM_PHOTO_ALLOWED_TYPES,
  TEAM_PHOTO_MAX_BYTES,
} from "@/lib/team-upload-rules";
import { withImageCacheBust } from "@/lib/team-image-display";
import { teamAvatarPathFromPublicUrl } from "@/lib/supabase-storage-path";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ slug: string }> };

export async function DELETE(_req: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  const decoded = decodeURIComponent(slug);
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ ok: false, code: "not_configured" }, { status: 503 });
  }

  const { data: row, error: selErr } = await admin
    .from("guest_team_members")
    .select("image_url")
    .eq("slug", decoded)
    .maybeSingle();

  if (selErr) {
    return NextResponse.json(
      { ok: false, code: "read_failed", detail: selErr.message },
      { status: 500 },
    );
  }
  if (!row) {
    return NextResponse.json({ ok: false, code: "not_found" }, { status: 404 });
  }

  const path = teamAvatarPathFromPublicUrl(row.image_url);
  if (path) {
    await admin.storage.from("team-avatars").remove([path]);
  }

  const { error: delErr } = await admin
    .from("guest_team_members")
    .delete()
    .eq("slug", decoded);

  if (delErr) {
    return NextResponse.json(
      { ok: false, code: "delete_failed", detail: delErr.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  const decoded = decodeURIComponent(slug);
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

  const name = String(form.get("name") ?? "").trim();
  if (!name) {
    return NextResponse.json({ ok: false, code: "empty_name" }, { status: 400 });
  }

  const clearPhoto = String(form.get("clearPhoto") ?? "") === "1";
  const file = form.get("photo");

  const { data: current, error: selErr } = await admin
    .from("guest_team_members")
    .select("id,slug,name,image_url")
    .eq("slug", decoded)
    .maybeSingle();

  if (selErr) {
    return NextResponse.json(
      { ok: false, code: "read_failed", detail: selErr.message },
      { status: 500 },
    );
  }
  if (!current) {
    return NextResponse.json({ ok: false, code: "not_found" }, { status: 404 });
  }

  let imageUrl: string | null = current.image_url;

  const removeStored = async (url: string | null) => {
    const p = teamAvatarPathFromPublicUrl(url);
    if (p) await admin.storage.from("team-avatars").remove([p]);
  };

  if (clearPhoto) {
    await removeStored(current.image_url);
    imageUrl = null;
  }

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

    await removeStored(imageUrl);

    const ext = extFromMime(mime);
    const path = `${decoded}.${ext}`;
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

  const { data: updated, error: upRowErr } = await admin
    .from("guest_team_members")
    .update({ name, image_url: imageUrl })
    .eq("slug", decoded)
    .select("id,slug,name,image_url,created_at")
    .single();

  if (upRowErr || !updated) {
    return NextResponse.json(
      { ok: false, code: "update_failed", detail: upRowErr?.message },
      { status: 500 },
    );
  }

  const responseBust = new Date().toISOString();

  return NextResponse.json({
    ok: true,
    employee: {
      id: updated.id,
      slug: updated.slug,
      name: updated.name,
      imageUrl: withImageCacheBust(updated.image_url, responseBust),
    },
  });
}
