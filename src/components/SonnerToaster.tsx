"use client";

import { Toaster } from "sonner";

export function SonnerToaster() {
  return (
    <Toaster
      dir="rtl"
      position="bottom-center"
      theme="dark"
      closeButton
      toastOptions={{
        duration: 4800,
        classNames: {
          toast:
            "font-sans items-start gap-3 border border-orange-500/35 bg-stone-950/95 shadow-xl shadow-black/40 backdrop-blur-md",
          title: "font-bold text-stone-100",
          description: "text-stone-400 !text-stone-400",
          icon: "!text-orange-400",
          closeButton:
            "left-auto right-0 border-white/10 bg-stone-900 text-stone-400",
        },
      }}
    />
  );
}
