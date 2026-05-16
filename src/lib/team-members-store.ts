"use client";

import type { Employee } from "@/types";
import { EMPLOYEES as BUILTIN_EMPLOYEES } from "@/data/employees";
import { fetchAllGuestTeamMembers } from "@/lib/guest-team-db";
import { isSupabaseConfigured } from "@/lib/supabase";
import { resolveBuiltinForDisplay } from "@/lib/employee-overrides";

/** دمج الموظفين الأساسيين مع ضيوف Supabase (بدون تكرار slug) */
export async function getAllEmployeesMergedAsync(): Promise<Employee[]> {
  const remote = isSupabaseConfigured()
    ? await fetchAllGuestTeamMembers()
    : [];
  const seen = new Set<string>();
  const out: Employee[] = [];
  for (const e of BUILTIN_EMPLOYEES) {
    const d = resolveBuiltinForDisplay(e.slug);
    if (!d) continue;
    seen.add(d.slug);
    out.push(d);
  }
  for (const e of remote) {
    if (seen.has(e.slug)) continue;
    seen.add(e.slug);
    out.push(e);
  }
  return out;
}
