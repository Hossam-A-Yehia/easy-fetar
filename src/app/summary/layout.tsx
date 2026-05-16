import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `كل الطلبات مع بعض | ${BRAND.arName} · ${BRAND.enName}`,
};

export default function SummaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
