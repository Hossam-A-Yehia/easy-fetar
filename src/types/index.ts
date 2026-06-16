export type BreadType = "shami" | "baladi";

export interface Employee {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  /** السعر الأساسي (عيش شامي) بالجنيه */
  price: number;
  /** يظهر سؤال السلطة والطحينة (سندوتش طعمية، سندوتش شيبسي) */
  needsSaladTahiniOption: boolean;
}

/** سطر واحد داخل طلب الموظف */
export interface OrderLine {
  menuItemId: string;
  menuItemName: string;
  breadType: BreadType;
  quantity: number;
  saladAndTahini: boolean | null;
}

export interface OrderPayload {
  employeeSlug: string;
  employeeName: string;
  lines: OrderLine[];
  notes: string;
}

export interface StoredOrder extends OrderPayload {
  id: string;
  updatedAt: string;
}
