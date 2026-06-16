"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { BreadType, StoredOrder } from "@/types";
import {
  fetchAllOrders,
  deleteOrderForEmployee,
  clearAllOrders,
} from "@/lib/orders-store";
import { getEmployeePhoto } from "@/data/employee-images";
import { breadLabel } from "@/lib/bread";
import {
  formatPrice,
  lineTotal,
  orderTotal,
} from "@/lib/pricing";
import { ConfirmDialog } from "@/components/ConfirmDialog";

function formatOrderLine(
  quantity: number,
  menuItemName: string,
  breadType: BreadType,
  salad: boolean | null,
  linePrice: number,
): string {
  let t = `${quantity}× ${menuItemName} — ${breadLabel(breadType)} — ${formatPrice(linePrice)}`;
  if (salad === true) t += " — وسلطة وطحينة كده";
  else if (salad === false) t += " — من غير سلطة ولا طحينة";
  return t;
}

function formatOrderBody(o: StoredOrder): ReactNode {
  const total = orderTotal(o.lines);
  return (
    <div className="space-y-2">
      <ul className="space-y-1.5">
        {o.lines.map((line, i) => (
          <li
            key={`${line.menuItemId}-${i}`}
            className="flex items-start gap-2 text-sm text-stone-300"
          >
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: "#F58220" }}
            />
            {formatOrderLine(
              line.quantity,
              line.menuItemName,
              line.breadType,
              line.saladAndTahini,
              lineTotal(line),
            )}
          </li>
        ))}
      </ul>
      <p className="text-sm font-bold text-orange-300">
        إجمالي {o.employeeName}: {formatPrice(total)}
      </p>
      {o.notes ? (
        <p className="flex items-center gap-1.5 text-xs text-stone-500">
          <span>📝</span>
          {o.notes}
        </p>
      ) : null}
    </div>
  );
}

type PendingConfirm =
  | null
  | { kind: "delete-one"; slug: string; name: string }
  | { kind: "clear-all" };

