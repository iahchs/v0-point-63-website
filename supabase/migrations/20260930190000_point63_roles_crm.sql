create type public.app_role as enum ('customer', 'supervisor', 'admin');

create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_roles_role_idx on public.user_roles(role);
alter table public.user_roles enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security invoker set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = (select auth.uid()) and role = 'admin');
$$;
create or replace function public.is_supervisor_or_admin()
returns boolean language sql stable security invoker set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = (select auth.uid()) and role in ('supervisor','admin'));
$$;

create policy user_roles_self_read on public.user_roles for select to authenticated using (user_id = (select auth.uid()));
create policy user_roles_admin_read on public.user_roles for select to authenticated using ((select public.is_admin()));
create policy user_roles_admin_update on public.user_roles for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

grant select on public.user_roles to authenticated;
grant update (role) on public.user_roles to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_supervisor_or_admin() to authenticated;

create or replace function public.handle_new_user_role()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.user_roles (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created_role on auth.users;
create trigger on_auth_user_created_role after insert on auth.users for each row execute function public.handle_new_user_role();

insert into public.user_roles (user_id)
select id from auth.users on conflict (user_id) do nothing;

create table if not exists public.crm_notes (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete restrict,
  note text not null check (length(btrim(note)) between 1 and 5000),
  created_at timestamptz not null default now()
);
create index if not exists crm_notes_request_created_idx on public.crm_notes(request_id, created_at desc);
alter table public.crm_notes enable row level security;
create policy crm_notes_staff_read on public.crm_notes for select to authenticated using ((select public.is_supervisor_or_admin()));
create policy crm_notes_staff_insert on public.crm_notes for insert to authenticated with check ((select public.is_supervisor_or_admin()) and author_id = (select auth.uid()));
grant select, insert on public.crm_notes to authenticated;

create table if not exists public.request_replies (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete restrict,
  body text not null check (length(btrim(body)) between 1 and 10000),
  created_at timestamptz not null default now()
);
create index if not exists request_replies_request_created_idx on public.request_replies(request_id, created_at desc);
alter table public.request_replies enable row level security;
create policy request_replies_staff_read on public.request_replies for select to authenticated using ((select public.is_supervisor_or_admin()));
create policy request_replies_staff_insert on public.request_replies for insert to authenticated with check ((select public.is_supervisor_or_admin()) and author_id = (select auth.uid()));
grant select, insert on public.request_replies to authenticated;

create table if not exists public.request_activity (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  actor_id uuid not null references auth.users(id) on delete restrict,
  activity_type text not null check (activity_type in ('status_changed','reply_sent','note_added')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists request_activity_request_created_idx on public.request_activity(request_id, created_at desc);
alter table public.request_activity enable row level security;
create policy request_activity_staff_read on public.request_activity for select to authenticated using ((select public.is_supervisor_or_admin()));
create policy request_activity_staff_insert on public.request_activity for insert to authenticated with check ((select public.is_supervisor_or_admin()) and actor_id = (select auth.uid()));
grant select, insert on public.request_activity to authenticated;

do $$
begin
  update public.user_roles set role = 'admin', updated_at = now() where user_id = '00000000-0000-0000-0000-000000000000';
end $$;

create or replace function public.set_user_roles_updated_at() returns trigger language plpgsql set search_path = public as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists user_roles_updated_at on public.user_roles;
create trigger user_roles_updated_at before update on public.user_roles for each row execute function public.set_user_roles_updated_at();

drop policy if exists requests_staff_select on public.requests;
create policy requests_staff_select on public.requests for select to authenticated using ((select public.is_supervisor_or_admin()) or user_id = (select auth.uid()));
drop policy if exists requests_staff_update on public.requests;
create policy requests_staff_update on public.requests for update to authenticated using ((select public.is_supervisor_or_admin())) with check ((select public.is_supervisor_or_admin()));
drop policy if exists request_services_staff_select on public.request_services;
create policy request_services_staff_select on public.request_services for select to authenticated using ((select public.is_supervisor_or_admin()) or exists (select 1 from public.requests r where r.id = request_id and r.user_id = (select auth.uid())));

create index if not exists requests_email_idx on public.requests(lower(email));
create index if not exists requests_created_at_idx on public.requests(created_at desc);

comment on table public.user_roles is 'Point 63 authorization source of truth for Supabase Auth users';
comment on table public.crm_notes is 'Internal staff-only CRM notes';
comment on table public.request_replies is 'Staff reply history';
comment on table public.request_activity is 'Staff request activity history';

insert into public.user_roles (user_id)
select id from auth.users on conflict (user_id) do nothing;
