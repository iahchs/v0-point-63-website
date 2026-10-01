-- Supporting indexes for server-side admin filtering without changing existing records.
create index if not exists bookings_service_id_idx on public.bookings(service_id);
create index if not exists bookings_user_id_idx on public.bookings(user_id);
create index if not exists bookings_scheduled_start_idx on public.bookings(scheduled_start);
create index if not exists bookings_status_idx on public.bookings(status);
create index if not exists requests_status_created_idx on public.requests(status, created_at desc);