export function SummaryTable() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingConfirm, setPendingConfirm] = useState<PendingConfirm>(null);

  const refresh = useCallback(async () => {
    const next = await fetchAllOrders();
    setOrders(next);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchAllOrders()
      .then((rows) => {
        if (!cancelled) setOrders(rows);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function requestDeleteOne(slug: string, name: string) {
    setPendingConfirm({ kind: "delete-one", slug, name });
  }

  function requestClearAll() {
    setPendingConfirm({ kind: "clear-all" });
  }

  function closeConfirm() {
    setPendingConfirm(null);
  }

  async function runConfirm() {
    const p = pendingConfirm;
    if (!p) return;
    if (p.kind === "delete-one") {
      await deleteOrderForEmployee(p.slug);
    } else {
      await clearAllOrders();
    }
    setPendingConfirm(null);
    await refresh();
  }

  if (loading) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3 rounded-3xl px-6 py-16 text-center text-stone-400"
        style={{
          background:
            "linear-gradient(135deg, rgba(245,130,32,0.04), rgba(245,130,32,0.02))",
          border: "1px solid rgba(245,130,32,0.15)",
        }}
      >
        <span className="text-3xl animate-pulse">⏳</span>
        <p className="text-sm">بنجيب الأوردرات من السيرفر…</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div
        className="animate-fade-in-up flex flex-col items-center gap-4 rounded-3xl px-6 py-16 text-center"
        style={{
          background:
            "linear-gradient(135deg, rgba(245,130,32,0.04), rgba(245,130,32,0.02))",
          border: "2px dashed rgba(245,130,32,0.25)",
        }}
      >
        <span className="animate-float text-5xl">🧆</span>
        <div className="space-y-1">
          <p className="font-bold text-stone-200">لسه محدش طلب حاجة 🤷</p>
          <p className="text-sm text-stone-500">
            يلا اطلع اختار أوردرك من الرئيسية، وبعدين ارجع هنا تشوف اللمة.
          </p>
        </div>
        <Link
          href="/"
          className="btn-primary mt-2 inline-flex items-center gap-2 text-sm no-underline"
        >
          <span>يلا نرجع نطلب</span>
        </Link>
      </div>
    );
  }

  const grandTotal = orders.reduce(
    (sum, o) => sum + orderTotal(o.lines),
    0,
  );

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="rounded-full px-3 py-1 text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg, #F58220, #d96e15)" }}
          >
            {orders.length} أوردر
          </span>
          <span
            className="rounded-full px-3 py-1 text-xs font-bold"
            style={{
              background: "rgba(245,130,32,0.15)",
              border: "1px solid rgba(245,130,32,0.35)",
              color: "#fdba74",
            }}
          >
            الإجمالي الكلي: {formatPrice(grandTotal)}
          </span>
          <span className="text-sm text-stone-500">
            للمطعم: اطبع الصفحة من المتصفح — المعاينة متظبطة للورقة.
          </span>
        </div>
        <button
          type="button"
          onClick={requestClearAll}
          className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-[0.98]"
          style={{
            border: "1.5px solid rgba(248,113,113,0.4)",
            background: "rgba(127,29,29,0.4)",
            color: "#fecaca",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          امسح الكل
        </button>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {orders.map((o, index) => {
          const photo = getEmployeePhoto(o.employeeSlug);
          return (
          <div
            key={o.employeeSlug}
            className="card-glow animate-fade-in-up relative z-[1] overflow-hidden rounded-2xl"
            style={{
              background: "var(--surface)",
              border: "1px solid rgba(245,130,32,0.2)",
              backdropFilter: "blur(12px)",
              animationDelay: `${index * 50}ms`,
            }}
          >
            {/* Card header */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{
                background:
                  "linear-gradient(135deg, rgba(245,130,32,0.06) 0%, rgba(245,130,32,0.03) 100%)",
                borderBottom: "1px solid rgba(245,130,32,0.08)",
              }}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                {photo ? (
                  <Image
                    src={photo}
                    alt={`صورة ${o.employeeName}`}
                    width={32}
                    height={32}
                    className="h-8 w-8 shrink-0 rounded-xl bg-stone-900 object-contain ring-1 ring-white/10"
                  />
                ) : (
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white shadow-sm ring-1 ring-white/10"
                    style={{
                      background: "linear-gradient(135deg, #F58220, #d96e15)",
                    }}
                    aria-hidden
                  >
                    {o.employeeName[0]}
                  </div>
                )}
                <span className="truncate font-bold text-stone-100">
                  {o.employeeName}
                </span>
              </div>
              <span className="rounded-full border border-orange-500/30 bg-orange-950/30 px-2.5 py-0.5 text-xs font-semibold text-orange-200">
                {o.lines.length} حاجة في الأوردر
              </span>
            </div>

            {/* Card body */}
            <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">{formatOrderBody(o)}</div>
              <div className="flex shrink-0 flex-wrap gap-2 max-sm:w-full">
                <Link
                  href={`/employee/${o.employeeSlug}`}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold no-underline transition-all duration-200 hover:scale-[0.98] sm:flex-none"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(245,130,32,0.15), rgba(245,130,32,0.06))",
                    border: "1.5px solid rgba(245,130,32,0.4)",
                    color: "#fdba74",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  عدّل الأوردر
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    requestDeleteOne(o.employeeSlug, o.employeeName)
                  }
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 hover:scale-[0.98] sm:flex-none"
                  style={{
                    background: "rgba(127,29,29,0.35)",
                    border: "1.5px solid rgba(248,113,113,0.35)",
                    color: "#fecaca",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  </svg>
                  امسح
                </button>
              </div>
            </div>
          </div>
          );
        })}
      </div>

      <ConfirmDialog
        open={pendingConfirm !== null}
        title={
          pendingConfirm?.kind === "clear-all"
            ? "تمسح كل الأوردرات؟"
            : "تمسح الأوردر ده؟"
        }
        description={
          pendingConfirm?.kind === "clear-all"
            ? "اللستة هتتفضّى بالكامل من قاعدة البيانات، ومفيش تراجع تلقائي — اتأكّد قبل ما تمشي."
            : pendingConfirm?.kind === "delete-one"
              ? `أوردر «${pendingConfirm.name}» هيختفي من الملخص على السيرفر. لو حابب تسجّل تاني، يرجع من صفحة الاسم.`
              : ""
        }
        confirmLabel={
          pendingConfirm?.kind === "clear-all" ? "امسح الكل" : "امسح"
        }
        variant="danger"
        onConfirm={runConfirm}
        onCancel={closeConfirm}
      />
    </div>
  );
}
