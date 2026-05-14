import type { AvailabilityRule, AvailabilityOverride } from "@/lib/services/availabilityService";

export type TimeWindow = { start: string; end: string }; // "HH:MM"

export type BookingLike = { starts_at: string; ends_at: string };

function toMinutes(hhmm: string): number {
  // Accepts "HH:MM" or "HH:MM:SS"
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function formatDate(date: Date): string {
  // YYYY-MM-DD in local time
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDurationToMin(dur: string | undefined | null, def = 0): number {
  if (!dur) return def;
  const match = dur.match(/^(\d+)\s*(min|hour|day)s?$/i);
  if (!match) return def;
  const val = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  if (unit === "min") return val;
  if (unit === "hour") return val * 60;
  if (unit === "day") return val * 60 * 24;
  return def;
}

/**
 * Return the available time windows for a given date.
 * Precedence: per-event blocked dates → owner overrides → weekly rules.
 *  - blocked (event) → empty
 *  - override is_available=false → empty
 *  - override is_available=true with start/end → use those custom hours
 *  - otherwise → fall through to weekly rules
 */
export function getDayWindows(
  date: Date,
  rules: AvailabilityRule[],
  overrides: AvailabilityOverride[],
  eventBlockedDates: string[] = [],
): TimeWindow[] {
  const dateStr = formatDate(date);
  if (eventBlockedDates.includes(dateStr)) return [];
  const dayOverrides = overrides.filter((o) => o.date === dateStr);

  if (dayOverrides.length > 0) {
    const blocked = dayOverrides.some((o) => !o.is_available);
    if (blocked) return [];
    const custom = dayOverrides.filter((o) => o.is_available && o.start_time && o.end_time);
    if (custom.length > 0) {
      return custom.map((o) => ({
        start: o.start_time!.slice(0, 5),
        end: o.end_time!.slice(0, 5),
      }));
    }
  }

  const weekday = date.getDay(); // 0=Sun..6=Sat
  return rules
    .filter((r) => r.weekday === weekday)
    .map((r) => ({
      start: r.start_time.slice(0, 5),
      end: r.end_time.slice(0, 5),
    }));
}

export function isDateBlocked(
  date: Date,
  rules: AvailabilityRule[],
  overrides: AvailabilityOverride[],
  eventBlockedDates: string[] = [],
): boolean {
  return getDayWindows(date, rules, overrides, eventBlockedDates).length === 0;
}

/**
 * Generate bookable time slots for a date at `durationMin` cadence.
 * Removes slots that collide with existing bookings.
 */
export function generateSlots(args: {
  date: Date;
  durationMin: number;
  rules: AvailabilityRule[];
  overrides: AvailabilityOverride[];
  bookings?: BookingLike[];
  eventBlockedDates?: string[];
  bufferBeforeMin?: number;
  bufferAfterMin?: number;
  minNoticeMin?: number;
  dailyLimit?: number;
}): string[] {
  const {
    date,
    durationMin,
    rules,
    overrides,
    bookings = [],
    eventBlockedDates = [],
    bufferBeforeMin = 0,
    bufferAfterMin = 0,
    minNoticeMin = 0,
    dailyLimit,
  } = args;
  if (durationMin <= 0) return [];

  const windows = getDayWindows(date, rules, overrides, eventBlockedDates);
  if (windows.length === 0) return [];

  const dateStr = formatDate(date);
  const dayBookings = bookings
    .filter((b) => {
      const startDay = formatDate(new Date(b.starts_at));
      return startDay === dateStr;
    })
    .map((b) => {
      const s = new Date(b.starts_at);
      const e = new Date(b.ends_at);
      return {
        start: s.getHours() * 60 + s.getMinutes(),
        end: e.getHours() * 60 + e.getMinutes(),
      };
    });

  if (dailyLimit !== undefined && dayBookings.length >= dailyLimit) {
    return [];
  }

  const nowMs = Date.now();
  const minNoticeMs = minNoticeMin * 60_000;

  const slots: string[] = [];
  for (const win of windows) {
    const startMin = toMinutes(win.start);
    const endMin = toMinutes(win.end);
    for (let t = startMin; t + durationMin <= endMin; t += durationMin) {
      const slotEnd = t + durationMin;
      
      const slotStartObj = new Date(date);
      const [h, m] = fromMinutes(t).split(":").map(Number);
      slotStartObj.setHours(h, m, 0, 0);

      if (slotStartObj.getTime() < nowMs + minNoticeMs) {
        continue;
      }

      const requiredStart = t - bufferBeforeMin;
      const requiredEnd = slotEnd + bufferAfterMin;
      
      const collides = dayBookings.some((b) => requiredStart < b.end && requiredEnd > b.start);
      if (!collides) slots.push(fromMinutes(t));
    }
  }
  return slots;
}
