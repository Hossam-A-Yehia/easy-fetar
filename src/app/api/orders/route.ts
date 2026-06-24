import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { parseOrderPayload } from "@/lib/order-validation";
import {
  rowToStoredOrder,
  type EmployeeOrderRow,
} from "@/lib/orders-db-map";
import { clearAllOrdersInDb } from "@/lib/clear-all-orders";

export const runtime = "nodejs";

function sortOrdersArabic(a: { employee_name: string }, b: { employee_name: string }) {
  return a.employee_name.localeCompare(b.employee_name, "ar");
}

export async function GET() {
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

  const { data: rows, error } = await admin
    .from("employee_orders")
    .select("id,employee_slug,employee_name,lines,notes,updated_at");

  if (error) {
    return NextResponse.json(
      { ok: false, code: "fetch_failed", detail: error.message },
      { status: 500 },
    );
  }

  const list = (rows ?? []) as EmployeeOrderRow[];
  list.sort(sortOrdersArabic);

  const orders = list
    .map(rowToStoredOrder)
    .filter((o): o is NonNullable<typeof o> => o !== null);

  return NextResponse.json({ ok: true, orders });
}

export async function POST(req: Request) {
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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, code: "bad_json" }, { status: 400 });
  }

  const payload = parseOrderPayload(body);
  if (!payload) {
    return NextResponse.json({ ok: false, code: "invalid_payload" }, { status: 400 });
  }

  const { data: rows, error } = await admin
    .from("employee_orders")
    .upsert(
      {
        employee_slug: payload.employeeSlug,
        employee_name: payload.employeeName,
        lines: payload.lines,
        notes: payload.notes,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "employee_slug" },
    )
    .select("id,employee_slug,employee_name,lines,notes,updated_at");

  if (error) {
    console.error("[api/orders POST]", error.code, error.message, error.details);
    return NextResponse.json(
      {
        ok: false,
        code: "upsert_failed",
        detail: error.message,
        hint:
          error.code === "42501" || /permission denied/i.test(error.message)
            ? "جرّب تشغيل أوامر GRANT في schema-employee-orders.sql على Supabase."
            : undefined,
      },
      { status: 500 },
    );
  }

  const row = rows?.[0];
  if (!row) {
    return NextResponse.json(
      {
        ok: false,
        code: "upsert_empty",
        detail:
          "ما رجّعتش الصف بعد الحفظ — غالبًا الجدول employee_orders مش موجود أو الاسكيمة مختلفة.",
      },
      { status: 500 },
    );
  }

  const order = rowToStoredOrder(row as EmployeeOrderRow);
  if (!order) {
    return NextResponse.json({ ok: false, code: "invalid_row" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, order });
}

export async function DELETE() {
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

  return NextResponse.json({ ok: true });
}
