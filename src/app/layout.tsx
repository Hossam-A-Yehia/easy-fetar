import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SonnerToaster } from "@/components/SonnerToaster";
import { BRAND } from "@/lib/brand";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND.arName} | ${BRAND.enName}`,
    template: `%s | ${BRAND.arName}`,
  },
  description: `${BRAND.arName} — سهّلناها عليكم: سجّل فطارك من غير لفّ، ونساعد اللي مسؤول يطلع ملخص للمطعم من غير دوشة.`,
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} dark h-full`}>
      <body className="min-h-screen bg-[color:var(--background)] font-sans text-stone-200 antialiased">
        {/* ── Animated background orbs ── */}
        <div
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
          aria-hidden
        >
          <div
            className="animate-orb-drift absolute -right-48 -top-48 h-[500px] w-[500px] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(245,130,32,0.2) 0%, transparent 70%)",
            }}
          />
          <div
            className="animate-orb-drift-reverse absolute -bottom-48 -left-48 h-[420px] w-[420px] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(245,130,32,0.12) 0%, transparent 70%)",
              animationDelay: "-5s",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #f58220 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="mx-auto w-full max-w-[min(100%,120rem)] flex-1 px-4 py-8 sm:px-8 lg:px-10">
            {children}
          </main>

          {/* Footer gradient line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#F58220]/30 to-transparent" />
          <footer className="py-4 text-center text-xs text-stone-500">
            {BRAND.arName} &mdash; {BRAND.enName}
          </footer>
        </div>
        <SonnerToaster />
      </body>
    </html>
  );
}
