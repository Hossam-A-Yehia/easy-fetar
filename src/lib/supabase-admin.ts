import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** للسيرفر فقط — لا تُعرَّف المفتاح في الكود الأمامي */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}
