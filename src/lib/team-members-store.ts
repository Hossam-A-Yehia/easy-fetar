"use client";

import type { Employee } from "@/types";
import {
  EMPLOYEES as BUILTIN_EMPLOYEES,
} from "@/data/employees";
import { fetchAllGuestTeamMembers } from "@/lib/guest-team-db";
import { isSupabaseConfigured } from "@/lib/supabase";
import { makeGuestMemberSlug } from "@/lib/guest-slug";
import { resolveBuiltinForDisplay } from "@/lib/employee-overrides";

const STORAGE_KEY = "izi-futar-guest-team-v1";

function parseList(raw: string | null): Employee[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    const out: Employee[] = [];
    for (const item of v) {
      if (!item || typeof item !== "object") continue;
      const o = item as Record<string, unknown>;
      const id = typeof o.id === "string" ? o.id : "";
      const slug = typeof o.slug === "string" ? o.slug : "";
      const name = typeof o.name === "string" ? o.name : "";
      let imageUrl: string | null = null;
      if (o.imageUrl === null) imageUrl = null;
      else if (typeof o.imageUrl === "string") imageUrl = o.imageUrl;
      if (!id || !slug || !name.trim()) continue;
      out.push({ id, slug, name: name.trim(), imageUrl });
    }
    return out;
  } catch {
    return [];
  }
}

function readGuests(): Employee[] {
  if (typeof window === "undefined") return [];
  return parseList(window.localStorage.getItem(STORAGE_KEY));
}

function writeGuests(rows: Employee[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

/** أعضاء مضافين من المتصفح (مش موجودين في قائمة الشركة الثابتة) */
export function getGuestEmployees(): Employee[] {
  return readGuests();
}

export function getGuestBySlug(slug: string): Employee | undefined {
  return readGuests().find((e) => e.slug === slug);
}

/** يدمج الموظفين الأساسيين مع الضيوف؛ الضيوف في الآخر */
export function getAllEmployeesMerged(): Employee[] {
  const seen = new Set<string>();
  const out: Employee[] = [];
  for (const e of BUILTIN_EMPLOYEES) {
    const d = resolveBuiltinForDisplay(e.slug);
    if (!d) continue;
    seen.add(d.slug);
    out.push(d);
  }
  for (const e of readGuests()) {
    if (seen.has(e.slug)) continue;
    seen.add(e.slug);
    out.push(e);
  }
  return out;
}

/** دمج الموظفين + ضيوف Supabase + ضيوف localStorage (بدون تكرار slug) */
export async function getAllEmployeesMergedAsync(): Promise<Employee[]> {
  const remote = isSupabaseConfigured()
    ? await fetchAllGuestTeamMembers()
    : [];
  const local = readGuests();
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
  for (const e of local) {
    if (seen.has(e.slug)) continue;
    seen.add(e.slug);
    out.push(e);
  }
  return out;
}

export function resolveEmployeeSlug(slug: string): Employee | undefined {
  return resolveBuiltinForDisplay(slug) ?? getGuestBySlug(slug);
}

/**
 * إضافة اسم جديد وفتح صفحة الأوردر عليه؛ التخزين محليًا في المتصفح.
 * slug فريد عشان أسماء عربية من غير Transliteration سليمة.
 */
export function addGuestEmployee(
  displayName: string,
  imageUrl: string | null = null,
): Employee {
  const name = displayName.trim();
  if (!name) {
    throw new Error("EMPTY_NAME");
  }
  const slug = makeGuestMemberSlug(name);

  const row: Employee = {
    id: `guest:${crypto.randomUUID()}`,
    slug,
    name,
    imageUrl,
  };

  const list = readGuests();
  list.push(row);
  writeGuests(list);
  return row;
}

/** حذف ضيف من التخزين المحلي (بعد حذفه من السيرفر أو لو محلي فقط) */
export function removeGuestFromLocalStorage(slug: string): void {
  const list = readGuests().filter((e) => e.slug !== slug);
  writeGuests(list);
}

/** تحديث جزئي لضيف محلي (مثلاً لو السيرفر 503) */
export function patchGuestInLocalStorage(
  slug: string,
  patch: Partial<Pick<Employee, "name" | "imageUrl">>,
): Employee | null {
  const list = readGuests();
  const i = list.findIndex((e) => e.slug === slug);
  if (i < 0) return null;
  list[i] = { ...list[i], ...patch };
  writeGuests(list);
  return list[i];
}

/** يحدّث أو يضيف صف ضيف للتخزين المحلي (بعد نجاح API مثلاً) */
export function saveGuestToLocalStorage(row: Employee): void {
  const list = readGuests();
  const i = list.findIndex((e) => e.slug === row.slug);
  if (i >= 0) list[i] = row;
  else list.push(row);
  writeGuests(list);
}
