import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      {/* Animated 404 */}
      <div className="animate-bounce-in mb-6 relative">
        <div
          className="animate-spin-slow pointer-events-none absolute inset-0 rounded-full opacity-20"
          style={{
            background:
              "conic-gradient(from 0deg, #F58220, rgba(249,167,64,0.5), transparent, #F58220)",
          }}
        />
        <div
          className="relative flex h-32 w-32 items-center justify-center rounded-full"
          style={{
            background:
              "linear-gradient(135deg, rgba(245,130,32,0.12), rgba(245,130,32,0.05))",
            border: "2px solid rgba(245,130,32,0.2)",
          }}
        >
          <span className="animate-float text-5xl">🧆</span>
        </div>
      </div>

      <div
        className="animate-fade-in-up mb-2 text-7xl font-black"
        style={{ animationDelay: "100ms" }}
      >
        <span className="gradient-text">404</span>
      </div>

      <h1
        className="animate-fade-in-up mb-2 text-xl font-bold text-stone-100"
        style={{ animationDelay: "180ms" }}
      >
        يا عم دي مش موجودة 🤷
      </h1>
      <p
        className="animate-fade-in-up mb-8 max-w-xs text-sm text-stone-400"
        style={{ animationDelay: "240ms" }}
      >
        يا إمّا اللينك غلط، يا إمّا الاسم مش متسجّل عندنا… راجع كده وخليك فالسكة.
      </p>

      <div
        className="animate-fade-in-up"
        style={{ animationDelay: "320ms" }}
      >
        <Link
          href="/"
          className="btn-primary inline-flex items-center gap-2 text-sm no-underline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>يلا نرجع البيت</span>
        </Link>
      </div>
    </div>
  );
}
