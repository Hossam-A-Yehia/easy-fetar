import type { MenuItem } from "@/types";

export const MENU_ITEMS: MenuItem[] = [
  // فول
  { id: "ful-adi", name: "فول عادي", category: "فول", needsSaladTahiniOption: false },
  {
    id: "ful-zayt",
    name: "فول زيت زيتون",
    category: "فول",
    needsSaladTahiniOption: false,
  },
  {
    id: "ful-samna",
    name: "فول بالسمنة البلدي",
    category: "فول",
    needsSaladTahiniOption: false,
  },
  {
    id: "ful-byd",
    name: "فول بالبيض المسلوق",
    category: "فول",
    needsSaladTahiniOption: false,
  },
  { id: "ful-sogo2", name: "فول بالسجق", category: "فول", needsSaladTahiniOption: false },
  {
    id: "ful-basturma",
    name: "فول بالبسطرمة",
    category: "فول",
    needsSaladTahiniOption: false,
  },
  // طعمية
  {
    id: "ta3miya-3adia",
    name: "طعمية عادية",
    category: "طعمية",
    needsSaladTahiniOption: true,
  },
  {
    id: "ta3miya-mahshiya",
    name: "طعمية محشية",
    category: "طعمية",
    needsSaladTahiniOption: false,
  },
  {
    id: "ta3miya-mosaqa3a",
    name: "طعمية بالمسقعة",
    category: "طعمية",
    needsSaladTahiniOption: false,
  },
  {
    id: "ta3miya-batates",
    name: "طعمية بطاطس",
    category: "طعمية",
    needsSaladTahiniOption: false,
  },
  {
    id: "ta3miya-kiry",
    name: "طعمية كيري",
    category: "طعمية",
    needsSaladTahiniOption: false,
  },
  // بطاطس
  {
    id: "batates-ketchup",
    name: "بطاطس كاتشب",
    category: "بطاطس",
    needsSaladTahiniOption: false,
  },
  {
    id: "batates-salata",
    name: "بطاطس سلطة",
    category: "بطاطس",
    needsSaladTahiniOption: false,
  },
  {
    id: "batates-paney",
    name: "بطاطس بانيه",
    category: "بطاطس",
    needsSaladTahiniOption: false,
  },
  {
    id: "batates-mahroosa",
    name: "بطاطس مهروسة",
    category: "بطاطس",
    needsSaladTahiniOption: false,
  },
  {
    id: "batates-shipsy",
    name: "بطاطس شيبسي",
    category: "بطاطس",
    needsSaladTahiniOption: true,
  },
  {
    id: "batates-byd",
    name: "بطاطس بيض",
    category: "بطاطس",
    needsSaladTahiniOption: false,
  },
  {
    id: "batates-omlet",
    name: "بطاطس أومليت",
    category: "بطاطس",
    needsSaladTahiniOption: false,
  },
  {
    id: "batates-gbna-ma2leya",
    name: "بطاطس جبنة مقلية",
    category: "بطاطس",
    needsSaladTahiniOption: false,
  },
  {
    id: "batates-gbna-romy",
    name: "بطاطس جبنة رومي",
    category: "بطاطس",
    needsSaladTahiniOption: false,
  },
  // بيض
  { id: "omlet", name: "أومليت", category: "بيض", needsSaladTahiniOption: false },
  {
    id: "byd-basturma",
    name: "بيض بالبسطرمة",
    category: "بيض",
    needsSaladTahiniOption: false,
  },
  { id: "byd-luncheon", name: "بيض لانشون", category: "بيض", needsSaladTahiniOption: false },
  { id: "byd-cheddar", name: "بيض شيدر", category: "بيض", needsSaladTahiniOption: false },
  // جبنة
  {
    id: "gbna-ma2leya",
    name: "جبنة مقلية",
    category: "جبنة",
    needsSaladTahiniOption: false,
  },
  { id: "gbna-romy", name: "جبنة رومي", category: "جبنة", needsSaladTahiniOption: false },
  {
    id: "gbna-areesh",
    name: "جبنة قريش بالطماطم",
    category: "جبنة",
    needsSaladTahiniOption: false,
  },
  {
    id: "gbna-ma2leya-sauce",
    name: "جبنة مقلية كاتشب ومايونيز",
    category: "جبنة",
    needsSaladTahiniOption: false,
  },
  // إضافات
  {
    id: "babaghanoug",
    name: "بابا غنوج",
    category: "إضافات",
    needsSaladTahiniOption: false,
  },
  {
    id: "shipsy-addon",
    name: "شيبسي",
    category: "إضافات",
    needsSaladTahiniOption: true,
  },
  {
    id: "mosaqa3a-addon",
    name: "مسقعة",
    category: "إضافات",
    needsSaladTahiniOption: false,
  },
];

export const MENU_CATEGORY_ORDER = [
  "فول",
  "طعمية",
  "بطاطس",
  "بيض",
  "جبنة",
  "إضافات",
] as const;

export function getMenuItemById(id: string): MenuItem | undefined {
  return MENU_ITEMS.find((m) => m.id === id);
}

export function groupMenuByCategory(): Map<string, MenuItem[]> {
  const map = new Map<string, MenuItem[]>();
  for (const cat of MENU_CATEGORY_ORDER) {
    map.set(
      cat,
      MENU_ITEMS.filter((m) => m.category === cat),
    );
  }
  return map;
}
