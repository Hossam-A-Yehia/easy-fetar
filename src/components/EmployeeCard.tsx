"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Employee } from "@/types";
import { getEmployeePhoto } from "@/data/employee-images";
import { isBuiltinEmployeeSlug } from "@/data/employees";
import { hideBuiltinSlug } from "@/lib/employee-overrides";
import { emitTeamChanged } from "@/lib/team-events";
import { deleteOrderForEmployee } from "@/lib/orders-store";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmployeeEditDialog } from "@/components/EmployeeEditDialog";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return parts[0][0] + parts[1][0];
  }
  return parts[0]?.slice(0, 2) ?? "؟";
}

type Props = {
  employee: Employee;
  index?: number;
};

export function EmployeeCard({ employee, index = 0 }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [editSessionKey, setEditSessionKey] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const label = initials(employee.name);
  const staticPhoto = getEmployeePhoto(employee.slug);
  const remoteUrl = employee.imageUrl;
  const delayMs = Math.min(index * 60, 700);

  async function handleDelete() {
    const slug = employee.slug;
    if (isBuiltinEmployeeSlug(slug)) {
      hideBuiltinSlug(slug);
      deleteOrderForEmployee(slug);
      emitTeamChanged();
      setConfirmDelete(false);
      return;
    }
    try {
      const res = await fetch(`/api/team/member/${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setConfirmDelete(false);
        return;
      }
    } catch {
      setConfirmDelete(false);
      return;
    }
    deleteOrderForEmployee(slug);
    emitTeamChanged();
    setConfirmDelete(false);
  }

  return (
    <>
    <article
      className="card-glow shimmer-wrapper animate-fade-in-up group flex flex-col overflow-hidden rounded-2xl bg-[color:var(--card-bg)] shadow-lg shadow-black/40"
      style={{
        animationDelay: `${delayMs}ms`,
        border: "1px solid rgba(245,130,32,0.22)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* ── Photo / Avatar ── */}
      <div className="relative z-[1] aspect-[4/3] w-full overflow-hidden bg-stone-950/60">
        {/* Gradient overlay on hover */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(to top, rgba(245,130,32,0.35) 0%, transparent 60%)",
          }}
        />

        {remoteUrl ? (
          <Image
            key={remoteUrl}
            src={remoteUrl}
            alt={`صورة ${employee.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain object-center transition-opacity duration-300 group-hover:opacity-95"
            priority={index < 3}
          />
        ) : staticPhoto ? (
          <Image
            src={staticPhoto}
            alt={`صورة ${employee.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain object-center transition-opacity duration-300 group-hover:opacity-95"
            priority={index < 3}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(245,130,32,0.15) 0%, rgba(245,130,32,0.06) 100%)",
            }}
          >
            <span
              className="text-5xl font-black"
              style={{
                background: "linear-gradient(135deg, #F58220, #d96e15)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {label}
            </span>
          </div>
        )}

        {/* Top gradient strip */}
        <div
          className="absolute inset-x-0 top-0 h-1 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: "linear-gradient(90deg, #F58220, #f9a740)",
          }}
        />
      </div>

      {/* ── Card Body (z-[1] keeps links above decorative ::after) ── */}
      <div className="relative z-[1] flex flex-1 flex-col gap-3 p-5">
        <h2 className="text-lg font-bold text-stone-100 transition-colors duration-200 group-hover:text-orange-400">
          {employee.name}
        </h2>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setEditSessionKey((k) => k + 1);
              setEditOpen(true);
            }}
            className="rounded-xl border border-white/15 bg-stone-900/80 px-3 py-2 text-xs font-semibold text-stone-300 transition-colors hover:border-orange-500/35 hover:text-orange-300"
          >
            تعديل
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setConfirmDelete(true);
            }}
            className="rounded-xl border border-red-500/30 bg-red-950/40 px-3 py-2 text-xs font-semibold text-red-300 transition-colors hover:bg-red-950/60"
          >
            حذف
          </button>
        </div>

        <Link
          href={`/employee/${employee.slug}`}
          className="btn-primary relative z-10 mt-auto inline-flex items-center justify-center gap-2 text-sm no-underline"
        >
          <span>يلا نطلب</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:-translate-x-1"
            aria-hidden
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
      </div>
    </article>

    <EmployeeEditDialog
      key={editSessionKey}
      employee={employee}
      open={editOpen}
      onClose={() => setEditOpen(false)}
    />

    <ConfirmDialog
      open={confirmDelete}
      title="تأكيد الحذف"
      description={
        isBuiltinEmployeeSlug(employee.slug)
          ? "هيختفي من القائمة على الجهاز ده. تقدر ترجّعه من أسفل الصفحة (الموظفين المخفيين)."
          : "هيتشال من قاعدة البيانات ومن الطلبات المحفوظة على الجهاز ده."
      }
      confirmLabel="أيوه، امسح"
      variant="danger"
      onConfirm={() => void handleDelete()}
      onCancel={() => setConfirmDelete(false)}
    />
    </>
  );
}
