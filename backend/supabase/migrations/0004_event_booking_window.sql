-- Add per-event booking window: accept bookings up to N days from today.
-- null = unlimited.
alter table public.event_types
  add column if not exists booking_window_days integer
  check (booking_window_days is null or booking_window_days > 0);
