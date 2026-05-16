-- طلبات الغداء لكل موظف (بديل localStorage). شغّلها في SQL Editor على Supabase.

create table if not exists public.employee_orders (
  id uuid primary key default gen_random_uuid(),
  employee_slug text not null unique,
  employee_name text not null,
  lines jsonb not null,
  notes text not null default '',
  updated_at timestamptz not null default now()
);

create index if not exists employee_orders_updated_at_idx
  on public.employee_orders (updated_at desc);

alter table public.employee_orders enable row level security;

-- صلاحيات PostgREST (لو اتعمل الجدول من SQL ومحدّهوش أوضاع افتراضية)
grant usage on schema public to anon, authenticated, service_role;
grant select on table public.employee_orders to anon;
grant select, insert, update, delete on table public.employee_orders to service_role;

-- القراءة العامة بالمفتاح anon (صفحة الملخص وتحميل النموذج)
drop policy if exists "employee_orders_select_public" on public.employee_orders;
create policy "employee_orders_select_public"
  on public.employee_orders for select
  using (true);

-- الإدخال والتحديث والحذف من API فقط عبر service role (يتجاوز RLS)

-- بعد إنشاء جدول جديد، أحيانًا PostgREST يطلع: "Could not find the table ... in the schema cache"
-- السطر ده يحدّث الكاش فورًا (لو مااشتغلش، استنى دقيقة أو من Dashboard: Settings → API → Restart API)
notify pgrst, 'reload schema';
