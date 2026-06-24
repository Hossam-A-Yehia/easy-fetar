import { NextResponse } from "next/server";
import { clearAllOrdersInDb } from "@/lib/clear-all-orders";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return process.env.NODE_ENV !== "production";
  }

  const auth = request.headers.get("authorization");
  return auth === `Bearer ${cronSecret}`;
}

/** يُستدعى يوميًا الساعة 10 مساءً بتوقيت مصر (20:00 UTC) */
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, code: "unauthorized" }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      {
        ok: false,
        code: "not_configured",
        detail:
          "NEXT_PUBLIC_SUPABASE_URL أو SUPABASE_SERVICE_ROLE_KEY غير متوفّرين في بيئة السيرفر.",
      },
      { status: 503 },
    );
  }

  const result = await clearAllOrdersInDb(admin);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, code: "delete_failed", detail: result.detail },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    clearedAt: new Date().toISOString(),
    timezone: "Africa/Cairo",
    schedule: "daily 22:00",
  });
}
