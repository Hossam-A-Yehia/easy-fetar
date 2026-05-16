"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Employee } from "@/types";
import { EmployeeCard } from "@/components/EmployeeCard";
import { getAllEmployeesMergedAsync } from "@/lib/team-members-store";
import {
  getHiddenBuiltinSlugs,
  hiddenBuiltinDisplayName,
  unhideBuiltinSlug,
} from "@/lib/employee-overrides";
import { TEAM_CHANGED_EVENT } from "@/lib/team-events";

type Props = {
  initialBuiltIns: Employee[];
};

export function HomeEmployeesGrid({ initialBuiltIns }: Props) {
  /** نفس القيمة على السيرفر وأول رندر في المتصفح، علشان ما يحصلش Hydration mismatch */
  const [employees, setEmployees] = useState<Employee[]>(initialBuiltIns);
  const [hiddenSlugs, setHiddenSlugs] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => {
      void getAllEmployeesMergedAsync().then(setEmployees);
      setHiddenSlugs(getHiddenBuiltinSlugs());
    };

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    window.addEventListener(TEAM_CHANGED_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
      window.removeEventListener(TEAM_CHANGED_EVENT, sync);
    };
  }, []);

  return (
    <>
      <header className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-2">
          <h2 className="w-full text-center text-base font-bold leading-snug text-stone-100 sm:w-auto sm:text-start sm:text-lg">
            انت مين ياسطا؟
          </h2>
          <span
            className="animate-badge-pop max-w-full rounded-2xl px-3 py-2 text-center text-[11px] font-bold leading-snug text-white sm:rounded-full sm:py-1 sm:text-xs sm:leading-normal"
            style={{
              background: "linear-gradient(135deg, #F58220, #d96e15)",
            }}
          >
            <span className="whitespace-normal sm:whitespace-nowrap">
              {employees.length} في الفريق (ربنا يزيد ويبارك)
            </span>
          </span>
        </div>
        <p className="text-start text-pretty text-base font-semibold leading-relaxed text-stone-200">
          لو مش موجود في القائمه هات ما يثبت انك في التيم وابعتلي اضيفك في
          القايمه - تطبق الشروط والاحكام
        </p>
        <p className="text-start text-pretty text-base font-semibold leading-relaxed text-stone-200">
          ياعم والله ما مزعلك،{" "}
          <Link
            href="/join"
            className="font-semibold text-orange-400 underline-offset-4 transition-colors hover:text-orange-300 hover:underline py-1.5 touch-manipulation"
          >
            ادخل هنا
          </Link>{" "}
          ضيف البيانات بتاعتك وهتنضاف وهتفطر و خلي الفقير ياكل
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {employees.map((employee, index) => (
          <EmployeeCard key={employee.slug} employee={employee} index={index} />
        ))}
      </div>

      {hiddenSlugs.length > 0 ? (
        <div
          className="mt-10 rounded-2xl border border-white/10 bg-stone-950/40 p-5"
          style={{ borderColor: "rgba(245,130,32,0.2)" }}
        >
          <h3 className="mb-3 text-sm font-bold text-stone-300">
            موظفين مخفيين (استعادة)
          </h3>
          <ul className="space-y-2">
            {hiddenSlugs.map((slug) => (
              <li
                key={slug}
                className="flex flex-col gap-2 rounded-xl border border-white/5 bg-stone-950/30 p-3 sm:flex-row sm:items-center sm:justify-between sm:border-0 sm:bg-transparent sm:p-0"
              >
                <span className="min-w-0 break-words text-sm text-stone-400">
                  {hiddenBuiltinDisplayName(slug)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    unhideBuiltinSlug(slug);
                    void getAllEmployeesMergedAsync().then(setEmployees);
                    setHiddenSlugs(getHiddenBuiltinSlugs());
                  }}
                  className="min-h-[44px] w-full shrink-0 rounded-lg border border-orange-500/35 px-3 py-2 text-xs font-semibold text-orange-300 hover:bg-orange-500/10 sm:min-h-0 sm:w-auto sm:py-1"
                >
                  إظهار تاني
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}
