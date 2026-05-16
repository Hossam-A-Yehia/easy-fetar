"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, type FormEvent } from "react";
import { TeamPhotoPicker } from "@/components/TeamPhotoPicker";
import {
  addGuestEmployee,
  saveGuestToLocalStorage,
} from "@/lib/team-members-store";

type ApiJoinResponse =
  | { ok: true; employee: { id: string; slug: string; name: string; imageUrl: string | null } }
  | { ok: false; code?: string; detail?: string };

function mapApiError(code: string | undefined): string {
  switch (code) {
    case "empty_name":
      return "اكتب الاسم.";
    case "file_too_large":
      return "حجم الصورة كبير (حد أقصى ٣ ميجا).";
    case "bad_type":
      return "نوع الملف غير مدعوم. استخدم JPG أو PNG أو WebP أو GIF.";
    case "upload_failed":
      return "فشل رفع الصورة. حاول مرة تانية.";
    case "insert_failed":
      return "فشل حفظ البيانات. جرّب تاني.";
    case "bad_form":
      return "البيانات وصلت غلط. حدّث الصفحة.";
    default:
      return "حصل خطأ. جرّب تاني أو حدّث الصفحة.";
  }
}

export function JoinTeamForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onPickPhoto = useCallback((file: File | null) => {
    setPhotoFile(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
  }, []);

  const submit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError(null);
      const trimmed = name.trim();
      if (!trimmed) {
        setError("اكتب الاسم.");
        return;
      }

      setBusy(true);
      try {
        const fd = new FormData();
        fd.set("name", trimmed);
        if (photoFile && photoFile.size > 0) {
          fd.set("photo", photoFile);
        }

        const res = await fetch("/api/team/join", { method: "POST", body: fd });
        const data = (await res.json().catch(() => ({}))) as ApiJoinResponse;

        if (res.ok && data.ok && data.employee) {
          saveGuestToLocalStorage({
            id: data.employee.id,
            slug: data.employee.slug,
            name: data.employee.name,
            imageUrl: data.employee.imageUrl,
          });
          router.push(`/employee/${encodeURIComponent(data.employee.slug)}`);
          return;
        }

        if (res.status === 503) {
          if (photoFile && photoFile.size > 0) {
            setError(
              "السيرفر مش مضبوط لرفع الصور حالياً. ثبّت متغيرات Supabase أو سجّل من غير صورة.",
            );
            setBusy(false);
            return;
          }
          const row = addGuestEmployee(trimmed, null);
          router.push(`/employee/${encodeURIComponent(row.slug)}`);
          return;
        }

        const code =
          typeof data === "object" && data && "code" in data
            ? String((data as { code?: string }).code)
            : undefined;
        setError(mapApiError(code));
        setBusy(false);
      } catch {
        setError("حصل خطأ. جرّب تاني أو حدّث الصفحة.");
        setBusy(false);
      }
    },
    [name, photoFile, router],
  );

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="guest-name"
          className="block text-sm font-semibold text-stone-200"
        >
          الاسم في القائمة
        </label>
        <input
          id="guest-name"
          autoComplete="name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError(null);
          }}
          maxLength={80}
          disabled={busy}
          placeholder="مثال: محمد أحمد"
          className="w-full rounded-2xl border border-white/10 bg-stone-950/50 px-4 py-3 text-stone-100 outline-none placeholder:text-stone-600 focus-visible:border-orange-500/55 focus-visible:ring-2 focus-visible:ring-orange-500/30 disabled:opacity-70"
          dir="auto"
        />
      </div>

      <TeamPhotoPicker
        label="صورتك (اختياري)"
        helperText="JPG أو PNG أو WebP أو GIF — بحد أقصى ٣ ميجابايت."
        previewUrl={previewUrl}
        photoFile={photoFile}
        onPick={(file) => {
          onPickPhoto(file);
          if (error) setError(null);
        }}
        disabled={busy}
        displayName={name.trim() || "؟"}
      />

      {error ? (
        <p className="text-sm font-medium text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="btn-primary relative z-10 flex w-full items-center justify-center py-3 text-base font-bold disabled:pointer-events-none disabled:opacity-60"
      >
        <span>{busy ? "جاري…" : "تسجيل والذهاب للطلب"}</span>
      </button>
    </form>
  );
}
