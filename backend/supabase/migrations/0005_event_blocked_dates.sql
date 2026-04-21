-- Per-event blocked dates: a date this specific event type cannot be booked on.
-- Separate from availability_overrides (which are owner-wide).
create table if not exists public.event_blocked_dates (
  id             uuid primary key default gen_random_uuid(),
  event_type_id  uuid not null references public.event_types(id) on delete cascade,
  owner_id       uuid not null references public.profiles(id) on delete cascade,
  date           date not null,
  created_at     timestamptz not null default now(),
  unique (event_type_id, date)
);

create index if not exists event_blocked_dates_event_idx
  on public.event_blocked_dates (event_type_id);
create index if not exists event_blocked_dates_owner_idx
  on public.event_blocked_dates (owner_id);

alter table public.event_blocked_dates enable row level security;

drop policy if exists "event_blocked_dates: public read" on public.event_blocked_dates;
create policy "event_blocked_dates: public read"
  on public.event_blocked_dates for select
  to anon, authenticated
  using (true);

drop policy if exists "event_blocked_dates: owner write" on public.event_blocked_dates;
create policy "event_blocked_dates: owner write"
  on public.event_blocked_dates for all
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);
