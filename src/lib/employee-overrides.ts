"use client";

import { EMPLOYEES, isBuiltinEmployeeSlug } from "@/data/employees";
import type { Employee } from "@/types";
import { emitTeamChanged } from "@/lib/team-events";

const HIDDEN_KEY = "izi-futar-builtin-hidden-v1";
const OVERRIDES_KEY = "izi-futar-builtin-overrides-v1";

export type BuiltinOverride = {
  name?: string;
  imageUrl?: string | null;
};

function parseHidden(raw: string | null): Set<string> {
  if (!raw) return new Set();
  try {
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return new Set();
    return new Set(v.filter((x): x is string => typeof x === "string"));
  } catch {
    return new Set();
  }
}

function readHiddenSet(): Set<string> {
  if (typeof window === "undefined") return new Set();
  return parseHidden(window.localStorage.getItem(HIDDEN_KEY));
}

function writeHiddenSet(s: Set<string>): void {
  window.localStorage.setItem(HIDDEN_KEY, JSON.stringify([...s]));
}

export function isHiddenBuiltinSlug(slug: string): boolean {
  return readHiddenSet().has(slug);
}

export function hideBuiltinSlug(slug: string): void {
  if (!isBuiltinEmployeeSlug(slug)) return;
  const s = readHiddenSet();
  s.add(slug);
  writeHiddenSet(s);
  emitTeamChanged();
}

export function unhideBuiltinSlug(slug: string): void {
  const s = readHiddenSet();
  if (!s.has(slug)) return;
  s.delete(slug);
  writeHiddenSet(s);
  emitTeamChanged();
}

export function getHiddenBuiltinSlugs(): string[] {
  return [...readHiddenSet()].filter(isBuiltinEmployeeSlug);
}

function parseOverrides(raw: string | null): Record<string, BuiltinOverride> {
  if (!raw) return {};
  try {
    const v = JSON.parse(raw) as unknown;
    if (!v || typeof v !== "object") return {};
    const out: Record<string, BuiltinOverride> = {};
    for (const [slug, val] of Object.entries(v as Record<string, unknown>)) {
      if (!val || typeof val !== "object") continue;
      const o = val as Record<string, unknown>;
      const patch: BuiltinOverride = {};
      if (typeof o.name === "string") patch.name = o.name;
      if (o.imageUrl === null) patch.imageUrl = null;
      else if (typeof o.imageUrl === "string") patch.imageUrl = o.imageUrl;
      if (Object.keys(patch).length) out[slug] = patch;
    }
    return out;
  } catch {
    return {};
  }
}

function readOverrides(): Record<string, BuiltinOverride> {
  if (typeof window === "undefined") return {};
  return parseOverrides(window.localStorage.getItem(OVERRIDES_KEY));
}

function writeOverrides(m: Record<string, BuiltinOverride>): void {
  window.localStorage.setItem(OVERRIDES_KEY, JSON.stringify(m));
}

export function getBuiltinOverride(slug: string): BuiltinOverride | undefined {
  return readOverrides()[slug];
}

export function setBuiltinOverride(slug: string, patch: BuiltinOverride): void {
  if (!isBuiltinEmployeeSlug(slug)) return;
  const m = readOverrides();
  const prev = m[slug] ?? {};
  const next = { ...prev, ...patch };
  if (next.name === undefined && next.imageUrl === undefined) {
    delete m[slug];
  } else {
    m[slug] = next;
  }
  writeOverrides(m);
  emitTeamChanged();
}

export function clearBuiltinOverride(slug: string): void {
  const m = readOverrides();
  if (!(slug in m)) return;
  delete m[slug];
  writeOverrides(m);
  emitTeamChanged();
}

/** موظف أساسي بعد إخفاء المخفيين وتطبيق التعديلات المحلية */
export function resolveBuiltinForDisplay(slug: string): Employee | undefined {
  const row = EMPLOYEES.find((e) => e.slug === slug);
  if (!row) return undefined;
  if (!row) return undefined;
  if (isHiddenBuiltinSlug(slug)) return undefined;
  const o = getBuiltinOverride(slug);
  if (!o) return row;
  return {
    ...row,
    name: o.name ?? row.name,
    imageUrl:
      o.imageUrl !== undefined ? o.imageUrl : row.imageUrl,
  };
}

export function hiddenBuiltinDisplayName(slug: string): string {
  const row = EMPLOYEES.find((e) => e.slug === slug);
  return row?.name ?? slug;
}
