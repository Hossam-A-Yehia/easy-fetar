import type { OrderLine, OrderPayload } from "@/types";

export function isOrderLine(v: unknown): v is OrderLine {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.menuItemId === "string" &&
    typeof o.menuItemName === "string" &&
    (o.breadType === "shami" || o.breadType === "baladi") &&
    typeof o.quantity === "number" &&
    Number.isFinite(o.quantity) &&
    o.quantity >= 1 &&
    (o.saladAndTahini === null ||
      o.saladAndTahini === true ||
      o.saladAndTahini === false)
  );
}

/** تحقق من جسم الطلب القادم من العميل أو من الصف */
export function parseOrderPayload(raw: unknown): OrderPayload | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const employeeSlug =
    typeof o.employeeSlug === "string" ? o.employeeSlug.trim() : "";
  const employeeName =
    typeof o.employeeName === "string" ? o.employeeName.trim() : "";
  const notes = typeof o.notes === "string" ? o.notes : "";

  if (!employeeSlug || !employeeName) return null;

  if (!Array.isArray(o.lines)) return null;
  const lines = o.lines.filter(isOrderLine);
  if (lines.length === 0) return null;

  return {
    employeeSlug,
    employeeName,
    lines,
    notes,
  };
}
