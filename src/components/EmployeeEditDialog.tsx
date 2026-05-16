"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Employee } from "@/types";
import { TeamPhotoPicker } from "@/components/TeamPhotoPicker";
import { getEmployeePhoto } from "@/data/employee-images";
import { isBuiltinEmployeeSlug } from "@/data/employees";
import { setBuiltinOverride } from "@/lib/employee-overrides";
import { emitTeamChanged } from "@/lib/team-events";
import { withImageCacheBust } from "@/lib/team-image-display";

type Props = {
  employee: Employee;
  open: boolean;
  onClose: () => void;
};

function mapErr(code: string | undefined): string {
  switch (code) {
    case "empty_name":
      return "اكتب الاسم.";
    case "file_too_large":
      return "حجم الصورة كبير (حد أقصى ٣ ميجا).";
    case "bad_type":
      return "نوع الملف غير مدعوم.";
    case "upload_failed":
      return "فشل رفع الصورة.";
    case "not_configured":
      return "السيرفر مش مضبوط لرفع الصور.";
    case "update_failed":
      return "فشل حفظ التعديل.";
    case "no_file":
      return "اختر ملف صورة.";
    default:
      return "حصل خطأ. حاول تاني.";
  }
}

export function EmployeeEditDialog({ employee, open, onClose }: Props) {
  const [name, setName] = useState(employee.name);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [clearPhoto, setClearPhoto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const previewUrlCleanupRef = useRef<string | null>(null);

  useEffect(() => {
    previewUrlCleanupRef.current = previewUrl;
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      const u = previewUrlCleanupRef.current;
      if (u) URL.revokeObjectURL(u);
    };
  }, []);

  const onPickPhoto = useCallback((file: File | null) => {
    setPhotoFile(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
    if (file) setClearPhoto(false);
  }, []);

  const submit = useCallback(async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("اكتب الاسم.");
      return;
    }
    setBusy(true);
    setError(null);

    try {
      const builtin = isBuiltinEmployeeSlug(employee.slug);

      if (builtin) {
        if (photoFile && photoFile.size > 0) {
          const fd = new FormData();
          fd.set("slug", employee.slug);
          fd.set("file", photoFile);
          const res = await fetch("/api/team/avatar", { method: "POST", body: fd });
          const data = (await res.json()) as { ok?: boolean; url?: string; code?: string };
          if (!res.ok || !data.ok || !data.url) {
            setError(mapErr(data.code));
            setBusy(false);
            return;
          }
          setBuiltinOverride(employee.slug, {
            name: trimmed,
            imageUrl: withImageCacheBust(data.url, new Date().toISOString()),
          });
        } else if (clearPhoto) {
          setBuiltinOverride(employee.slug, { name: trimmed, imageUrl: null });
        } else {
          setBuiltinOverride(employee.slug, { name: trimmed });
        }
        emitTeamChanged();
        onClose();
        return;
      }

      const fd = new FormData();
      fd.set("name", trimmed);
      if (clearPhoto) fd.set("clearPhoto", "1");
      if (photoFile && photoFile.size > 0) fd.set("photo", photoFile);

      const res = await fetch(
        `/api/team/member/${encodeURIComponent(employee.slug)}`,
        { method: "PATCH", body: fd },
      );
      const data = (await res.json()) as {
        ok?: boolean;
        employee?: Employee;
        code?: string;
      };

      if (res.ok && data.ok && data.employee) {
        emitTeamChanged();
        onClose();
        return;
      }

      if (res.status === 503) {
        setError(
          "تعديل أعضاء الفريق محتاج Supabase مفعّل على السيرفر.",
        );
        setBusy(false);
        return;
      }

      if (res.status === 404) {
        setError("مفيش سجل لهذا الاسم في قاعدة البيانات.");
        setBusy(false);
        return;
      }

      setError(mapErr(data.code));
      setBusy(false);
    } catch {
      setError("حصل خطأ. حاول تاني.");
      setBusy(false);
    }
  }, [name, employee.slug, photoFile, clearPhoto, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="إغلاق"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        onClick={() => !busy && onClose()}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="animate-fade-in-up relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
        style={{ background: "var(--surface)", backdropFilter: "blur(16px)" }}
      >
        <div
          className="border-b border-white/5 px-5 py-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(245,130,32,0.12), transparent)",
          }}
        >
          <h2 className="text-lg font-bold text-stone-100">تعديل موظف</h2>
          <p className="mt-1 text-xs text-stone-500">{employee.slug}</p>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div className="space-y-2">
            <label
              htmlFor="edit-emp-name"
              className="block text-sm font-semibold text-stone-200"
            >
              الاسم
            </label>
            <input
              id="edit-emp-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              disabled={busy}
              className="w-full rounded-2xl border border-white/10 bg-stone-950/50 px-4 py-3 text-stone-100 outline-none focus-visible:border-orange-500/55 focus-visible:ring-2 focus-visible:ring-orange-500/30 disabled:opacity-70"
              dir="auto"
            />
          </div>

          <TeamPhotoPicker
            label="الصورة"
            helperText="صيغ مدعومة: JPG وPNG وWebP وGIF — حتى ٣ ميجابايت. اسحب الملف أو اختره من الجهاز."
            previewUrl={previewUrl}
            photoFile={photoFile}
            onPick={(file) => {
              onPickPhoto(file);
              if (error) setError(null);
            }}
            disabled={busy}
            displayName={name.trim() || employee.name}
            remoteImageUrl={employee.imageUrl}
            staticFallback={getEmployeePhoto(employee.slug)}
            clearPhoto={clearPhoto}
            showPersistedClear
            onClearPhotoChange={(next) => {
              setClearPhoto(next);
              if (next) {
                setPhotoFile(null);
                setPreviewUrl((prev) => {
                  if (prev) URL.revokeObjectURL(prev);
                  return null;
                });
              }
            }}
          />

          {error ? (
            <p className="text-sm font-medium text-red-400" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-white/5 bg-stone-950/40 px-5 py-4">
          <button
            type="button"
            disabled={busy}
            onClick={() => onClose()}
            className="rounded-xl border border-white/10 bg-stone-900/80 px-4 py-2.5 text-sm font-semibold text-stone-300 hover:bg-stone-800"
          >
            إلغاء
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void submit()}
            className="rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-lg"
            style={{
              background: "linear-gradient(135deg, #F58220, #d96e15)",
            }}
          >
            {busy ? "جاري…" : "حفظ"}
          </button>
        </div>
      </div>
    </div>
  );
}
