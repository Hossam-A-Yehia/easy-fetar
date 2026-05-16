"use client";

import type { OrderPayload, StoredOrder } from "@/types";

async function readJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchAllOrders(): Promise<StoredOrder[]> {
  const res = await fetch("/api/orders", { cache: "no-store" });
  const data = (await readJson(res)) as {
    ok?: boolean;
    orders?: StoredOrder[];
  } | null;
  if (!res.ok || !data?.ok || !Array.isArray(data.orders)) return [];
  return data.orders;
}

export async function fetchOrderForEmployee(
  slug: string,
): Promise<StoredOrder | undefined> {
  const res = await fetch(`/api/orders/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });
  const data = (await readJson(res)) as {
    ok?: boolean;
    order?: StoredOrder | null;
  } | null;
  if (!res.ok || !data?.ok) return undefined;
  return data.order ?? undefined;
}

export type UpsertOrderFailure = {
  code?: string;
  detail?: string;
  hint?: string;
  httpStatus: number;
};

export async function upsertOrder(
  payload: OrderPayload,
): Promise<{ ok: true; order: StoredOrder } | { ok: false; error: UpsertOrderFailure }> {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await readJson(res)) as {
    ok?: boolean;
    order?: StoredOrder;
    code?: string;
    detail?: string;
    hint?: string;
  } | null;

  if (res.ok && data?.ok && data.order) {
    return { ok: true, order: data.order };
  }

  return {
    ok: false,
    error: {
      httpStatus: res.status,
      code: typeof data?.code === "string" ? data.code : undefined,
      detail: typeof data?.detail === "string" ? data.detail : undefined,
      hint: typeof data?.hint === "string" ? data.hint : undefined,
    },
  };
}

export async function deleteOrderForEmployee(slug: string): Promise<boolean> {
  const res = await fetch(`/api/orders/${encodeURIComponent(slug)}`, {
    method: "DELETE",
  });
  const data = (await readJson(res)) as { ok?: boolean } | null;
  return res.ok && Boolean(data?.ok);
}

export async function clearAllOrders(): Promise<boolean> {
  const res = await fetch("/api/orders", { method: "DELETE" });
  const data = (await readJson(res)) as { ok?: boolean } | null;
  return res.ok && Boolean(data?.ok);
}
