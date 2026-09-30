create extension if not exists btree_gist;

create table if not exists public.services (
  id text primary key,
  title text not null,
  description text not null default '',
  features jsonb not null default '[]'::jsonb,
  video_url text,
  price_note text,
  sort_order integer not null default 0,
  duration_minutes integer not null default 60,
  active boolean not null default true
);

grant select on public.services to anon, authenticated;

create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  type text not null check (type in ('inquiry','booking')),
  name text not null,
  email text not null,
  phone text,
  status text not null default 'new' check (status in ('new','pending','confirmed','replied','completed','cancelled','closed')),
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  budget text,
  message text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (type = 'inquiry' or (user_id is not null and scheduled_start is not null and scheduled_end is not null and scheduled_end > scheduled_start))
);

create table if not exists public.request_services (
  request_id uuid not null references public.requests(id) on delete cascade,
  service_id text not null references public.services(id),
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  status text not null default 'new' check (status in ('new','pending','confirmed','replied','completed','cancelled','closed')),
  primary key (request_id, service_id),
  check (scheduled_end is null or scheduled_start is not null and scheduled_end > scheduled_start)
);

create index if not exists requests_user_created_idx on public.requests(user_id, created_at desc);
create index if not exists requests_type_status_idx on public.requests(type, status, created_at desc);

create or replace function public.set_requests_updated_at() returns trigger language plpgsql set search_path = public as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists requests_updated_at on public.requests;
create trigger requests_updated_at before update on public.requests for each row execute function public.set_requests_updated_at();

do $$ begin
  alter table public.request_services add constraint request_services_no_overlap exclude using gist (service_id with =, tstzrange(scheduled_start, scheduled_end, '[)') with &&) where (status in ('pending','confirmed') and scheduled_start is not null and scheduled_end is not null);
exception when duplicate_object then null; end $$;

alter table public.requests enable row level security;
alter table public.request_services enable row level security;

drop policy if exists requests_public_insert on public.requests;
create policy requests_public_insert on public.requests for insert to anon, authenticated with check (type = 'inquiry' or ((select auth.uid()) = user_id));
drop policy if exists requests_owner_select on public.requests;
create policy requests_owner_select on public.requests for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists requests_owner_update on public.requests;
create policy requests_owner_update on public.requests for update to authenticated using ((select auth.uid()) = user_id and status = 'pending') with check ((select auth.uid()) = user_id and status = 'cancelled');

drop policy if exists request_services_owner_select on public.request_services;
create policy request_services_owner_select on public.request_services for select to authenticated using (exists (select 1 from public.requests r where r.id = request_id and r.user_id = (select auth.uid())));
drop policy if exists request_services_public_insert on public.request_services;
create policy request_services_public_insert on public.request_services for insert to anon, authenticated with check (exists (select 1 from public.requests r where r.id = request_id and (r.type = 'inquiry' or r.user_id = (select auth.uid()))));

grant select on public.requests, public.request_services to authenticated;
grant insert on public.requests, public.request_services to anon, authenticated;
grant update on public.requests to authenticated;

create table if not exists public.services (
  id text primary key,
  title text not null,
  description text not null default '',
  features jsonb not null default '[]'::jsonb,
  video_url text,
  price_note text,
  sort_order integer not null default 0,
  duration_minutes integer not null default 60,
  active boolean not null default true
);

grant select on public.services to anon, authenticated;

insert into public.services (id, title, description, active, duration_minutes, sort_order)
values
  ('video-photo','Video & Photo Shoot','Professional video production and photography.',true,120,0),
  ('3d-graphics','3D Graphics','3D modeling, CGI, and visual effects.',true,180,1),
  ('motion-graphics','Motion Graphics','Motion design and animation.',true,120,2),
  ('video-editing','Video & Commercial Editing','Editing, color, sound, and final delivery.',true,180,3)
on conflict (id) do nothing;

create or replace view public.booking_requests as
select r.*, rs.service_id, rs.scheduled_start as service_scheduled_start, rs.scheduled_end as service_scheduled_end
from public.requests r join public.request_services rs on rs.request_id = r.id
where r.type = 'booking';

grant select on public.booking_requests to authenticated;

-- Existing bookings and inquiries remain untouched; this migration adds the unified model for new submissions.
-- Admin/service-role reads continue to work independently of these customer policies.

update public.requests set updated_at = now() where updated_at is null;

alter table public.requests alter column updated_at set default now();

create index if not exists request_services_service_schedule_idx on public.request_services(service_id, scheduled_start, scheduled_end);

-- Keep service durations available for server-side booking calculation when the legacy table exists.
alter table public.services add column if not exists duration_minutes integer not null default 60;
alter table public.services add column if not exists active boolean not null default true;

update public.services set duration_minutes = case id when 'video-photo' then 120 when '3d-graphics' then 180 when 'motion-graphics' then 120 when 'video-editing' then 180 else duration_minutes end;

revoke all on public.booking_requests from anon;

create or replace function public.prevent_booking_status_change() returns trigger language plpgsql set search_path = public as $$ begin if old.type = 'booking' and new.status not in ('cancelled') and new.status <> old.status then raise exception 'booking status is managed by staff'; end if; return new; end; $$;
drop trigger if exists requests_status_guard on public.requests;
create trigger requests_status_guard before update on public.requests for each row execute function public.prevent_booking_status_change();

alter table public.requests add constraint requests_email_format check (email ~* '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$');

-- Create the service columns before dependent policies/views are evaluated on fresh installs.
comment on table public.requests is 'Unified Point 63 customer inquiries and booking requests';
comment on table public.request_services is 'Services selected for a unified customer request';

revoke update on public.requests from authenticated;
grant update (status) on public.requests to authenticated;

create or replace function public.cancel_own_booking(request_id uuid) returns void language plpgsql security invoker set search_path = public as $$ begin update public.requests set status = 'cancelled' where id = request_id and user_id = auth.uid() and type = 'booking' and status = 'pending'; end; $$;
grant execute on function public.cancel_own_booking(uuid) to authenticated;

-- Ensure inquiry rows can be created without an account while booking rows remain auth-bound by the check above.
comment on column public.requests.user_id is 'Null for guest inquiries; required for bookings';

alter table public.request_services alter column status set default 'new';

-- The exclusion constraint is the database-level overlap guard for pending and confirmed services.
comment on constraint request_services_no_overlap on public.request_services is 'Prevents overlapping pending or confirmed bookings for the same service';

-- No legacy rows are migrated because the live database contains no bookings/inquiries tables; existing installations retain their old data.

