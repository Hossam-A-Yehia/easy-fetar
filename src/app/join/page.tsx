import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { JoinTeamForm } from "@/components/JoinTeamForm";

export default function JoinTeamPage() {
  return (
    <div className="mx-auto max-w-lg space-y-8">
      <nav className="animate-fade-in-up flex flex-wrap items-center gap-2 text-sm text-stone-500">
        <Link
          href="/"
          className="inline-flex items-center gap-1 font-medium text-stone-400 no-underline transition-colors duration-200 hover:text-orange-400"
        >
          الرئيسية
        </Link>
      </nav>

      <div
        className="animate-hero-in rounded-3xl p-8"
        style={{
          background:
            "linear-gradient(135deg, rgba(245,130,32,0.14) 0%, rgba(28,30,24,0.92) 50%, rgba(245,130,32,0.08) 100%)",
          border: "1px solid rgba(245,130,32,0.22)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="mb-6 space-y-2 text-center">
          <h1 className="text-2xl font-black sm:text-3xl">
            <span className="gradient-text">انضم لفريق {BRAND.arName}</span>
          </h1>
          <p className="text-sm leading-relaxed text-stone-400">
          اكتب اسمك يا باشا علشان تنضم لافشخ تيم في المجره ويحصلك الشرف وتشتغل مع اجمد فرونت ايند في الكوكب اللي هو انا وماتنساش تحط صورتك علشان احنا بننسي الناس بسرعه مش عايزين مناهده بالله عليك           </p>
        </div>

        <JoinTeamForm />
      </div>
    </div>
  );
}
