import type { StoredOrder } from "@/types";
import { isOrderLine } from "@/lib/order-validation";

export type EmployeeOrderRow = {
  id: string;
  employee_slug: string;
  employee_name: string;
  lines: unknown;
  notes: string | null;
  updated_at: string;
};

export function rowToStoredOrder(row: EmployeeOrderRow): StoredOrder | null {
  if (!Array.isArray(row.lines)) return null;
  const lines = row.lines.filter(isOrderLine);
  if (lines.length === 0) return null;
  return {
    id: row.id,
    employeeSlug: row.employee_slug,
    employeeName: row.employee_name,
    lines,
    notes: typeof row.notes === "string" ? row.notes : "",
    updatedAt: row.updated_at,
  };
}
