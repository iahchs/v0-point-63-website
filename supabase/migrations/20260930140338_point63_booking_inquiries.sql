alter table public.services
  add column if not exists duration_minutes integer not null default 60,
  add column if not exists active boolean not null default true;

update public.services
set duration_minutes = case id
  when 'video-photo' then 120
  when '3d-graphics' then 180
  when 'motion-graphics' then 120
  when 'video-editing' then 180
  else 60
end
where duration_minutes = 60;

create extension if not exists btree_gist;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  service_id text not null references public.services(id),
  scheduled_start timestamptz not null,
  scheduled_end timestamptz not null,
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  check (scheduled_end > scheduled_start)
);

create index if not exists bookings_user_id_idx on public.bookings(user_id);
create index if not exists bookings_service_start_idx on public.bookings(service_id, scheduled_start);

do $$
begin
  alter table public.bookings
    add constraint bookings_no_overlap
    exclude using gist (
      service_id with =,
      tstzrange(scheduled_start, scheduled_end, '[)') with &&
    )
    where (status in ('pending','confirmed'));
exception
  when duplicate_object then null;
end $$;

alter table public.bookings enable row level security;

drop policy if exists "Users can read their own bookings" on public.bookings;
create policy "Users can read their own bookings"
  on public.bookings for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own bookings" on public.bookings;
create policy "Users can create their own bookings"
  on public.bookings for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can cancel their own bookings" on public.bookings;
create policy "Users can cancel their own bookings"
  on public.bookings for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select on table public.services to anon, authenticated;
grant select, insert, update on table public.bookings to authenticated;

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  service text not null,
  budget text,
  message text not null,
  status text not null default 'new' check (status in ('new','read','replied','closed')),
  admin_reply text,
  replied_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists inquiries_status_created_idx on public.inquiries(status, created_at desc);
create index if not exists inquiries_email_idx on public.inquiries(email);

alter table public.inquiries enable row level security;

drop policy if exists "Anyone can submit inquiries" on public.inquiries;
create policy "Anyone can submit inquiries"
  on public.inquiries for insert to anon, authenticated
  with check (true);

grant insert on table public.inquiries to anon, authenticated;