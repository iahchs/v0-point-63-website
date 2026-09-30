create table if not exists public.site_videos (
  id uuid primary key default gen_random_uuid(),
  slot text not null unique check (slot = btrim(slot) and length(slot) between 1 and 100),
  title text not null check (length(btrim(title)) between 1 and 200),
  video_url text not null check (video_url ~* '^https?://'),
  thumbnail_url text check (thumbnail_url is null or thumbnail_url ~* '^https?://'),
  updated_at timestamptz not null default now()
);

create or replace function public.set_site_videos_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists site_videos_updated_at on public.site_videos;
create trigger site_videos_updated_at before update on public.site_videos for each row execute function public.set_site_videos_updated_at();

alter table public.site_videos enable row level security;
create policy "site videos are publicly readable" on public.site_videos for select using (true);
create policy "admins can insert site videos" on public.site_videos for insert with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "admins can update site videos" on public.site_videos for update using (exists (select 1 from public.admin_users where user_id = auth.uid())) with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "admins can delete site videos" on public.site_videos for delete using (exists (select 1 from public.admin_users where user_id = auth.uid()));

insert into storage.buckets (id, name, public) values ('site-videos', 'site-videos', true) on conflict (id) do update set public = true;
create policy "site videos storage is publicly readable" on storage.objects for select using (bucket_id = 'site-videos');
create policy "admins can upload site videos" on storage.objects for insert with check (bucket_id = 'site-videos' and exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "admins can update site videos" on storage.objects for update using (bucket_id = 'site-videos' and exists (select 1 from public.admin_users where user_id = auth.uid())) with check (bucket_id = 'site-videos' and exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "admins can delete site videos" on storage.objects for delete using (bucket_id = 'site-videos' and exists (select 1 from public.admin_users where user_id = auth.uid()));

comment on table public.site_videos is 'Admin-managed public videos keyed by placement slot.'; 
