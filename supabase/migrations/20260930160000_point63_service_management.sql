alter table public.services
  add column if not exists price_note text;

grant select on table public.services to anon, authenticated;
