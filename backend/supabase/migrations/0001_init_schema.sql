-- SaaS Schedulr — initial schema
-- Tables: profiles, event_types, availability_rules, availability_overrides,
--         bookings, reminders, integrations, analytics_events
--
-- Uses gen_random_uuid() (built into Postgres 13+) instead of uuid_generate_v4()
-- so we don't depend on the uuid-ossp extension's search path.

create extension if not exists "pgcrypto";

-- ============================================================
-- profiles: 1:1 with auth.users
-- ============================================================
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text,
  username      text unique,
  avatar_url    text,
  timezone      text not null default 'UTC',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists profiles_username_idx on public.profiles (username);

-- Auto-create a profile row whenever a new auth user is inserted.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- event_types: bookable meeting templates
-- ============================================================
create table if not exists public.event_types (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null references public.profiles(id) on delete cascade,
  slug            text not null,
  title           text not null,
  description     text,
  duration_min    int  not null default 30 check (duration_min > 0),
  location_kind   text not null default 'google_meet'
                    check (location_kind in ('google_meet','zoom','phone','in_person','custom')),
  location_detail text,
  color           text not null default '#E8593C',
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (owner_id, slug)
);

create index if not exists event_types_owner_idx on public.event_types (owner_id);

-- ============================================================
-- availability_rules: weekly recurring availability
-- ============================================================
create table if not exists public.availability_rules (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references public.profiles(id) on delete cascade,
  weekday     int  not null check (weekday between 0 and 6),
  start_time  time not null,
  end_time    time not null,
  check (end_time > start_time)
);

create index if not exists availability_rules_owner_idx on public.availability_rules (owner_id);

-- ============================================================
-- availability_overrides: date-specific blocks / extra availability
-- ============================================================
create table if not exists public.availability_overrides (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references public.profiles(id) on delete cascade,
  date          date not null,
  start_time    time,
  end_time      time,
  is_available  boolean not null default false
);

create index if not exists availability_overrides_owner_date_idx
  on public.availability_overrides (owner_id, date);

-- ============================================================
-- bookings: actual reservations
-- ============================================================
create table if not exists public.bookings (
  id             uuid primary key default gen_random_uuid(),
  event_type_id  uuid not null references public.event_types(id) on delete cascade,
  owner_id       uuid not null references public.profiles(id) on delete cascade,
  invitee_name   text not null,
  invitee_email  text not null,
  starts_at      timestamptz not null,
  ends_at        timestamptz not null,
  status         text not null default 'confirmed'
                   check (status in ('pending','confirmed','cancelled','no_show')),
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index if not exists bookings_owner_starts_idx on public.bookings (owner_id, starts_at);
create index if not exists bookings_event_type_idx   on public.bookings (event_type_id);

-- ============================================================
-- reminders
-- ============================================================
create table if not exists public.reminders (
  id             uuid primary key default gen_random_uuid(),
  owner_id       uuid not null references public.profiles(id) on delete cascade,
  event_type_id  uuid references public.event_types(id) on delete cascade,
  offset_minutes int  not null check (offset_minutes >= 0),
  channel        text not null check (channel in ('email','sms')),
  created_at     timestamptz not null default now()
);

create index if not exists reminders_owner_idx on public.reminders (owner_id);

-- ============================================================
-- integrations
-- ============================================================
create table if not exists public.integrations (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid not null references public.profiles(id) on delete cascade,
  provider     text not null
                 check (provider in ('google_calendar','zoom','stripe','slack','outlook')),
  status       text not null default 'connected'
                 check (status in ('connected','disconnected','error')),
  credentials  jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (owner_id, provider)
);

-- ============================================================
-- analytics_events
-- ============================================================
create table if not exists public.analytics_events (
  id          bigserial primary key,
  owner_id    uuid references public.profiles(id) on delete cascade,
  event_type  text not null,
  metadata    jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists analytics_events_owner_created_idx
  on public.analytics_events (owner_id, created_at desc);

-- ============================================================
-- updated_at trigger
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists event_types_set_updated_at on public.event_types;
create trigger event_types_set_updated_at
  before update on public.event_types
  for each row execute function public.set_updated_at();

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

drop trigger if exists integrations_set_updated_at on public.integrations;
create trigger integrations_set_updated_at
  before update on public.integrations
  for each row execute function public.set_updated_at();

-- ============================================================
-- realtime: enable for bookings so dashboards auto-refresh
-- ============================================================
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'bookings'
  ) then
    alter publication supabase_realtime add table public.bookings;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'event_types'
  ) then
    alter publication supabase_realtime add table public.event_types;
  end if;
end$$;
