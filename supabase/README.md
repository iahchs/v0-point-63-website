# Point 63 Supabase setup

1. Create a Supabase project.
2. Run `supabase/migrations/20260929000000_booking.sql` in the Supabase SQL Editor.
3. Add these Vercel environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Enable Email authentication in Supabase Auth.
5. Deploy the `feature/supabase-booking` branch or merge it into `main`.

Customer flow:
`/login` -> Supabase Auth -> `/book` -> service selection -> date/time selection -> booking saved to `bookings`.

Bookings are protected by Supabase RLS and authenticated through server-side HTTP-only cookies. A PostgreSQL exclusion constraint prevents overlapping pending/confirmed bookings for the same service.
