-- Preserve the existing bookings relationship while making service availability explicit.
alter table if exists public.services add column if not exists bookable boolean not null default true;

do $$
begin
  if to_regclass('public.bookings') is not null then
    create index if not exists bookings_service_id_idx on public.bookings(service_id);
    create index if not exists bookings_user_id_idx on public.bookings(user_id);
    create index if not exists bookings_scheduled_start_idx on public.bookings(scheduled_start);
    create index if not exists bookings_status_idx on public.bookings(status);
  end if;
end $$;

comment on column public.services.bookable is 'Whether customers may select this service for a new booking';
comment on table public.bookings is 'One row per customer, service, and appointment schedule';
