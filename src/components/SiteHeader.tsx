"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@/assets/logo.png";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/join", label: "انضم للفريق" },
  { href: "/summary", label: "كل الطلبات مع بعض" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="glass-header sticky top-0 z-50 border-b border-white/5 shadow-sm shadow-black/30">
      {/* Gradient top stripe */}
      <div className="h-0.5 bg-gradient-to-r from-[#d96e15] via-[#F58220] to-[#f9a740]" />

      <div className="mx-auto flex max-w-[min(100%,120rem)] flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link
          href="/"
          className="group shrink-0 no-underline"
          aria-label="الرجوع للرئيسية"
        >
          <div className="relative transition-transform duration-300 ease-out group-hover:scale-[1.04]">
            <Image
              src={logo}
              alt=""
              width={logo.width}
              height={logo.height}
              className="h-12 w-auto object-contain"
              priority
            />
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1 text-sm font-medium">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative rounded-xl px-4 py-2 no-underline transition-all duration-200 ${
                  isActive
                    ? "font-semibold text-orange-400"
                    : "text-stone-400 hover:text-orange-400"
                }`}
              >
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-xl opacity-100"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(245,130,32,0.2), rgba(245,130,32,0.06))",
                    }}
                  />
                )}
                <span className="relative z-10">{label}</span>
                {isActive && (
                  <span
                    className="absolute bottom-1 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full"
                    style={{
                      background: "#F58220",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
