"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { BreadType, Employee, OrderLine } from "@/types";
import {
  MENU_CATEGORY_ORDER,
  MENU_ITEMS,
  getMenuItemById,
} from "@/data/menu";
import { BreadSelector } from "@/components/BreadSelector";
import { DynamicOptions } from "@/components/DynamicOptions";
import { upsertLocalOrder, getOrderForEmployee } from "@/lib/orders-store";
import { breadLabel } from "@/lib/bread";

type Props = {
  employee: Employee;
};

type ItemDraft = {
  bread: BreadType | "";
  quantity: number;
  saladTahini: boolean | null;
};

function buildInitialSelection(slug: string): Record<string, ItemDraft> {
  const existing = getOrderForEmployee(slug);
  const out: Record<string, ItemDraft> = {};
  if (existing?.lines?.length) {
    for (const l of existing.lines) {
      out[l.menuItemId] = {
        bread: l.breadType,
        quantity: l.quantity,
        saladTahini: l.saladAndTahini,
      };
    }
  }
  return out;
}

function orderedSelectedIds(selected: Record<string, ItemDraft>): string[] {
  const ids = new Set(Object.keys(selected));
  const ordered: string[] = [];
  for (const m of MENU_ITEMS) {
    if (ids.has(m.id)) ordered.push(m.id);
  }
  return ordered;
}

