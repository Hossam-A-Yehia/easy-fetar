-- شغّل السكربت ده في SQL Editor على مشروع Supabase (أو انسخ الأجزاء المناسبة).
-- 1) جدول أعضاء الفريق الضيوف + صورة من Storage

create table if not exists public.guest_team_members (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists guest_team_members_created_at_idx
  on public.guest_team_members (created_at);

alter table public.guest_team_members enable row level security;

-- قراءة عامة للقائمة وصفحة الموظف (بمفتاح anon)
create policy "guest_team_members_select_public"
  on public.guest_team_members for select
  using (true);

-- الإدخال والتعديل من API فقط عبر service role (يتجاوز RLS)

-- 2) باكت الصور (لو مش موجود)

insert into storage.buckets (id, name, public)
values ('team-avatars', 'team-avatars', true)
on conflict (id) do update set public = excluded.public;

-- أي حد يقدر يشوف الملفات في الباكت العام
create policy "team_avatars_public_read"
  on storage.objects for select
  using (bucket_id = 'team-avatars');

-- 3) اختياري — عمود updated_at يحسّن كسر كاش الصورة بعد إعادة تحميل الصفحة فقط
-- (الـ API يشتغل من غيره؛ لو ضفت العمود، عدّل الـ select في guest-team-db ليشمل updated_at)
alter table public.guest_team_members add column if not exists updated_at timestamptz;
update public.guest_team_members set updated_at = created_at where updated_at is null;
alter table public.guest_team_members alter column updated_at set default now();
alter table public.guest_team_members alter column updated_at set not null;
