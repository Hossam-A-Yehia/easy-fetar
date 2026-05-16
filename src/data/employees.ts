import type { Employee } from "@/types";

export const EMPLOYEES: Employee[] = [
  {
    id: "e1",
    slug: "hossam-yahya",
    name: "حسام يحيى",
    imageUrl: null,
  },
  {
    id: "e2",
    slug: "ahmed-alaa",
    name: "أحمد علاء",
    imageUrl: null,
  },
  {
    id: "e3",
    slug: "abanob",
    name: "أبانوب",
    imageUrl: null,
  },
  {
    id: "e4",
    slug: "mohamed-khrashi",
    name: "محمد خراشي",
    imageUrl: null,
  },
  {
    id: "e5",
    slug: "ahmed-qutb",
    name: "أحمد قطب",
    imageUrl: null,
  },
  {
    id: "e6",
    slug: "saeed-eldieb",
    name: "سعيد الديب",
    imageUrl: null,
  },
  {
    id: "e7",
    slug: "khaled-badr",
    name: "خالد بدر",
    imageUrl: null,
  },
  {
    id: "e8",
    slug: "youssef-agag",
    name: "يوسف عجاج",
    imageUrl: null,
  },
  {
    id: "e9",
    slug: "aya-mohamed",
    name: "آية محمد",
    imageUrl: null,
  },
  {
    id: "e10",
    slug: "ahmed-ali",
    name: "أحمد علي",
    imageUrl: null,
  },
  {
    id: "e11",
    slug: "mohamed-allam",
    name: "محمد علام",
    imageUrl: null,
  },
  {
    id: "e12",
    slug: "mahmoud-omar",
    name: "محمود عمر",
    imageUrl: null,
  },
  {
    id: "e13",
    slug: "huda",
    name: "هدى",
    imageUrl: null,
  },
  {
    id: "e14",
    slug: "ahmed-eid",
    name: "أحمد عيد",
    imageUrl: null,
  },
  {
    id: "e15",
    slug: "ziad",
    name: "زياد",
    imageUrl: null,
  },
];

export function getEmployeeBySlug(slug: string): Employee | undefined {
  return EMPLOYEES.find((e) => e.slug === slug);
}

export function isBuiltinEmployeeSlug(slug: string): boolean {
  return EMPLOYEES.some((e) => e.slug === slug);
}
