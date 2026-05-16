"use client";

import dynamic from "next/dynamic";
import type { Employee } from "@/types";

const OrderFormLazy = dynamic(
  () => import("./OrderForm").then((mod) => mod.OrderForm),
  {
    ssr: false,
    loading: () => (
      <div
        className="animate-fade-in-up mx-auto max-w-3xl overflow-hidden rounded-3xl shadow-lg shadow-black/40"
        style={{
          background: "var(--surface)",
          border: "1px solid rgba(245,130,32,0.2)",
        }}
      >
        {/* Shimmer header */}
        <div
          className="px-6 py-5"
          style={{
            background:
              "linear-gradient(135deg, rgba(245,130,32,0.1), rgba(245,130,32,0.04))",
            borderBottom: "1px solid rgba(245,130,32,0.12)",
          }}
        >
          <div className="h-4 w-32 animate-pulse rounded-full bg-stone-600" />
          <div className="mt-2 h-3 w-56 animate-pulse rounded-full bg-stone-700" />
        </div>
        <div className="space-y-4 p-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-14 animate-pulse rounded-2xl"
              style={{
                background: "rgba(245,130,32,0.06)",
                animationDelay: `${i * 100}ms`,
              }}
            />
          ))}
        </div>
      </div>
    ),
  },
);

export function OrderFormDynamic(props: { employee: Employee }) {
  return <OrderFormLazy {...props} />;
}
