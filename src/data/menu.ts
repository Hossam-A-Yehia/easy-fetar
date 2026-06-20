import type { MenuItem } from "@/types";

export const MENU_ITEMS: MenuItem[] = [
  // فول
  {
    id: "ful-zait-har",
    name: "سندوتش فول زيت حار",
    category: "فول",
    price: 12,
    needsSaladTahiniOption: false,
  },
  {
    id: "ful-khaltah",
    name: "سندوتش فول بالخلطة",
    category: "فول",
    price: 16,
    needsSaladTahiniOption: false,
  },
  {
    id: "ful-zait-zaytoun",
    name: "سندوتش فول زيت زيتون",
    category: "فول",
    price: 16,
    needsSaladTahiniOption: false,
  },
  {
    id: "ful-samna-baladi",
    name: "سندوتش فول بالسمن البلدي",
    category: "فول",
    price: 19,
    needsSaladTahiniOption: false,
  },
  {
    id: "ful-mix-ta3miya",
    name: "سندوتش ميكس فول ع طعمية",
    category: "فول",
    price: 15,
    needsSaladTahiniOption: false,
  },
  {
    id: "ful-byd",
    name: "سندوتش فول بالبيض",
    category: "فول",
    price: 17,
    needsSaladTahiniOption: false,
  },
  {
    id: "ful-babaghanoug",
    name: "سندوتش فول بابا غنوج",
    category: "فول",
    price: 17,
    needsSaladTahiniOption: false,
  },
  {
    id: "ful-ta3miya-mahshiya",
    name: "سندوتش فول ع طعمية محشية",
    category: "فول",
    price: 19,
    needsSaladTahiniOption: false,
  },
  // طعمية
  {
    id: "ta3miya",
    name: "سندوتش طعمية",
    category: "طعمية",
    price: 12,
    needsSaladTahiniOption: true,
  },
  {
    id: "ta3miya-mosaqa3a",
    name: "سندوتش طعمية بالمسقعة",
    category: "طعمية",
    price: 20,
    needsSaladTahiniOption: false,
  },
  {
    id: "ta3miya-batates",
    name: "سندوتش طعمية بالبطاطس",
    category: "طعمية",
    price: 21,
    needsSaladTahiniOption: false,
  },
  {
    id: "ta3miya-gbna-romy",
    name: "سندوتش طعمية جبنة رومي",
    category: "طعمية",
    price: 24,
    needsSaladTahiniOption: false,
  },
  {
    id: "ta3miya-mahshiya",
    name: "سندوتش طعمية محشية",
    category: "طعمية",
    price: 15,
    needsSaladTahiniOption: false,
  },
  {
    id: "ta3miya-byd-masluq",
    name: "سندوتش طعمية بيض مسلوق",
    category: "طعمية",
    price: 25,
    needsSaladTahiniOption: false,
  },
  {
    id: "ta3miya-omlet",
    name: "سندوتش طعمية أومليت",
    category: "طعمية",
    price: 31,
    needsSaladTahiniOption: false,
  },
  {
    id: "ta3miya-gbna-basturma",
    name: "سندوتش طعمية جبنة + بسطرمة",
    category: "طعمية",
    price: 34,
    needsSaladTahiniOption: false,
  },
  {
    id: "ta3miya-kiry",
    name: "سندوتش طعمية كيري",
    category: "طعمية",
    price: 24,
    needsSaladTahiniOption: false,
  },
  {
    id: "ta3miya-basturma",
    name: "سندوتش طعمية بالبسطرمة",
    category: "طعمية",
    price: 27,
    needsSaladTahiniOption: false,
  },
  // بطاطس
  {
    id: "batates",
    name: "سندوتش بطاطس",
    category: "بطاطس",
    price: 16,
    needsSaladTahiniOption: false,
  },
  {
    id: "shipsy",
    name: "سندوتش شيبسي",
    category: "بطاطس",
    price: 16,
    needsSaladTahiniOption: true,
  },
  {
    id: "batates-ketchup",
    name: "سندوتش بطاطس بالكاتشب",
    category: "بطاطس",
    price: 20,
    needsSaladTahiniOption: false,
  },
  {
    id: "batates-mayo",
    name: "سندوتش بطاطس بالمايونيز",
    category: "بطاطس",
    price: 20,
    needsSaladTahiniOption: false,
  },
  {
    id: "batates-ketchup-mayo",
    name: "سندوتش بطاطس كاتشب مايونيز",
    category: "بطاطس",
    price: 21,
    needsSaladTahiniOption: false,
  },
  {
    id: "batates-gbna-romy",
    name: "سندوتش بطاطس جبنة رومي",
    category: "بطاطس",
    price: 28,
    needsSaladTahiniOption: false,
  },
  {
    id: "batates-byd-masluq",
    name: "سندوتش بطاطس بيض مسلوق",
    category: "بطاطس",
    price: 28,
    needsSaladTahiniOption: false,
  },
  {
    id: "batates-omlet",
    name: "سندوتش بطاطس أومليت",
    category: "بطاطس",
    price: 34,
    needsSaladTahiniOption: false,
  },
  {
    id: "batates-mosaqa3a",
    name: "سندوتش بطاطس ع مسقعة",
    category: "بطاطس",
    price: 24,
    needsSaladTahiniOption: false,
  },
  // بيض
  {
    id: "byd-masluq",
    name: "سندوتش بيض مسلوق",
    category: "بيض",
    price: 17,
    needsSaladTahiniOption: false,
  },
  {
    id: "omlet",
    name: "سندوتش أومليت",
    category: "بيض",
    price: 22,
    needsSaladTahiniOption: false,
  },
  {
    id: "omlet-basturma",
    name: "سندوتش أومليت بسطرمة",
    category: "بيض",
    price: 30,
    needsSaladTahiniOption: false,
  },
  {
    id: "omlet-romy",
    name: "سندوتش أومليت رومي",
    category: "بيض",
    price: 30,
    needsSaladTahiniOption: false,
  },
  // جبنة
  {
    id: "gbna-ma2leya",
    name: "سندوتش جبنة مقلية",
    category: "جبنة",
    price: 31,
    needsSaladTahiniOption: false,
  },
  {
    id: "gbna-areesh",
    name: "سندوتش جبنة قريش بالطماطم",
    category: "جبنة",
    price: 19,
    needsSaladTahiniOption: false,
  },
  {
    id: "babaghanoug",
    name: "سندوتش بابا غنوج",
    category: "جبنة",
    price: 19,
    needsSaladTahiniOption: false,
  },
  {
    id: "mosaqa3a",
    name: "سندوتش مسقعة",
    category: "جبنة",
    price: 19,
    needsSaladTahiniOption: false,
  },
];

export const MENU_CATEGORY_ORDER = [
  "فول",
  "طعمية",
  "بطاطس",
  "بيض",
  "جبنة",
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
