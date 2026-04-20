-- SaaS Schedulr — Row Level Security
-- Idempotent: drops each policy before creating it.

alter table public.profiles              enable row level security;
alter table public.event_types           enable row level security;
alter table public.availability_rules    enable row level security;
alter table public.availability_overrides enable row level security;
alter table public.bookings              enable row level security;
alter table public.reminders             enable row level security;
alter table public.integrations          enable row level security;
alter table public.analytics_events      enable row level security;

-- ------------------------------------------------------------
-- profiles
-- ------------------------------------------------------------
drop policy if exists "profiles: public read"   on public.profiles;
create policy "profiles: public read"
  on public.profiles for select
  to anon, authenticated
  using (true);

drop policy if exists "profiles: owner update"  on public.profiles;
create policy "profiles: owner update"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ------------------------------------------------------------
-- event_types
-- ------------------------------------------------------------
drop policy if exists "event_types: public read active" on public.event_types;
create policy "event_types: public read active"
  on public.event_types for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "event_types: owner read"    on public.event_types;
create policy "event_types: owner read"
  on public.event_types for select
  to authenticated
  using (auth.uid() = owner_id);

drop policy if exists "event_types: owner insert"  on public.event_types;
create policy "event_types: owner insert"
  on public.event_types for insert
  to authenticated
  with check (auth.uid() = owner_id);

drop policy if exists "event_types: owner update"  on public.event_types;
create policy "event_types: owner update"
  on public.event_types for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "event_types: owner delete"  on public.event_types;
create policy "event_types: owner delete"
  on public.event_types for delete
  to authenticated
  using (auth.uid() = owner_id);

-- ------------------------------------------------------------
-- availability_rules / availability_overrides
-- ------------------------------------------------------------
drop policy if exists "availability_rules: public read" on public.availability_rules;
create policy "availability_rules: public read"
  on public.availability_rules for select
  to anon, authenticated
  using (true);

drop policy if exists "availability_rules: owner write" on public.availability_rules;
create policy "availability_rules: owner write"
  on public.availability_rules for all
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "availability_overrides: public read" on public.availability_overrides;
create policy "availability_overrides: public read"
  on public.availability_overrides for select
  to anon, authenticated
  using (true);

drop policy if exists "availability_overrides: owner write" on public.availability_overrides;
create policy "availability_overrides: owner write"
  on public.availability_overrides for all
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- ------------------------------------------------------------
-- bookings
-- ------------------------------------------------------------
drop policy if exists "bookings: owner read"   on public.bookings;
create policy "bookings: owner read"
  on public.bookings for select
  to authenticated
  using (auth.uid() = owner_id);

drop policy if exists "bookings: owner update" on public.bookings;
create policy "bookings: owner update"
  on public.bookings for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "bookings: owner delete" on public.bookings;
create policy "bookings: owner delete"
  on public.bookings for delete
  to authenticated
  using (auth.uid() = owner_id);

drop policy if exists "bookings: public insert" on public.bookings;
create policy "bookings: public insert"
  on public.bookings for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from public.event_types et
      where et.id = event_type_id
        and et.is_active = true
        and et.owner_id = bookings.owner_id
    )
  );

-- ------------------------------------------------------------
-- reminders
-- ------------------------------------------------------------
drop policy if exists "reminders: owner all" on public.reminders;
create policy "reminders: owner all"
  on public.reminders for all
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- ------------------------------------------------------------
-- integrations
-- ------------------------------------------------------------
drop policy if exists "integrations: owner all" on public.integrations;
create policy "integrations: owner all"
  on public.integrations for all
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- ------------------------------------------------------------
-- analytics_events
-- ------------------------------------------------------------
drop policy if exists "analytics_events: public insert" on public.analytics_events;
create policy "analytics_events: public insert"
  on public.analytics_events for insert
  to anon, authenticated
  with check (true);

drop policy if exists "analytics_events: owner read" on public.analytics_events;
create policy "analytics_events: owner read"
  on public.analytics_events for select
  to authenticated
  using (auth.uid() = owner_id);
