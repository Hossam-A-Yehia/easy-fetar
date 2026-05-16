"use client";

import Image, { type StaticImageData } from "next/image";
import {
  useCallback,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import {
  TEAM_PHOTO_ALLOWED_TYPES,
  TEAM_PHOTO_MAX_BYTES,
} from "@/lib/team-upload-rules";

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return (parts[0]?.slice(0, 2) ?? "؟").toUpperCase();
}

type Props = {
  label: string;
  helperText: string;
  /** معاينة ملف جديد */
  previewUrl: string | null;
  photoFile: File | null;
  onPick: (file: File | null) => void;
  disabled?: boolean;
  /** للمعاينة الحالية عند التعديل */
  displayName: string;
  remoteImageUrl?: string | null;
  staticFallback?: StaticImageData;
  /** وضع التعديل: مسح الصورة المحفوظة */
  clearPhoto?: boolean;
  onClearPhotoChange?: (next: boolean) => void;
  showPersistedClear?: boolean;
};

export function TeamPhotoPicker({
  label,
  helperText,
  previewUrl,
  photoFile,
  onPick,
  disabled = false,
  displayName,
  remoteImageUrl = null,
  staticFallback,
  clearPhoto = false,
  onClearPhotoChange,
  showPersistedClear = false,
}: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [localHint, setLocalHint] = useState<string | null>(null);

  const validateAndPick = useCallback(
    (file: File | null) => {
      setLocalHint(null);
      if (!file) {
        onPick(null);
        return;
      }
      if (file.size > TEAM_PHOTO_MAX_BYTES) {
        setLocalHint("حجم الملف أكبر من ٣ ميجابايت.");
        if (inputRef.current) inputRef.current.value = "";
        return;
      }
      const mime = file.type || "application/octet-stream";
      if (!TEAM_PHOTO_ALLOWED_TYPES.has(mime)) {
        setLocalHint("النوع غير مدعوم. استخدم JPG أو PNG أو WebP أو GIF.");
        if (inputRef.current) inputRef.current.value = "";
        return;
      }
      onPick(file);
    },
    [onPick],
  );

  const onInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      validateAndPick(e.target.files?.[0] ?? null);
    },
    [validateAndPick],
  );

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled) return;
      const f = e.dataTransfer.files?.[0];
      validateAndPick(f ?? null);
    },
    [disabled, validateAndPick],
  );

  const showRemote =
    Boolean(remoteImageUrl) && !previewUrl && !clearPhoto;
  const showStatic =
    Boolean(staticFallback) && !previewUrl && !clearPhoto && !remoteImageUrl;
  const labelShort = initialsFromName(displayName);

  const hasPersistedVisual =
    Boolean(remoteImageUrl || staticFallback) && !previewUrl;

  return (
    <div className="space-y-2">
      <span className="block text-sm font-semibold text-stone-200">{label}</span>

      <div className="rounded-2xl border border-white/10 bg-stone-950/35 p-4 shadow-inner shadow-black/20">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          {/* معاينة دائرية */}
          <div
            className="relative h-[7.25rem] w-[7.25rem] shrink-0 overflow-hidden rounded-full border-2 border-white/15 bg-stone-900 ring-2 ring-orange-500/15 ring-offset-2 ring-offset-stone-950"
          >
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="معاينة الصورة الجديدة"
                fill
                sizes="116px"
                className="object-cover"
                unoptimized
              />
            ) : clearPhoto ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-0.5 bg-stone-950/90 px-2 text-center">
                <span className="text-xl text-stone-500">—</span>
                <span className="text-[10px] font-medium leading-tight text-stone-500">
                  ستُزال عند الحفظ
                </span>
              </div>
            ) : showRemote && remoteImageUrl ? (
              <Image
                src={remoteImageUrl}
                alt=""
                fill
                sizes="116px"
                className="object-cover"
              />
            ) : showStatic && staticFallback ? (
              <Image
                src={staticFallback}
                alt=""
                fill
                sizes="116px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-800 to-stone-950">
                <span className="text-2xl font-bold tracking-tight text-orange-400/90">
                  {labelShort}
                </span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-3">
            <label
              htmlFor={inputId}
              onDragOver={(e) => {
                e.preventDefault();
                if (!disabled) setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={[
                "flex cursor-pointer flex-col gap-2 rounded-xl border-2 border-dashed px-4 py-4 transition-colors",
                dragOver
                  ? "border-orange-500/55 bg-orange-500/10"
                  : "border-white/15 bg-stone-950/40 hover:border-orange-500/35 hover:bg-stone-900/40",
                disabled ? "pointer-events-none opacity-60" : "",
              ].join(" ")}
            >
              <input
                ref={inputRef}
                id={inputId}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                disabled={disabled}
                onChange={onInputChange}
              />
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    className="h-5 w-5"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M7 20h10a2 2 0 002-2V8a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-sm font-medium text-stone-200">
                    اسحب الصورة وأفلتها هنا
                  </p>
                  <p className="text-xs text-stone-500">
                    أو اضغط لاختيار ملف من الجهاز
                  </p>
                </div>
              </div>
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={disabled}
                onClick={() => inputRef.current?.click()}
                className="rounded-xl border border-white/12 bg-stone-900/80 px-3 py-2 text-xs font-semibold text-stone-200 transition-colors hover:border-orange-500/40 hover:bg-stone-800 disabled:opacity-50"
              >
                استعراض الملفات
              </button>
              {photoFile ? (
                <>
                  <span
                    className="max-w-[200px] truncate text-xs text-stone-400"
                    title={photoFile.name}
                  >
                    {photoFile.name}
                  </span>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      validateAndPick(null);
                      if (inputRef.current) inputRef.current.value = "";
                    }}
                    className="text-xs font-semibold text-stone-500 underline-offset-2 hover:text-orange-400 hover:underline disabled:opacity-50"
                  >
                    إلغاء الصورة الجديدة
                  </button>
                </>
              ) : null}
            </div>

            {showPersistedClear && onClearPhotoChange && hasPersistedVisual ? (
              <button
                type="button"
                disabled={disabled}
                onClick={() => onClearPhotoChange(!clearPhoto)}
                className={[
                  "w-full rounded-xl px-3 py-2 text-xs font-semibold transition-colors sm:w-auto",
                  clearPhoto
                    ? "border border-orange-500/40 bg-orange-500/15 text-orange-200"
                    : "border border-white/10 bg-transparent text-stone-400 hover:border-red-500/30 hover:bg-red-950/30 hover:text-red-300",
                ].join(" ")}
              >
                {clearPhoto
                  ? "إلغاء مسح الصورة المحفوظة"
                  : "مسح الصورة المحفوظة (الافتراضي أو بدون صورة)"}
              </button>
            ) : null}

            {localHint ? (
              <p className="text-xs font-medium text-amber-400" role="status">
                {localHint}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <p className="text-xs text-stone-500">{helperText}</p>
    </div>
  );
}
