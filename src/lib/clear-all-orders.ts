import type { SupabaseClient } from "@supabase/supabase-js";

export async function clearAllOrdersInDb(
  admin: SupabaseClient,
): Promise<{ ok: true } | { ok: false; detail: string }> {
  const { error } = await admin
    .from("employee_orders")
    .delete()
    .neq("employee_slug", "");

  if (error) {
    return { ok: false, detail: error.message };
  }

  return { ok: true };
}
