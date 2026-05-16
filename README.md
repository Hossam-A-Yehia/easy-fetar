# إيزي فطار · Easy Fetar

موقع Next.js لواجهة خفيفة لعرض الفريق وصفحة انضمام للضيوف، مع ربط اختياري بـ Supabase للبيانات والصور.

## المتطلبات

- Node.js 20+
- حساب [Supabase](https://supabase.com) (اختياري للتطوير المحلي بدون قاعدة — يعتمد على ما تشغّله في الكود)

## تشغيل المشروع محليًا

```bash
npm install
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000).

## متغيرات البيئة

1. انسخ `.env.local.example` إلى `.env.local`.
2. ضع من لوحة Supabase: **Project URL**، **anon key**، و**service role** (للواجهات الخلفية التي تتجاوز RLS فقط — لا ترفعها للمتصفح).

> لا تشارك مفتاح الـ service role علنًا ولا ترفعه إلى Git.

## قاعدة البيانات (Supabase)

شغّل السكربت في **SQL Editor** على مشروعك:

`supabase/schema-guest-team.sql`

يُنشئ جدول أعضاء الفريق الضيوف، سياسات القراءة العامة، وباكت التخزين `team-avatars` للصور.

## السكربتات

| الأمر        | الوظيفة              |
| ------------ | -------------------- |
| `npm run dev`    | خادم التطوير         |
| `npm run build`  | بناء الإنتاج         |
| `npm run start`  | تشغيل بعد البناء     |
| `npm run lint`   | ESLint               |

## التقنية

Next.js (App Router) · React 19 · Tailwind CSS v4 · TypeScript · Supabase JS · Sonner للإشعارات

## النشر

مناسب للنشر على [Vercel](https://vercel.com) أو أي استضافة تدعم Next.js؛ أضف نفس متغيرات البيئة في لوحة الاستضافة.