export function OrderForm({ employee }: Props) {
  const router = useRouter();
  const itemsByCategory = useMemo(() => {
    const map = new Map<string, typeof MENU_ITEMS>();
    for (const cat of MENU_CATEGORY_ORDER) {
      map.set(
        cat,
        MENU_ITEMS.filter((m) => m.category === cat),
      );
    }
    return map;
  }, []);

  const [selected, setSelected] = useState<Record<string, ItemDraft>>(() =>
    buildInitialSelection(employee.slug),
  );
  const [notes, setNotes] = useState(() => {
    const existing = getOrderForEmployee(employee.slug);
    return existing?.notes?.trim() ?? "";
  });
  const [status, setStatus] = useState<"idle" | "error">("idle");
  const [message, setMessage] = useState("");

  function toggleItem(menuItemId: string, checked: boolean) {
    setSelected((prev) => {
      if (!checked) {
        const next = { ...prev };
        delete next[menuItemId];
        return next;
      }
      return {
        ...prev,
        [menuItemId]: { bread: "", quantity: 1, saladTahini: null },
      };
    });
  }

  function patchItem(menuItemId: string, patch: Partial<ItemDraft>) {
    setSelected((prev) => {
      if (!prev[menuItemId]) return prev;
      return { ...prev, [menuItemId]: { ...prev[menuItemId], ...patch } };
    });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    setMessage("");

    const ids = orderedSelectedIds(selected);
    if (ids.length === 0) {
      setStatus("error");
      setMessage("يا عم اختار حاجة واحدة على الأقل — علّم ✓ جنب أي صنف.");
      return;
    }

    const built: OrderLine[] = [];
    for (const menuItemId of ids) {
      const draft = selected[menuItemId];
      const item = getMenuItemById(menuItemId);
      if (!item || !draft) continue;

      if (!draft.bread) {
        setStatus("error");
        setMessage(`لسه مختارش العيش لـ«${item.name}» — قولنا شامي ولا بلدي.`);
        return;
      }
      if (draft.quantity < 1 || !Number.isFinite(draft.quantity)) {
        setStatus("error");
        setMessage(`الكمية دي مش مظبوطة في «${item.name}» — راجع الرقم كده.`);
        return;
      }
      const needs = item.needsSaladTahiniOption;
      if (needs && draft.saladTahini === null) {
        setStatus("error");
        setMessage(
          `لفّ عند «${item.name}» وقولنا سلطة وطحينة إيه الحكاية.`,
        );
        return;
      }

      built.push({
        menuItemId: item.id,
        menuItemName: item.name,
        breadType: draft.bread,
        quantity: draft.quantity,
        saladAndTahini: needs ? draft.saladTahini : null,
      });
    }

    upsertLocalOrder({
      employeeSlug: employee.slug,
      employeeName: employee.name,
      lines: built,
      notes: notes.trim(),
    });

    setStatus("idle");
    setMessage("");
    toast.success("تمام يا فنان — الأوردر اتسجّل 👌", {
      description:
        "يلا بصّ على الملخص: هتلاقي طلبك مع لمة الفريق… وبالهنا والشفا.",
    });
    router.push("/summary");
  }

  const previewIds = orderedSelectedIds(selected);

  return (
    <form
      onSubmit={submit}
      className="animate-fade-in-up mx-auto flex max-w-3xl flex-col gap-8"
      style={{ animationDelay: "100ms" }}
    >
      {/* ── Menu Items ── */}
      <div
        className="overflow-hidden rounded-3xl shadow-lg shadow-black/40"
        style={{
          background: "var(--surface)",
          border: "1px solid rgba(245,130,32,0.22)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Section header */}
        <div
          className="relative overflow-hidden px-6 py-5"
          style={{
            background:
              "linear-gradient(135deg, rgba(245,130,32,0.06) 0%, rgba(245,130,32,0.03) 100%)",
            borderBottom: "1px solid rgba(245,130,32,0.1)",
          }}
        >
          <h2 className="text-base font-bold text-stone-100">
            قولنا هتاكل إيه
          </h2>
          <p className="mt-0.5 text-xs text-stone-500">
            علّم اللي نفسك فيه، وبعدها ظبّط العيش والكمية… وبالهنا والشفا يا صاحبي.
          </p>
        </div>

        <div className="divide-y divide-stone-700/50 px-6 py-4">
          {MENU_CATEGORY_ORDER.map((cat) => {
            const items = itemsByCategory.get(cat) ?? [];
            if (items.length === 0) return null;

            return (
              <section key={cat} className="py-5 first:pt-2">
                {/* Category label */}
                <div className="mb-3 flex items-center gap-2">
                  <div
                    className="h-3 w-1 rounded-full"
                    style={{
                      background:
                        "linear-gradient(180deg, #F58220, #d96e15)",
                    }}
                  />
                  <h3 className="text-sm font-bold text-orange-400">{cat}</h3>
                </div>

                <div className="grid items-start gap-3 sm:grid-cols-2">
                  {items.map((item) => {
                    const isOn = Boolean(selected[item.id]);
                    const draft = selected[item.id];
                    const needsSalad = item.needsSaladTahiniOption;

                    return (
                      <div
                        key={item.id}
                        className="overflow-hidden rounded-2xl transition-all duration-300 ease-out"
                        style={{
                          border: isOn
                            ? "1.5px solid rgba(245,130,32,0.55)"
                            : "1.5px solid rgba(255,255,255,0.08)",
                          background: isOn
                            ? "linear-gradient(135deg, rgba(245,130,32,0.14) 0%, rgba(245,130,32,0.06) 100%)"
                            : "rgba(20,22,18,0.6)",
                          boxShadow: isOn
                            ? "0 4px 16px rgba(245,130,32,0.18)"
                            : "none",
                        }}
                      >
                        <button
                          type="button"
                          aria-expanded={isOn}
                          onClick={() => toggleItem(item.id, !isOn)}
                          className="flex w-full cursor-pointer items-start gap-3 border-0 bg-transparent p-3 text-start outline-none transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-orange-500/40 active:opacity-90"
                        >
                          <span
                            className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-all duration-200"
                            style={{
                              background: isOn
                                ? "linear-gradient(135deg, #F58220, #d96e15)"
                                : "#292524",
                              border: isOn
                                ? "1.5px solid #F58220"
                                : "1.5px solid rgba(255,255,255,0.12)",
                              boxShadow: isOn
                                ? "0 2px 8px rgba(245,130,32,0.3)"
                                : "none",
                            }}
                            aria-hidden
                          >
                            {isOn && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="animate-bounce-in"
                                aria-hidden
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </span>

                          <span
                            className={`flex-1 text-sm font-medium leading-snug transition-colors duration-200 ${
                              isOn ? "text-stone-100" : "text-stone-400"
                            }`}
                          >
                            {item.name}
                          </span>
                        </button>

                        {isOn && draft ? (
                          <div
                            className="animate-fade-in-up border-t px-4 pb-4 pt-3 space-y-4"
                            style={{
                              borderColor: "rgba(245,130,32,0.15)",
                            }}
                          >
                            {needsSalad ? (
                              <DynamicOptions
                                value={draft.saladTahini}
                                onChange={(v) =>
                                  patchItem(item.id, { saladTahini: v })
                                }
                                groupName={item.id}
                              />
                            ) : null}
                            <BreadSelector
                              value={draft.bread}
                              onChange={(v) =>
                                patchItem(item.id, { bread: v })
                              }
                              groupName={`bread-${item.id}`}
                            />
                            <div className="space-y-1.5">
                              <label
                                htmlFor={`qty-${item.id}`}
                                className="text-xs font-bold text-stone-300"
                              >
                                الكمية — قد إيه؟
                              </label>
                              <input
                                id={`qty-${item.id}`}
                                type="number"
                                min={1}
                                step={1}
                                value={draft.quantity}
                                onChange={(e) =>
                                  patchItem(item.id, {
                                    quantity: Number(e.target.value),
                                  })
                                }
                                className="w-full rounded-xl border px-4 py-2.5 text-sm text-stone-100 outline-none transition-all duration-200"
                                style={{
                                  border: "1.5px solid rgba(255,255,255,0.12)",
                                  background: "#1c1917",
                                }}
                                onFocus={(e) => {
                                  e.currentTarget.style.borderColor = "#F58220";
                                  e.currentTarget.style.boxShadow =
                                    "0 0 0 3px rgba(245,130,32,0.2)";
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.borderColor =
                                    "rgba(255,255,255,0.12)";
                                  e.currentTarget.style.boxShadow = "none";
                                }}
                              />
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* ── Notes ── */}
      <div
        className="overflow-hidden rounded-3xl shadow-sm shadow-black/30"
        style={{
          background: "var(--surface)",
          border: "1px solid rgba(245,130,32,0.2)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div
          className="px-6 py-5"
          style={{
            background:
              "linear-gradient(135deg, rgba(245,130,32,0.06) 0%, rgba(245,130,32,0.02) 100%)",
            borderBottom: "1px solid rgba(245,130,32,0.08)",
          }}
        >
          <h2 className="text-base font-bold text-stone-100">
            ملاحظة للمطعم (لو حابب)
          </h2>
          <p className="mt-0.5 text-xs text-stone-500">مش لازم</p>
        </div>
        <div className="p-6">
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="زي: من غير مخلل / زود طحينة / البصل على جمب…"
            className="w-full resize-y rounded-2xl border px-4 py-3 text-sm text-stone-100 outline-none placeholder:text-stone-500 transition-all duration-200"
            style={{
              border: "1.5px solid rgba(255,255,255,0.1)",
              background: "rgba(12,10,8,0.65)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#F58220";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px rgba(245,130,32,0.2)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>
      </div>

      {/* ── Status ── */}
      {status === "error" ? (
        <div
          className="animate-bounce-in flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-medium"
          role="alert"
          style={{
            background:
              "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.05))",
            border: "1.5px solid rgba(239,68,68,0.3)",
            color: "#fca5a5",
          }}
        >
          <span className="text-lg">⚠️</span>
          <span>{message}</span>
        </div>
      ) : null}

      {/* ── Submit ── */}
      <button type="submit" className="btn-primary w-full py-4 text-base">
        <span>احفظ الأوردر</span>
      </button>

      {/* ── Preview ── */}
      {previewIds.length > 0 && (
        <div
          className="animate-fade-in-up rounded-3xl p-5 text-sm"
          style={{
            background:
              "linear-gradient(135deg, rgba(245,130,32,0.05), rgba(245,130,32,0.02))",
            border: "1px solid rgba(245,130,32,0.12)",
          }}
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="text-base">🧾</span>
            <span className="font-bold text-stone-100">شكل الأوردر كده</span>
          </div>
          <ul className="space-y-2">
            {previewIds.map((id) => {
              const m = getMenuItemById(id);
              const draft = selected[id];
              if (!m || !draft) return null;
              if (!draft.bread) {
                return (
                  <li key={id} className="flex items-center gap-2 text-stone-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-stone-600" />
                    {m.name}: كمّل العيش والخيارات يا عم…
                  </li>
                );
              }
              const needs = m.needsSaladTahiniOption;
              let text = `${draft.quantity}× ${m.name} — ${breadLabel(draft.bread)}`;
              if (needs && draft.saladTahini !== null) {
                text += draft.saladTahini
                  ? " — وسلطة وطحينة كده"
                  : " — من غير سلطة ولا طحينة";
              }
              return (
                <li key={id} className="flex items-center gap-2 text-stone-300">
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: "#F58220" }}
                  />
                  {text}
                </li>
              );
            })}
          </ul>
          {notes.trim() ? (
            <p className="mt-3 border-t border-stone-700/60 pt-3 text-stone-500">
              📝 {notes.trim()}
            </p>
          ) : null}
        </div>
      )}

    </form>
  );
}
