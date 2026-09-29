create extension if not exists btree_gist;

create table if not exists public.services (
  id text primary key,
  title text not null,
  description text not null default '',
  features jsonb not null default '[]'::jsonb,
  video_url text not null default '',
  sort_order integer not null default 0,
  duration_minutes integer not null default 60 check (duration_minutes > 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.services (id, title, description, features, video_url, sort_order, duration_minutes)
values
  ('video-photo', 'Video & Photo Shoot', 'Professional video production and photography services for commercials, corporate videos, music videos, and creative content. We handle everything from concept to final delivery.', '["Commercial & Advertisement Production","Corporate Video Production","Music Video Production","Product Photography","Event Coverage","Drone Videography"]', '/Video-Shoot.mp4', 0, 120),
  ('3d-graphics', '3D Graphics', 'Stunning 3D modeling, CGI, and visual effects that transform imagination into reality.', '["3D Product Visualization","CGI Environments","Character Design & Animation","Architectural Visualization","Product Rendering","VFX Integration"]', '/3d graphics.mp4', 1, 180),
  ('motion-graphics', 'Motion Graphics', 'Dynamic motion design and animation that brings static content to life.', '["Logo Animation","Explainer Videos","Title Sequences","Social Media Content","Infographic Animation","Broadcast Graphics"]', '/motion.mp4', 2, 120),
  ('video-editing', 'Video & Commercial Editing', 'Expert post-production services that transform raw footage into polished, professional content.', '["Video Editing & Assembly","Color Grading & Correction","Sound Design & Mixing","Visual Effects Compositing","Format Conversion & Export","Revision Management"]', '/Commercial-editing.mp4', 3, 180)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  features = excluded.features,
  video_url = excluded.video_url,
  sort_order = excluded.sort_order,
  duration_minutes = excluded.duration_minutes;

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

alter table public.services enable row level security;
alter table public.bookings enable row level security;

drop policy if exists "Services are publicly readable" on public.services;
create policy "Services are publicly readable"
  on public.services for select
  using (active = true);

drop policy if exists "Users can read their own bookings" on public.bookings;
create policy "Users can read their own bookings"
  on public.bookings for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own bookings" on public.bookings;
create policy "Users can create their own bookings"
  on public.bookings for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can cancel their own bookings" on public.bookings;
create policy "Users can cancel their own bookings"
  on public.bookings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
