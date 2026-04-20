-- Local dev seed. Runs on `supabase db reset`.
-- Creates a demo user with a few event types and bookings.

-- NOTE: creating users is done through auth.users via the CLI `supabase` admin API,
-- not via plain SQL, because password hashing matters. For local dev, use the Studio
-- UI (http://127.0.0.1:54323) to create a user, then re-run this seed to populate
-- data for that user. Replace the UUID below with the new user's id.

-- Example shell:
--   USER_ID='00000000-0000-0000-0000-000000000001'
--   psql "$(supabase status -o env DB_URL | tr -d '\"')" \
--     -v user_id=$USER_ID -f supabase/seed.sql

-- For fully-automated seeding you can insert into auth.users directly (local only):
insert into auth.users (id, email, encrypted_password, email_confirmed_at, aud, role, raw_user_meta_data)
values (
  '00000000-0000-0000-0000-000000000001',
  'demo@schedulr.local',
  crypt('password123', gen_salt('bf')),
  now(),
  'authenticated',
  'authenticated',
  '{"full_name":"Demo User"}'::jsonb
)
on conflict (id) do nothing;

-- The handle_new_user trigger creates the profile row. Fill in username/timezone.
update public.profiles
set username = 'demo', timezone = 'Asia/Manila', full_name = 'Demo User'
where id = '00000000-0000-0000-0000-000000000001';

-- Event types
insert into public.event_types (id, owner_id, slug, title, description, duration_min, location_kind, color)
values
  ('aaaa0001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001',
    '30min', '30 Minute Meeting', 'Quick sync — screen share welcome.', 30, 'google_meet', '#E8593C'),
  ('aaaa0001-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001',
    '60min', '1 Hour Deep Dive',  'Walk through a topic in detail.',    60, 'zoom',        '#3C8CE8')
on conflict (id) do nothing;

-- Availability: Mon–Fri 9am–5pm
insert into public.availability_rules (owner_id, weekday, start_time, end_time)
values
  ('00000000-0000-0000-0000-000000000001', 1, '09:00', '17:00'),
  ('00000000-0000-0000-0000-000000000001', 2, '09:00', '17:00'),
  ('00000000-0000-0000-0000-000000000001', 3, '09:00', '17:00'),
  ('00000000-0000-0000-0000-000000000001', 4, '09:00', '17:00'),
  ('00000000-0000-0000-0000-000000000001', 5, '09:00', '17:00')
on conflict do nothing;

-- Sample bookings
insert into public.bookings (event_type_id, owner_id, invitee_name, invitee_email, starts_at, ends_at, status, notes)
values
  ('aaaa0001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001',
    'Alice Smith', 'alice@example.com',
    now() + interval '1 day',  now() + interval '1 day 30 minutes',
    'confirmed', 'Intro call'),
  ('aaaa0001-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001',
    'Bob Jones', 'bob@example.com',
    now() + interval '3 days', now() + interval '3 days 1 hour',
    'pending',   'Discuss Q2 roadmap');

-- Default reminder: 15 min before every meeting, via email
insert into public.reminders (owner_id, event_type_id, offset_minutes, channel)
values ('00000000-0000-0000-0000-000000000001', null, 15, 'email');
