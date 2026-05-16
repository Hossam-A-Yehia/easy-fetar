"use client";

import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "لأ، رجوع",
  variant = "default",
  onConfirm,
  onCancel,
}: Props) {
  const onCancelRef = useRef(onCancel);
  const onConfirmRef = useRef(onConfirm);

  useEffect(() => {
    onCancelRef.current = onCancel;
    onConfirmRef.current = onConfirm;
  }, [onCancel, onConfirm]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancelRef.current();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  const confirmStyle =
    variant === "danger"
      ? {
          background: "linear-gradient(135deg, rgba(127,29,29,0.9), rgba(69,10,10,0.95))",
          border: "1.5px solid rgba(248,113,113,0.45)",
          color: "#fecaca",
        }
      : {
          background: "linear-gradient(135deg, #F58220, #d96e15)",
          border: "1px solid rgba(245,130,32,0.5)",
          color: "#fff",
        };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="إغلاق"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        onClick={() => onCancelRef.current()}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        className="animate-fade-in-up relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/50"
        style={{
          background: "var(--surface)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div
          className="border-b border-white/5 px-5 py-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(245,130,32,0.08), transparent)",
          }}
        >
          <h2
            id="confirm-dialog-title"
            className="text-lg font-bold text-stone-100"
          >
            {title}
          </h2>
        </div>
        <p
          id="confirm-dialog-desc"
          className="px-5 py-4 text-sm leading-relaxed text-stone-400"
        >
          {description}
        </p>
        <div className="flex flex-wrap justify-end gap-2 border-t border-white/5 bg-stone-950/40 px-5 py-4">
          <button
            type="button"
            onClick={() => onCancelRef.current()}
            className="rounded-xl border border-white/10 bg-stone-900/80 px-4 py-2.5 text-sm font-semibold text-stone-300 transition-all hover:bg-stone-800"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => onConfirmRef.current()}
            className="rounded-xl px-4 py-2.5 text-sm font-bold shadow-lg transition-all hover:opacity-95 active:scale-[0.98]"
            style={confirmStyle}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
