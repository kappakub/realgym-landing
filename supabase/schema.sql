-- ตารางเก็บผล HYROX Simulation ของสมาชิก (รันครั้งเดียวใน Supabase > SQL Editor)
create table if not exists public.hyrox_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  date date not null,
  mode text not null check (mode in ('hyrox', 'custom')),
  title text not null default '',
  division text not null default '',
  segments jsonb not null default '[]'::jsonb,
  total_ms integer not null default 0,
  note text not null default ''
);

create index if not exists hyrox_sessions_user_date on public.hyrox_sessions (user_id, date desc);

-- ให้แต่ละคนเห็น/แก้ได้เฉพาะข้อมูลของตัวเอง
alter table public.hyrox_sessions enable row level security;

drop policy if exists "own rows select" on public.hyrox_sessions;
drop policy if exists "own rows insert" on public.hyrox_sessions;
drop policy if exists "own rows delete" on public.hyrox_sessions;

create policy "own rows select" on public.hyrox_sessions
  for select to authenticated using (auth.uid() = user_id);
create policy "own rows insert" on public.hyrox_sessions
  for insert to authenticated with check (auth.uid() = user_id);
create policy "own rows delete" on public.hyrox_sessions
  for delete to authenticated using (auth.uid() = user_id);
