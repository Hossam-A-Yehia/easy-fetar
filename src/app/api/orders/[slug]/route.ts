import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
  rowToStoredOrder,
  type EmployeeOrderRow,
} from "@/lib/orders-db-map";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { ok: false, code: "not_configured" },
      { status: 503 },
    );
  }

  const { slug: rawSlug } = await ctx.params;
  const slug = decodeURIComponent(rawSlug ?? "").trim();
  if (!slug) {
    return NextResponse.json({ ok: false, code: "missing_slug" }, { status: 400 });
  }

  const { data: row, error } = await admin
    .from("employee_orders")
    .select("id,employee_slug,employee_name,lines,notes,updated_at")
    .eq("employee_slug", slug)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { ok: false, code: "fetch_failed", detail: error.message },
      { status: 500 },
    );
  }

  if (!row) {
    return NextResponse.json({ ok: true, order: null });
  }

  const order = rowToStoredOrder(row as EmployeeOrderRow);
  return NextResponse.json({
    ok: true,
    order: order ?? null,
  });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { ok: false, code: "not_configured" },
      { status: 503 },
    );
  }

  const { slug: rawSlug } = await ctx.params;
  const slug = decodeURIComponent(rawSlug ?? "").trim();
  if (!slug) {
    return NextResponse.json({ ok: false, code: "missing_slug" }, { status: 400 });
  }

  const { error } = await admin
    .from("employee_orders")
    .delete()
    .eq("employee_slug", slug);

  if (error) {
    return NextResponse.json(
      { ok: false, code: "delete_failed", detail: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
