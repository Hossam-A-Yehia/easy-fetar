import { EMPLOYEES } from "@/data/employees";
import { HomeEmployeesGrid } from "@/components/HomeEmployeesGrid";
import { BRAND } from "@/lib/brand";

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* ── Hero ── */}
      <section className="animate-hero-in relative overflow-hidden rounded-3xl px-6 py-12 text-center sm:px-12 sm:py-16">
        {/* Card background */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(245,130,32,0.14) 0%, rgba(28,30,24,0.78) 55%, rgba(245,130,32,0.06) 100%)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        />
        {/* Decorative spin ring */}
        <div
          aria-hidden
          className="animate-spin-slow pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-20"
          style={{
            background:
              "conic-gradient(from 0deg, #F58220, rgba(249,167,64,0.5), transparent, #F58220)",
          }}
        />
        <div
          aria-hidden
          className="animate-spin-slow pointer-events-none absolute -bottom-16 -left-16  rounded-full opacity-15"
          style={{
            background:
              "conic-gradient(from 180deg, #f9a740, #F58220, transparent, #f9a740)",
            animationDirection: "reverse",
          }}
        />

        {/* Badge */}
        <div className="animate-badge-pop relative mb-5 inline-flex items-center gap-2 rounded-full border border-orange-500/35 bg-stone-900/60 px-4 py-1.5 text-xs font-semibold text-orange-200 shadow-sm backdrop-blur-sm">
          <span
            className="inline-block h-2 w-2 animate-pulse rounded-full"
            style={{ background: "#F58220" }}
          />
          إيزي فطار — منّا ليكم
        </div>

        {/* Heading */}
        <h1
          className="relative mb-4 text-4xl font-black leading-tight sm:text-5xl"
          style={{ animationDelay: "80ms" }}
        >
          <span className="gradient-text">{BRAND.arName}</span>
        </h1>

        {/* Description */}
        <p
          className="animate-fade-in-up relative mx-auto text-base leading-relaxed text-stone-400 sm:text-lg"
          style={{ animationDelay: "150ms" }}
        >
         دوس علي اسمك واختار هتفطر ايه يا صاحبي وبالهنا والشفا علي قلبك 🙌
        </p>

        {/* Floating food icons */}
        <div
          aria-hidden
          className="animate-float pointer-events-none absolute right-8 top-8 text-3xl opacity-30"
          style={{ animationDelay: "0s" }}
        >
          🧆
        </div>
        <div
          aria-hidden
          className="animate-float pointer-events-none absolute bottom-8 left-8 text-3xl opacity-30"
          style={{ animationDelay: "-1.5s" }}
        >
          🥙
        </div>
        <div
          aria-hidden
          className="animate-float pointer-events-none absolute right-20 bottom-10 text-2xl opacity-20"
          style={{ animationDelay: "-3s" }}
        >
          🫓
        </div>
      </section>

      {/* ── Employee Grid ── */}
      <section aria-label="أسماء الفريق" className="space-y-5">
        <HomeEmployeesGrid initialBuiltIns={EMPLOYEES} />
      </section>
    </div>
  );
}
