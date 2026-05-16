import type { BreadType } from "@/types";

const LABELS: Record<BreadType, string> = {
  shami: "عيش شامي",
  baladi: "عيش بلدي",
};

export function breadLabel(type: BreadType): string {
  return LABELS[type];
}

export const BREAD_OPTIONS: { value: BreadType; label: string }[] = [
  { value: "shami", label: LABELS.shami },
  { value: "baladi", label: LABELS.baladi },
];
