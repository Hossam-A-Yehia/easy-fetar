"use client";

import type { OrderPayload, OrderLine, StoredOrder } from "@/types";

const STORAGE_KEY_V2 = "izi-futar-orders-v2";
const STORAGE_KEY_V1 = "izi-futar-orders-v1";

function isOrderLine(v: unknown): v is OrderLine {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.menuItemId === "string" &&
    typeof o.menuItemName === "string" &&
    (o.breadType === "shami" || o.breadType === "baladi") &&
    typeof o.quantity === "number" &&
    (o.saladAndTahini === null ||
      o.saladAndTahini === true ||
      o.saladAndTahini === false)
  );
}

function migrateRawOrder(raw: Record<string, unknown>): StoredOrder | null {
  const id = typeof raw.id === "string" ? raw.id : crypto.randomUUID();
  const updatedAt =
    typeof raw.updatedAt === "string"
      ? raw.updatedAt
      : new Date().toISOString();
  const employeeSlug =
    typeof raw.employeeSlug === "string" ? raw.employeeSlug : "";
  const employeeName =
    typeof raw.employeeName === "string" ? raw.employeeName : "";
  const notes = typeof raw.notes === "string" ? raw.notes : "";

  if (!employeeSlug) return null;

  if (Array.isArray(raw.lines)) {
    const lines = raw.lines.filter(isOrderLine);
    if (lines.length === 0) return null;
    return {
      id,
      updatedAt,
      employeeSlug,
      employeeName,
      lines,
      notes,
    };
  }

  const menuItemId = raw.menuItemId;
  const menuItemName = raw.menuItemName;
  const breadType = raw.breadType;
  const quantity = raw.quantity;
  const saladAndTahini = raw.saladAndTahini;

  if (
    typeof menuItemId === "string" &&
    typeof menuItemName === "string" &&
    (breadType === "shami" || breadType === "baladi") &&
    typeof quantity === "number" &&
    quantity >= 1 &&
    (saladAndTahini === null ||
      saladAndTahini === true ||
      saladAndTahini === false)
  ) {
    return {
      id,
      updatedAt,
      employeeSlug,
      employeeName,
      lines: [
        {
          menuItemId,
          menuItemName,
          breadType,
          quantity,
          saladAndTahini,
        },
      ],
      notes,
    };
  }

  return null;
}

function safeParseMap(raw: string | null): Record<string, StoredOrder> {
  if (!raw) return {};
  try {
    const v = JSON.parse(raw) as unknown;
    if (!v || typeof v !== "object") return {};
    const input = v as Record<string, unknown>;
    const out: Record<string, StoredOrder> = {};
    for (const [slug, val] of Object.entries(input)) {
      if (!val || typeof val !== "object") continue;
      const row = migrateRawOrder(val as Record<string, unknown>);
      if (row) out[row.employeeSlug || slug] = row;
    }
    return out;
  } catch {
    return {};
  }
}

function readAll(): Record<string, StoredOrder> {
  if (typeof window === "undefined") return {};

  const v2Raw = window.localStorage.getItem(STORAGE_KEY_V2);
  /** إن وُجد مفتاح v2 (حتى لو `{}`) لا نقرأ v1 حتى لا تُستعاد طلبات بعد «حذف الكل» */
  if (v2Raw !== null) {
    return safeParseMap(v2Raw);
  }

  const fromV1 = safeParseMap(window.localStorage.getItem(STORAGE_KEY_V1));
  if (Object.keys(fromV1).length > 0) {
    window.localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(fromV1));
    return fromV1;
  }

  return {};
}

function writeAll(map: Record<string, StoredOrder>): void {
  window.localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(map));
}

export function getAllOrders(): StoredOrder[] {
  const map = readAll();
  return Object.values(map).sort((a, b) =>
    a.employeeName.localeCompare(b.employeeName, "ar"),
  );
}

export function getOrderForEmployee(slug: string): StoredOrder | undefined {
  return readAll()[slug];
}

export function upsertLocalOrder(payload: OrderPayload): StoredOrder {
  const map = readAll();
  const existing = map[payload.employeeSlug];
  const row: StoredOrder = {
    ...payload,
    id: existing?.id ?? crypto.randomUUID(),
    updatedAt: new Date().toISOString(),
  };
  map[payload.employeeSlug] = row;
  writeAll(map);
  return row;
}

export function deleteOrderForEmployee(slug: string): void {
  const map = readAll();
  if (!(slug in map)) return;
  const next = { ...map };
  delete next[slug];
  writeAll(next);
}

/** مسح كل الطلبات المحفوظة محليًا في هذا المتصفح */
export function clearAllLocalOrders(): void {
  writeAll({});
}
