"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Employee } from "@/types";
import { getEmployeePhoto } from "@/data/employee-images";
import { isBuiltinEmployeeSlug } from "@/data/employees";
import { OrderFormDynamic } from "@/components/OrderFormDynamic";
import { fetchGuestTeamMemberBySlug } from "@/lib/guest-team-db";
import { resolveBuiltinForDisplay } from "@/lib/employee-overrides";
import { resolveEmployeeSlug } from "@/lib/team-members-store";
import { TEAM_CHANGED_EVENT } from "@/lib/team-events";

type Props = {
  slug: string;
  /** إن الاسم موجود في البيانات الثابتة نمرّره من السيرفر لتفادي وميض الـHydration */
  serverEmployee?: Employee | null;
};

/** لسه محمّلين من المتصفح (ضيف في localStorage) */
const Pending = Symbol("employee-pending");

export function EmployeeOrderView({
  slug,
  serverEmployee = null,
}: Props) {
  const [employee, setEmployee] = useState<Employee | typeof Pending | null>(
    () =>
      serverEmployee !== null && serverEmployee !== undefined
        ? serverEmployee
        : Pending,
  );

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      if (serverEmployee !== null && serverEmployee !== undefined) {
        if (isBuiltinEmployeeSlug(slug)) {
          const d = resolveBuiltinForDisplay(slug);
          setEmployee(d ?? null);
        } else {
          setEmployee(serverEmployee);
        }
        return;
      }

      const local = resolveEmployeeSlug(slug);
      if (local) {
        setEmployee(local);
        return;
      }

      void fetchGuestTeamMemberBySlug(slug).then((remote) => {
        if (!cancelled) setEmployee(remote ?? null);
      });
    });

    return () => {
      cancelled = true;
    };
  }, [serverEmployee, slug]);

  useEffect(() => {
    const onTeam = () => {
      if (!isBuiltinEmployeeSlug(slug)) return;
      const d = resolveBuiltinForDisplay(slug);
      setEmployee(d ?? null);
    };
    window.addEventListener(TEAM_CHANGED_EVENT, onTeam);
    return () => window.removeEventListener(TEAM_CHANGED_EVENT, onTeam);
  }, [slug]);

  if (employee === Pending) {
    return (
      <div className="space-y-8" aria-busy>
        <div
          className="animate-pulse rounded-3xl p-12"
          style={{
            background:
              "linear-gradient(135deg, rgba(245,130,32,0.08), rgba(28,30,24,0.5))",
            border: "1px solid rgba(245,130,32,0.15)",
          }}
        />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="space-y-8 text-center">
        <nav className="animate-fade-in-up flex flex-wrap items-center justify-start gap-2 text-sm text-stone-500">
          <Link
            href="/"
            className="inline-flex items-center gap-1 font-medium text-stone-400 no-underline transition-colors duration-200 hover:text-orange-400"
          >
            الرئيسية
          </Link>
        </nav>
        <div
          className="animate-fade-in-up rounded-3xl px-8 py-16"
          style={{
            background:
              "linear-gradient(135deg, rgba(245,130,32,0.06), rgba(245,130,32,0.02))",
            border: "2px dashed rgba(245,130,32,0.25)",
          }}
        >
          <p className="text-lg font-bold text-stone-200">
            الاسم غير موجود في القائمة.
          </p>
          <p className="mt-2 text-sm text-stone-500">
            سجّل من صفحة التسجيل أو ارجع للرئيسية.
          </p>
          <Link
            href="/join"
            className="btn-primary mt-6 inline-flex items-center gap-2 text-sm no-underline"
          >
            تسجيل
          </Link>
        </div>
      </div>
    );
  }

  const remoteUrl = employee.imageUrl;
  const staticPhoto = getEmployeePhoto(employee.slug);

  return (
    <div className="space-y-8">
      <nav className="animate-fade-in-up flex flex-wrap items-center gap-2 text-sm text-stone-500">
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
        <Link
          href="/summary"
          className="font-medium text-stone-400 no-underline transition-colors duration-200 hover:text-orange-400"
        >
          كل الطلبات مع بعض
        </Link>
        <span aria-hidden className="text-stone-600">
          /
        </span>
        <span className="font-semibold text-orange-400">{employee.name}</span>
      </nav>

      <div
        className="animate-hero-in relative overflow-hidden rounded-3xl p-6 sm:p-8"
        style={{
          background:
            "linear-gradient(135deg, rgba(245,130,32,0.16) 0%, rgba(28,30,24,0.88) 50%, rgba(245,130,32,0.1) 100%)",
          border: "1px solid rgba(245,130,32,0.25)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          aria-hidden
          className="animate-spin-slow pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-15"
          style={{
            background:
              "conic-gradient(from 0deg, #F58220, rgba(249,167,64,0.55), transparent, #F58220)",
          }}
        />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-7">
          {remoteUrl ? (
            <div
              className="shimmer-wrapper relative size-24 shrink-0 overflow-hidden rounded-2xl bg-stone-950/50 shadow-lg"
              style={{
                border: "2px solid rgba(245,130,32,0.3)",
                boxShadow: "0 8px 24px rgba(245,130,32,0.2)",
              }}
            >
              <Image
                key={remoteUrl}
                src={remoteUrl}
                alt={`صورة ${employee.name}`}
                fill
                sizes="96px"
                className="object-cover object-center"
              />
            </div>
          ) : staticPhoto ? (
            <div
              className="shimmer-wrapper relative size-24 shrink-0 overflow-hidden rounded-2xl bg-stone-950/50 shadow-lg"
              style={{
                border: "2px solid rgba(245,130,32,0.3)",
                boxShadow: "0 8px 24px rgba(245,130,32,0.2)",
              }}
            >
              <Image
                src={staticPhoto}
                alt={`صورة ${employee.name}`}
                fill
                sizes="96px"
                className="object-contain object-center"
              />
            </div>
          ) : (
            <div
              className="flex size-24 shrink-0 items-center justify-center rounded-2xl shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, rgba(245,130,32,0.22), rgba(245,130,32,0.08))",
                border: "2px solid rgba(245,130,32,0.2)",
              }}
            >
              <span
                className="text-3xl font-black"
                style={{
                  background: "linear-gradient(135deg, #F58220, #d96e15)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {employee.name
                  .trim()
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")}
              </span>
            </div>
          )}

          <div className="min-w-0 space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/35 bg-stone-900/50 px-3 py-1 text-xs font-semibold text-orange-200">
              <span
                className="h-1.5 w-1.5 animate-pulse rounded-full"
                style={{ background: "#F58220" }}
              />
              أوردر الفطار
            </div>
            <h1 className="text-2xl font-black sm:text-3xl">
              <span className="gradient-text">{employee.name}</span>
            </h1>
            <p className="text-sm leading-relaxed text-stone-400">
              علّم ✓ جنب اللي نفسك فيه، بعدين اختار العيش والكمية، وبعدين دوس
              احفظ. عايز تعدّل؟ رجع لنفس الصفحة وخليك في السكة.
            </p>
          </div>
        </div>
      </div>

      <OrderFormDynamic employee={employee} />
    </div>
  );
}
