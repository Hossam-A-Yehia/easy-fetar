import { getMenuItemById } from "@/data/menu";
import { BALADI_SURCHARGE } from "@/lib/bread";
import type { BreadType, OrderLine } from "@/types";

export { BALADI_SURCHARGE };

export function formatPrice(amount: number): string {
  return `${amount} ج.م`;
}

export function unitPrice(basePrice: number, breadType: BreadType): number {
  return basePrice + (breadType === "baladi" ? BALADI_SURCHARGE : 0);
}

export function lineUnitPrice(line: Pick<OrderLine, "menuItemId" | "breadType">): number {
  const item = getMenuItemById(line.menuItemId);
  if (!item) return 0;
  return unitPrice(item.price, line.breadType);
}

export function lineTotal(line: OrderLine): number {
  return lineUnitPrice(line) * line.quantity;
}

export function orderTotal(lines: OrderLine[]): number {
  return lines.reduce((sum, line) => sum + lineTotal(line), 0);
}
