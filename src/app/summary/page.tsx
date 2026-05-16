"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

const SummaryTable = dynamic(
  () =>
    import("@/components/SummaryTable").then((mod) => mod.SummaryTable),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-2xl"
            style={{
              background: "var(--surface)",
              border: "1px solid rgba(245,130,32,0.18)",
              animationDelay: `${i * 80}ms`,
            }}
          >
            <div
              className="px-5 py-3"
              style={{
                background: "rgba(245,130,32,0.08)",
                borderBottom: "1px solid rgba(245,130,32,0.1)",
              }}
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-stone-600" />
                <div className="h-4 w-24 rounded-full bg-stone-600" />
              </div>
            </div>
            <div className="space-y-2 px-5 py-4">
              <div className="h-3 w-64 rounded-full bg-stone-700" />
              <div className="h-3 w-48 rounded-full bg-stone-700" />
            </div>
          </div>
        ))}
      </div>
    ),
  },
);

export default function SummaryPage() {
  return (
    <div className="space-y-8">
      {/* ── Breadcrumb ── */}
      <nav className="animate-fade-in-up flex items-center gap-2 text-sm text-stone-500">
        <Link
          href="/"
          className="inline-flex items-center gap-1 font-medium text-stone-400 no-underline transition-colors duration-200 hover:text-orange-400"
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
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          الرئيسية
        </Link>
        <span aria-hidden className="text-stone-600">
          /
        </span>
        <span className="font-semibold text-orange-400">كل الطلبات مع بعض</span>
      </nav>

      {/* ── Page Hero ── */}
      <div
        className="animate-hero-in relative overflow-hidden rounded-3xl px-6 py-8 sm:px-10"
        style={{
          background:
            "linear-gradient(135deg, rgba(245,130,32,0.14) 0%, rgba(28,30,24,0.88) 50%, rgba(245,130,32,0.08) 100%)",
          border: "1px solid rgba(245,130,32,0.28)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          aria-hidden
          className="animate-spin-slow pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full opacity-15"
          style={{
            background:
              "conic-gradient(from 180deg, #f9a740, #F58220, transparent, #f9a740)",
          }}
        />
        <div className="relative flex items-center gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl shadow-md"
            style={{
              background: "linear-gradient(135deg, #F58220, #d96e15)",
              boxShadow: "0 4px 16px rgba(245,130,32,0.35)",
            }}
          >
            🧾
          </div>
          <div>
            <h1 className="text-2xl font-black">
              <span className="gradient-text-rev">كل الأوردرات هنا</span>
            </h1>
            <p className="mt-0.5 text-sm leading-relaxed text-stone-400">
              هنا كل طلبات الفريق في مكان واحد — راجع اللي اتسجّل، عدّل لو لزم، وابعت
              للمطعم ورقة مطبوعة من المتصفح لما تكون جاهز.
            </p>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <SummaryTable />
    </div>
  );
}
