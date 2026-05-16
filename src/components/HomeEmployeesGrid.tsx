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
      <div className="gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-stone-100">
            انت مين ياسطا؟{" "}
          </h2>
          <span
            className="animate-badge-pop rounded-full px-3 py-0.5 text-xs font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #F58220, #d96e15)",
            }}
          >
            {employees.length} واحد في الفريق (ربنا يزيد ويبارك)
          </span>
        </div>
        <h2 className="mt-1 text-base font-semibold leading-relaxed text-stone-200">
          لو مش موجود في القائمه هات ما يثبت انك في التيم وابعتلي اضيفك في
          القايمه - تطبق الشروط والاحكام
        </h2>
        <h2 className="mt-1 text-base font-semibold leading-relaxed text-stone-200">
          ياعم والله ما مزعلك،
          <Link
            href="/join"
            className="font-semibold text-orange-400 underline-offset-4 transition-colors hover:text-orange-300 hover:underline"
          >
            ادخل هنا
          </Link>{" "}
          ضيف البيانات بتاعتك وهتنضاف وهتفطر و خلي الفقير ياكل
        </h2>
      </div>

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
                className="flex flex-wrap items-center justify-between gap-2 text-sm text-stone-400"
              >
                <span>{hiddenBuiltinDisplayName(slug)}</span>
                <button
                  type="button"
                  onClick={() => {
                    unhideBuiltinSlug(slug);
                    void getAllEmployeesMergedAsync().then(setEmployees);
                    setHiddenSlugs(getHiddenBuiltinSlugs());
                  }}
                  className="rounded-lg border border-orange-500/35 px-3 py-1 text-xs font-semibold text-orange-300 hover:bg-orange-500/10"
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
