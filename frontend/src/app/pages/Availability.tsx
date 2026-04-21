import { useEffect, useState } from "react";
import {
  ChevronLeft, ChevronRight, Plus, Trash2,
  Globe, Check, CalendarX, CalendarClock, Zap, Save,
  Info, Sun, Moon
} from "lucide-react";
import { toast } from "sonner";
import {
  useAvailabilityRules,
  useReplaceAvailabilityRules,
  useAvailabilityOverrides,
  useReplaceAvailabilityOverrides,
} from "@/features/availability/useAvailability";
import { useAuth } from "@/features/auth/useAuth";

// ─── Types ────────────────────────────────────────────────────────────────────
interface TimeSlot {
  id: number;
  start: string;
  end: string;
}

interface DaySchedule {
  enabled: boolean;
  slots: TimeSlot[];
}

type OverrideType = "blocked" | "custom";

interface DateOverride {
  date: string; // "YYYY-MM-DD"
  type: OverrideType;
  slots?: TimeSlot[];
  label?: string;
}

// ─── Initial state ────────────────────────────────────────────────────────────
const DEFAULT_SCHEDULE: Record<string, DaySchedule> = {
  Mon: { enabled: true,  slots: [{ id: 1, start: "09:00", end: "17:00" }] },
  Tue: { enabled: true,  slots: [{ id: 2, start: "09:00", end: "17:00" }] },
  Wed: { enabled: true,  slots: [{ id: 3, start: "09:00", end: "17:00" }] },
  Thu: { enabled: true,  slots: [{ id: 4, start: "09:00", end: "17:00" }] },
  Fri: { enabled: true,  slots: [{ id: 5, start: "09:00", end: "15:00" }] },
  Sat: { enabled: false, slots: [{ id: 6, start: "10:00", end: "14:00" }] },
  Sun: { enabled: false, slots: [{ id: 7, start: "10:00", end: "14:00" }] },
};

const DAYS_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAYS_FULL  = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// DB stores weekday as 0=Sun, 1=Mon, ..., 6=Sat
const DAY_TO_WEEKDAY: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const WEEKDAY_TO_DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TIMEZONES = [
  "UTC−8 Pacific Time",
  "UTC−5 Eastern Time",
  "UTC+0 London (GMT)",
  "UTC+1 Paris (CET)",
  "UTC+5:30 Mumbai",
  "UTC+8 Manila / Singapore",
  "UTC+9 Tokyo",
];

const BUFFER_OPTIONS = ["0 min", "5 min", "10 min", "15 min", "30 min"];
const NOTICE_OPTIONS = ["None", "1 hour", "2 hours", "4 hours", "1 day", "2 days"];
const DAILY_LIMIT_OPTIONS = ["No limit", "2", "4", "6", "8", "10", "12"];

let nextId = 100;

// ─── Utils ────────────────────────────────────────────────────────────────────
function parseMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function calcHours(slots: TimeSlot[]): number {
  return slots.reduce((sum, s) => {
    const diff = parseMinutes(s.end) - parseMinutes(s.start);
    return sum + (diff > 0 ? diff : 0);
  }, 0) / 60;
}

function fmtHours(h: number): string {
  const hrs = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOfMonth(year: number, month: number) {
  // 0=Sun, shift to Mon-start: Mon=0..Sun=6
  return (new Date(year, month, 1).getDay() + 6) % 7;
}

function toISO(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative flex-shrink-0 transition-all"
      style={{ width: 40, height: 22 }}
      aria-label="toggle"
    >
      <div
        className="absolute inset-0 rounded-full transition-colors duration-200"
        style={{ background: on ? "#E8593C" : "rgba(255,255,255,0.1)" }}
      />
      <div
        className="absolute top-[4px] rounded-full transition-all duration-200"
        style={{ width: 14, height: 14, background: "white", left: on ? 22 : 4 }}
      />
    </button>
  );
}

// ─── Time input ───────────────────────────────────────────────────────────────
function TimeInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-2.5 py-1.5 rounded-lg text-sm text-center outline-none transition-all"
      style={{
        background: "#1E1E21",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "#F4F2EE",
        fontFamily: "'DM Mono', monospace",
        width: 86,
        colorScheme: "dark",
      }}
    />
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <div className="mb-3">
        <div style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.08em" }}>
          {title.toUpperCase()}
        </div>
        {subtitle && <div style={{ color: "#8A8882", fontSize: 12, marginTop: 3 }}>{subtitle}</div>}
      </div>
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Mini calendar for override picker ───────────────────────────────────────
function OverrideCalendar({
  overrides,
  onToggle,
}: {
  overrides: DateOverride[];
  onToggle: (iso: string) => void;
}) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const MONTH_NAMES = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const totalDays = daysInMonth(year, month);
  const firstDay  = firstDayOfMonth(year, month);
  const today     = toISO(now.getFullYear(), now.getMonth(), now.getDate());

  const overrideMap = Object.fromEntries(overrides.map((o) => [o.date, o]));

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  return (
    <div className="px-4 pt-4 pb-3">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="flex items-center justify-center rounded-lg transition-colors"
          style={{ width: 28, height: 28, color: "#8A8882", background: "rgba(255,255,255,0.04)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)")}
        >
          <ChevronLeft size={14} strokeWidth={1.5} />
        </button>
        <span style={{ color: "#F4F2EE", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          className="flex items-center justify-center rounded-lg transition-colors"
          style={{ width: 28, height: 28, color: "#8A8882", background: "rgba(255,255,255,0.04)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)")}
        >
          <ChevronRight size={14} strokeWidth={1.5} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1 text-center">
        {["Mo","Tu","We","Th","Fr","Sa","Su"].map((d) => (
          <div key={d} style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", fontSize: 10 }}>{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
          const iso = toISO(year, month, day);
          const override = overrideMap[iso];
          const isToday = iso === today;
          const isPast = iso < today;

          let bg = "transparent";
          let color = isPast ? "#2E2E30" : "#8A8882";
          let border = "transparent";

          if (override?.type === "blocked") {
            bg = "rgba(232,89,60,0.15)";
            color = "#E8593C";
            border = "rgba(232,89,60,0.3)";
          } else if (override?.type === "custom") {
            bg = "rgba(75,158,255,0.12)";
            color = "#4B9EFF";
            border = "rgba(75,158,255,0.3)";
          } else if (isToday) {
            color = "#F4F2EE";
            border = "rgba(232,89,60,0.5)";
          }

          return (
            <button
              key={day}
              onClick={() => !isPast && onToggle(iso)}
              disabled={isPast}
              className="rounded-lg text-xs flex items-center justify-center transition-all"
              style={{
                height: 30,
                background: bg,
                color,
                border: `1px solid ${border}`,
                cursor: isPast ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!isPast && !override) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLElement).style.color = "#F4F2EE";
                }
              }}
              onMouseLeave={(e) => {
                if (!isPast && !override) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "#8A8882";
                }
              }}
            >
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11 }}>{day}</span>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "rgba(232,89,60,0.15)", border: "1px solid rgba(232,89,60,0.3)" }} />
          <span style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", fontSize: 10 }}>BLOCKED</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "rgba(75,158,255,0.12)", border: "1px solid rgba(75,158,255,0.3)" }} />
          <span style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", fontSize: 10 }}>CUSTOM HOURS</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function Availability() {
  const { user } = useAuth();
  const { data: dbRules = [] } = useAvailabilityRules();
  const { data: dbOverrides = [] } = useAvailabilityOverrides();
  const replaceRules = useReplaceAvailabilityRules();
  const replaceOverrides = useReplaceAvailabilityOverrides();

  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>(DEFAULT_SCHEDULE);
  const [overrides, setOverrides] = useState<DateOverride[]>([]);
  const [timezone, setTimezone] = useState(TIMEZONES[5]);
  const [bufferBefore, setBufferBefore] = useState("15 min");
  const [bufferAfter,  setBufferAfter]  = useState("0 min");
  const [minNotice, setMinNotice] = useState("2 hours");
  const [dailyLimit, setDailyLimit] = useState("No limit");
  const [saved, setSaved] = useState(false);
  const [selectedOverrideDay, setSelectedOverrideDay] = useState<string | null>(null);

  // Hydrate schedule from DB on first load
  useEffect(() => {
    if (dbRules.length === 0) return;
    const base: Record<string, DaySchedule> = {};
    for (const day of DAYS_ORDER) base[day] = { enabled: false, slots: [] };
    for (const r of dbRules) {
      const day = WEEKDAY_TO_DAY[r.weekday];
      base[day].enabled = true;
      base[day].slots.push({ id: nextId++, start: r.start_time.slice(0, 5), end: r.end_time.slice(0, 5) });
    }
    // Keep fallback default slot for empty enabled days (shouldn't happen, but safe).
    for (const day of DAYS_ORDER) {
      if (base[day].enabled && base[day].slots.length === 0) {
        base[day].slots.push({ id: nextId++, start: "09:00", end: "17:00" });
      }
      if (!base[day].enabled && base[day].slots.length === 0) {
        base[day].slots.push({ id: nextId++, start: "09:00", end: "17:00" });
      }
    }
    setSchedule(base);
  }, [dbRules]);

  // Hydrate overrides from DB
  useEffect(() => {
    if (dbOverrides.length === 0) {
      setOverrides([]);
      return;
    }
    const byDate = new Map<string, DateOverride>();
    for (const row of dbOverrides) {
      if (!row.is_available) {
        byDate.set(row.date, { date: row.date, type: "blocked" });
      } else if (row.start_time && row.end_time) {
        const slot = { id: nextId++, start: row.start_time.slice(0, 5), end: row.end_time.slice(0, 5) };
        const existing = byDate.get(row.date);
        if (existing && existing.type === "custom") {
          existing.slots!.push(slot);
        } else {
          byDate.set(row.date, { date: row.date, type: "custom", slots: [slot] });
        }
      }
    }
    setOverrides(Array.from(byDate.values()));
  }, [dbOverrides]);

  // ── Day schedule mutations ──
  const toggleDay = (day: string) => {
    setSchedule((s) => ({ ...s, [day]: { ...s[day], enabled: !s[day].enabled } }));
  };

  const updateSlot = (day: string, id: number, field: "start" | "end", val: string) => {
    setSchedule((s) => ({
      ...s,
      [day]: {
        ...s[day],
        slots: s[day].slots.map((slot) => slot.id === id ? { ...slot, [field]: val } : slot),
      },
    }));
  };

  const addSlot = (day: string) => {
    setSchedule((s) => ({
      ...s,
      [day]: {
        ...s[day],
        slots: [...s[day].slots, { id: nextId++, start: "09:00", end: "17:00" }],
      },
    }));
  };

  const removeSlot = (day: string, id: number) => {
    setSchedule((s) => ({
      ...s,
      [day]: { ...s[day], slots: s[day].slots.filter((sl) => sl.id !== id) },
    }));
  };

  // ── Override mutations ──
  const handleCalendarToggle = (iso: string) => {
    const existing = overrides.find((o) => o.date === iso);
    if (existing) {
      // cycle: blocked -> custom -> remove
      if (existing.type === "blocked") {
        setOverrides((prev) =>
          prev.map((o) =>
            o.date === iso
              ? { ...o, type: "custom", slots: [{ id: nextId++, start: "09:00", end: "13:00" }] }
              : o
          )
        );
        setSelectedOverrideDay(iso);
      } else {
        setOverrides((prev) => prev.filter((o) => o.date !== iso));
        setSelectedOverrideDay(null);
      }
    } else {
      setOverrides((prev) => [...prev, { date: iso, type: "blocked" }]);
      setSelectedOverrideDay(null);
    }
  };

  const updateOverrideSlot = (date: string, id: number, field: "start" | "end", val: string) => {
    setOverrides((prev) =>
      prev.map((o) =>
        o.date === date
          ? { ...o, slots: o.slots?.map((s) => (s.id === id ? { ...s, [field]: val } : s)) }
          : o
      )
    );
  };

  const addOverrideSlot = (date: string) => {
    setOverrides((prev) =>
      prev.map((o) =>
        o.date === date
          ? { ...o, slots: [...(o.slots ?? []), { id: nextId++, start: "09:00", end: "17:00" }] }
          : o
      )
    );
  };

  const removeOverride = (date: string) => {
    setOverrides((prev) => prev.filter((o) => o.date !== date));
    if (selectedOverrideDay === date) setSelectedOverrideDay(null);
  };

  // ── Stats ──
  const totalWeeklyHours = DAYS_ORDER.reduce((sum, day) => {
    const d = schedule[day];
    return d.enabled ? sum + calcHours(d.slots) : sum;
  }, 0);

  const enabledDaysCount = DAYS_ORDER.filter((d) => schedule[d].enabled).length;

  const handleSave = async () => {
    if (!user) return;
    // Build rules from schedule
    const rules: { owner_id: string; weekday: number; start_time: string; end_time: string }[] = [];
    for (const day of DAYS_ORDER) {
      const d = schedule[day];
      if (!d.enabled) continue;
      for (const slot of d.slots) {
        if (slot.start >= slot.end) {
          toast.error(`${day}: end time must be after start time`);
          return;
        }
        rules.push({
          owner_id: user.id,
          weekday: DAY_TO_WEEKDAY[day],
          start_time: `${slot.start}:00`,
          end_time: `${slot.end}:00`,
        });
      }
    }
    // Build override rows
    const overrideRows: {
      owner_id: string;
      date: string;
      is_available: boolean;
      start_time: string | null;
      end_time: string | null;
    }[] = [];
    for (const o of overrides) {
      if (o.type === "blocked") {
        overrideRows.push({
          owner_id: user.id,
          date: o.date,
          is_available: false,
          start_time: null,
          end_time: null,
        });
      } else {
        for (const slot of o.slots ?? []) {
          overrideRows.push({
            owner_id: user.id,
            date: o.date,
            is_available: true,
            start_time: `${slot.start}:00`,
            end_time: `${slot.end}:00`,
          });
        }
      }
    }
    try {
      await replaceRules.mutateAsync(rules);
      await replaceOverrides.mutateAsync(overrideRows);
      setSaved(true);
      toast.success("Availability saved");
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  // Next available slot: find next enabled weekday from today
  const nextSlot = (() => {
    const now = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      const dayName = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()];
      const dayFull = DAYS_ORDER.indexOf(dayName);
      if (dayFull === -1) continue;
      const sched = schedule[dayName];
      if (!sched.enabled || sched.slots.length === 0) continue;
      const iso = toISO(d.getFullYear(), d.getMonth(), d.getDate());
      const blocked = overrides.find((o) => o.date === iso && o.type === "blocked");
      if (blocked) continue;
      const customO = overrides.find((o) => o.date === iso && o.type === "custom");
      const slots = customO?.slots ?? sched.slots;
      if (!slots.length) continue;
      return {
        date: d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }),
        time: slots[0].start,
        day: dayName,
      };
    }
    return null;
  })();

  // Format override date for display
  const fmtOverrideDate = (iso: string) => {
    const [y, m, day] = iso.split("-").map(Number);
    return new Date(y, m - 1, day).toLocaleDateString("en-GB", {
      weekday: "short", day: "numeric", month: "short", year: "numeric",
    });
  };

  const sortedOverrides = [...overrides].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="h-[calc(100vh-48px)] flex flex-col" style={{ background: "#0F0F11" }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-6 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "#161618" }}
      >
        <div>
          <span className="text-sm" style={{ color: "#F4F2EE" }}>Availability</span>
          <span className="mx-2" style={{ color: "#4A4946" }}>·</span>
          <span className="text-sm" style={{ color: "#8A8882" }}>Marcus Studio</span>
        </div>
        <div className="flex items-center gap-3">
          <span style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", fontSize: 11 }}>
            {enabledDaysCount} DAYS · {fmtHours(totalWeeklyHours)}/WEEK
          </span>
          <button
            onClick={handleSave}
            disabled={replaceRules.isPending || replaceOverrides.isPending}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm transition-all"
            style={{
              background: saved ? "rgba(46,204,138,0.12)" : "#E8593C",
              color: saved ? "#2ECC8A" : "white",
              border: saved ? "1px solid rgba(46,204,138,0.3)" : "none",
              opacity: replaceRules.isPending || replaceOverrides.isPending ? 0.7 : 1,
              cursor: replaceRules.isPending || replaceOverrides.isPending ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => { if (!saved) (e.currentTarget as HTMLElement).style.background = "#FF6B47"; }}
            onMouseLeave={(e) => { if (!saved) (e.currentTarget as HTMLElement).style.background = "#E8593C"; }}
          >
            {saved ? <Check size={14} strokeWidth={1.5} /> : <Save size={14} strokeWidth={1.5} />}
            {saved ? "Saved!" : replaceRules.isPending || replaceOverrides.isPending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT PANEL ── */}
        <div
          className="flex flex-col overflow-y-auto"
          style={{ width: "62%", borderRight: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="p-6 md:p-8">

            {/* ── Weekly schedule ── */}
            <Section
              title="Weekly schedule"
              subtitle="Set your recurring availability for each day of the week"
            >
              <div>
                {DAYS_ORDER.map((day, dayIdx) => {
                  const d = schedule[day];
                  const isWeekend = day === "Sat" || day === "Sun";
                  return (
                    <div
                      key={day}
                      className="flex gap-3 px-4 py-3 transition-colors"
                      style={{
                        borderBottom: dayIdx < 6 ? "1px solid rgba(255,255,255,0.05)" : "none",
                        background: d.enabled ? "transparent" : "rgba(0,0,0,0.15)",
                      }}
                    >
                      {/* Day label + toggle */}
                      <div className="flex items-center gap-3 flex-shrink-0" style={{ width: 110 }}>
                        <Toggle on={d.enabled} onChange={() => toggleDay(day)} />
                        <div>
                          <div
                            style={{
                              color: d.enabled ? "#F4F2EE" : "#4A4946",
                              fontSize: 13,
                              transition: "color .2s",
                            }}
                          >
                            {DAYS_FULL[dayIdx]}
                          </div>
                          {isWeekend && !d.enabled && (
                            <div style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", fontSize: 10 }}>
                              OFF
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Slots */}
                      <div className="flex-1 flex flex-col gap-2">
                        {!d.enabled ? (
                          <div
                            className="flex items-center h-9 px-3 rounded-lg"
                            style={{ background: "rgba(0,0,0,0.2)", border: "1px dashed rgba(255,255,255,0.06)" }}
                          >
                            <span style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", fontSize: 11 }}>
                              UNAVAILABLE
                            </span>
                          </div>
                        ) : (
                          <>
                            {d.slots.map((slot, si) => (
                              <div key={slot.id} className="flex items-center gap-2">
                                <TimeInput
                                  value={slot.start}
                                  onChange={(v) => updateSlot(day, slot.id, "start", v)}
                                />
                                <span style={{ color: "#4A4946", fontSize: 13 }}>→</span>
                                <TimeInput
                                  value={slot.end}
                                  onChange={(v) => updateSlot(day, slot.id, "end", v)}
                                />
                                {/* Hours badge */}
                                <span
                                  className="px-2 py-0.5 rounded text-xs"
                                  style={{
                                    background: "rgba(232,89,60,0.08)",
                                    color: "#E8593C",
                                    fontFamily: "'DM Mono', monospace",
                                    minWidth: 38,
                                    textAlign: "center",
                                  }}
                                >
                                  {fmtHours(calcHours([slot]))}
                                </span>
                                {/* Remove slot (only if >1) */}
                                {d.slots.length > 1 && (
                                  <button
                                    onClick={() => removeSlot(day, slot.id)}
                                    className="flex items-center justify-center rounded transition-colors"
                                    style={{ width: 24, height: 24, color: "#4A4946" }}
                                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#E8593C")}
                                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#4A4946")}
                                  >
                                    <Trash2 size={13} strokeWidth={1.5} />
                                  </button>
                                )}
                              </div>
                            ))}
                            {/* Add slot */}
                            <button
                              onClick={() => addSlot(day)}
                              className="flex items-center gap-1.5 text-xs transition-colors"
                              style={{ color: "#4A4946" }}
                              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#8A8882")}
                              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#4A4946")}
                            >
                              <Plus size={12} strokeWidth={1.5} />
                              Add time slot
                            </button>
                          </>
                        )}
                      </div>

                      {/* Daily hours */}
                      <div className="flex-shrink-0 flex items-start pt-1.5" style={{ width: 52 }}>
                        {d.enabled && d.slots.length > 0 && (
                          <span
                            style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", fontSize: 11, textAlign: "right", display: "block", width: "100%" }}
                          >
                            {fmtHours(calcHours(d.slots))}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>

            {/* ── Buffer & Notice settings ── */}
            <Section title="Booking rules" subtitle="Fine-tune how bookings are accepted">
              <div className="px-4 py-4 grid grid-cols-2 gap-5">
                {/* Buffer before */}
                <div>
                  <label style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.06em" }}>
                    BUFFER BEFORE
                  </label>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {BUFFER_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setBufferBefore(opt)}
                        className="px-2.5 py-1 rounded-lg text-xs transition-all"
                        style={{
                          background: bufferBefore === opt ? "#E8593C" : "#1E1E21",
                          color: bufferBefore === opt ? "white" : "#8A8882",
                          border: `1px solid ${bufferBefore === opt ? "#E8593C" : "rgba(255,255,255,0.08)"}`,
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Buffer after */}
                <div>
                  <label style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.06em" }}>
                    BUFFER AFTER
                  </label>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {BUFFER_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setBufferAfter(opt)}
                        className="px-2.5 py-1 rounded-lg text-xs transition-all"
                        style={{
                          background: bufferAfter === opt ? "#E8593C" : "#1E1E21",
                          color: bufferAfter === opt ? "white" : "#8A8882",
                          border: `1px solid ${bufferAfter === opt ? "#E8593C" : "rgba(255,255,255,0.08)"}`,
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Min notice */}
                <div>
                  <label style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.06em" }}>
                    MINIMUM NOTICE
                  </label>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {NOTICE_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setMinNotice(opt)}
                        className="px-2.5 py-1 rounded-lg text-xs transition-all"
                        style={{
                          background: minNotice === opt ? "#E8593C" : "#1E1E21",
                          color: minNotice === opt ? "white" : "#8A8882",
                          border: `1px solid ${minNotice === opt ? "#E8593C" : "rgba(255,255,255,0.08)"}`,
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Daily limit */}
                <div>
                  <label style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.06em" }}>
                    MAX BOOKINGS / DAY
                  </label>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {DAILY_LIMIT_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setDailyLimit(opt)}
                        className="px-2.5 py-1 rounded-lg text-xs transition-all"
                        style={{
                          background: dailyLimit === opt ? "#E8593C" : "#1E1E21",
                          color: dailyLimit === opt ? "white" : "#8A8882",
                          border: `1px solid ${dailyLimit === opt ? "#E8593C" : "rgba(255,255,255,0.08)"}`,
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            {/* ── Date overrides ── */}
            <Section
              title="Date overrides"
              subtitle="Block specific dates or set custom hours for one-off changes"
            >
              {/* Calendar */}
              <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <OverrideCalendar overrides={overrides} onToggle={handleCalendarToggle} />
              </div>

              {/* Instruction hint */}
              <div
                className="flex items-center gap-2 mx-4 my-3 px-3 py-2.5 rounded-lg"
                style={{ background: "rgba(75,158,255,0.06)", border: "1px solid rgba(75,158,255,0.15)" }}
              >
                <Info size={13} strokeWidth={1.5} style={{ color: "#4B9EFF", flexShrink: 0 }} />
                <p style={{ color: "#8A8882", fontSize: 12, lineHeight: 1.5 }}>
                  Click a date to <span style={{ color: "#E8593C" }}>block</span> it. Click again to set{" "}
                  <span style={{ color: "#4B9EFF" }}>custom hours</span>. Click once more to remove the override.
                </p>
              </div>

              {/* Override list */}
              {sortedOverrides.length === 0 ? (
                <div className="px-4 pb-4 text-center py-4" style={{ color: "#4A4946", fontSize: 13 }}>
                  No date overrides set
                </div>
              ) : (
                <div className="px-4 pb-4 flex flex-col gap-2">
                  {sortedOverrides.map((ov) => (
                    <div
                      key={ov.date}
                      className="rounded-xl overflow-hidden"
                      style={{
                        border: `1px solid ${ov.type === "blocked" ? "rgba(232,89,60,0.2)" : "rgba(75,158,255,0.2)"}`,
                        background: ov.type === "blocked" ? "rgba(232,89,60,0.04)" : "rgba(75,158,255,0.04)",
                      }}
                    >
                      <div className="flex items-center justify-between px-3 py-2.5">
                        <div className="flex items-center gap-2.5">
                          {ov.type === "blocked" ? (
                            <CalendarX size={14} strokeWidth={1.5} style={{ color: "#E8593C", flexShrink: 0 }} />
                          ) : (
                            <CalendarClock size={14} strokeWidth={1.5} style={{ color: "#4B9EFF", flexShrink: 0 }} />
                          )}
                          <div>
                            <span style={{ color: "#F4F2EE", fontSize: 13 }}>{fmtOverrideDate(ov.date)}</span>
                            <span
                              className="ml-2 px-1.5 py-0.5 rounded text-xs"
                              style={{
                                background: ov.type === "blocked" ? "rgba(232,89,60,0.12)" : "rgba(75,158,255,0.12)",
                                color: ov.type === "blocked" ? "#E8593C" : "#4B9EFF",
                                fontFamily: "'DM Mono', monospace",
                              }}
                            >
                              {ov.type === "blocked" ? "BLOCKED" : "CUSTOM"}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeOverride(ov.date)}
                          className="flex items-center justify-center rounded transition-colors"
                          style={{ width: 24, height: 24, color: "#4A4946" }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#E8593C")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#4A4946")}
                        >
                          <Trash2 size={13} strokeWidth={1.5} />
                        </button>
                      </div>

                      {/* Custom hours editor */}
                      {ov.type === "custom" && ov.slots && (
                        <div
                          className="px-3 pb-3 flex flex-col gap-2"
                          style={{ borderTop: "1px solid rgba(75,158,255,0.12)" }}
                        >
                          <div style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", fontSize: 10, paddingTop: 8, letterSpacing: "0.06em" }}>
                            CUSTOM HOURS
                          </div>
                          {ov.slots.map((slot) => (
                            <div key={slot.id} className="flex items-center gap-2">
                              <TimeInput value={slot.start} onChange={(v) => updateOverrideSlot(ov.date, slot.id, "start", v)} />
                              <span style={{ color: "#4A4946" }}>→</span>
                              <TimeInput value={slot.end} onChange={(v) => updateOverrideSlot(ov.date, slot.id, "end", v)} />
                              <span
                                className="px-2 py-0.5 rounded text-xs"
                                style={{ background: "rgba(75,158,255,0.1)", color: "#4B9EFF", fontFamily: "'DM Mono', monospace" }}
                              >
                                {fmtHours(calcHours([slot]))}
                              </span>
                            </div>
                          ))}
                          <button
                            onClick={() => addOverrideSlot(ov.date)}
                            className="flex items-center gap-1.5 text-xs transition-colors"
                            style={{ color: "#4A4946" }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#4B9EFF")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#4A4946")}
                          >
                            <Plus size={12} strokeWidth={1.5} />
                            Add time slot
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* ── Timezone ── */}
            <Section title="Timezone" subtitle="All times will be shown in this timezone">
              <div className="px-4 py-3 flex items-center gap-3">
                <Globe size={15} strokeWidth={1.5} style={{ color: "#E8593C", flexShrink: 0 }} />
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm appearance-none cursor-pointer"
                  style={{ color: "#F4F2EE", fontFamily: "'DM Mono', monospace" }}
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz} style={{ background: "#1E1E21", color: "#F4F2EE" }}>
                      {tz}
                    </option>
                  ))}
                </select>
                <ChevronRight size={14} strokeWidth={1.5} style={{ color: "#4A4946" }} />
              </div>
            </Section>

          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div
          className="flex-1 overflow-y-auto flex flex-col"
          style={{ background: "#0A0A0C" }}
        >
          <div className="p-6 flex flex-col gap-5">
            {/* Label */}
            <div style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.08em" }}>
              AVAILABILITY PREVIEW
            </div>

            {/* Next available slot card */}
            <div
              className="rounded-2xl p-5 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(232,89,60,0.12) 0%, rgba(232,89,60,0.04) 100%)",
                border: "1px solid rgba(232,89,60,0.25)",
              }}
            >
              {/* Glow */}
              <div
                className="absolute top-0 right-0 rounded-full pointer-events-none"
                style={{ width: 120, height: 120, background: "radial-gradient(circle, rgba(232,89,60,0.15) 0%, transparent 70%)", transform: "translate(30%, -30%)" }}
              />
              <div className="flex items-center gap-2 mb-3">
                <Zap size={14} strokeWidth={1.5} style={{ color: "#E8593C" }} />
                <span style={{ color: "#E8593C", fontFamily: "'DM Mono', monospace", fontSize: 11 }}>
                  NEXT AVAILABLE SLOT
                </span>
              </div>
              {nextSlot ? (
                <>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.5rem", fontWeight: 600, color: "#F4F2EE", lineHeight: 1.1, marginBottom: 6 }}>
                    {nextSlot.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ color: "#8A8882", fontSize: 13 }}>{nextSlot.date}</span>
                    <span
                      className="px-2 py-0.5 rounded text-xs"
                      style={{ background: "rgba(232,89,60,0.12)", color: "#E8593C", fontFamily: "'DM Mono', monospace" }}
                    >
                      {nextSlot.day.toUpperCase()}
                    </span>
                  </div>
                </>
              ) : (
                <div style={{ color: "#8A8882", fontSize: 13 }}>No available slots in the next 2 weeks</div>
              )}
            </div>

            {/* Weekly summary card */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div
                className="px-4 py-3.5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <span style={{ color: "#F4F2EE", fontSize: 13 }}>Weekly hours</span>
              </div>
              <div className="px-4 py-4">
                {/* Total */}
                <div className="flex items-end gap-2 mb-5">
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: "2rem", fontWeight: 700, color: "#F4F2EE", lineHeight: 1 }}>
                    {fmtHours(totalWeeklyHours)}
                  </span>
                  <span style={{ color: "#8A8882", fontSize: 12, paddingBottom: 4 }}>available / week</span>
                </div>

                {/* Per-day bars */}
                <div className="flex flex-col gap-2.5">
                  {DAYS_ORDER.map((day) => {
                    const d = schedule[day];
                    const hours = d.enabled ? calcHours(d.slots) : 0;
                    const maxH = 10;
                    const pct = Math.min((hours / maxH) * 100, 100);
                    return (
                      <div key={day} className="flex items-center gap-3">
                        <span
                          style={{
                            width: 28,
                            color: d.enabled ? "#8A8882" : "#2E2E30",
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 11,
                            flexShrink: 0,
                          }}
                        >
                          {day.toUpperCase()}
                        </span>
                        <div
                          className="flex-1 rounded-full overflow-hidden"
                          style={{ height: 6, background: "rgba(255,255,255,0.06)" }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              background: d.enabled
                                ? `linear-gradient(90deg, #E8593C, #FF8A70)`
                                : "rgba(255,255,255,0.04)",
                            }}
                          />
                        </div>
                        <span
                          style={{
                            width: 36,
                            textAlign: "right",
                            color: d.enabled ? "#4A4946" : "#2E2E30",
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 11,
                            flexShrink: 0,
                          }}
                        >
                          {d.enabled ? fmtHours(hours) : "—"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Settings summary card */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div
                className="px-4 py-3.5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <span style={{ color: "#F4F2EE", fontSize: 13 }}>Booking rules</span>
              </div>
              <div className="px-4 py-3 flex flex-col gap-0">
                {[
                  { label: "Buffer before", value: bufferBefore },
                  { label: "Buffer after",  value: bufferAfter  },
                  { label: "Min. notice",   value: minNotice    },
                  { label: "Daily limit",   value: dailyLimit   },
                  { label: "Timezone",      value: timezone.replace(/^UTC[^\s]+ /, "")  },
                ].map(({ label, value }, i, arr) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-2.5"
                    style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                  >
                    <span style={{ color: "#8A8882", fontSize: 12 }}>{label}</span>
                    <span style={{ color: "#F4F2EE", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Override summary */}
            {sortedOverrides.length > 0 && (
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div
                  className="px-4 py-3.5 flex items-center justify-between"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <span style={{ color: "#F4F2EE", fontSize: 13 }}>Date overrides</span>
                  <span
                    className="px-2 py-0.5 rounded text-xs"
                    style={{ background: "rgba(232,89,60,0.1)", color: "#E8593C", fontFamily: "'DM Mono', monospace" }}
                  >
                    {sortedOverrides.length}
                  </span>
                </div>
                <div className="px-4 py-3 flex flex-col gap-2">
                  {sortedOverrides.slice(0, 4).map((ov) => (
                    <div key={ov.date} className="flex items-center gap-2">
                      {ov.type === "blocked" ? (
                        <CalendarX size={13} strokeWidth={1.5} style={{ color: "#E8593C", flexShrink: 0 }} />
                      ) : (
                        <CalendarClock size={13} strokeWidth={1.5} style={{ color: "#4B9EFF", flexShrink: 0 }} />
                      )}
                      <span style={{ color: "#8A8882", fontSize: 12, flex: 1 }}>{fmtOverrideDate(ov.date)}</span>
                      <span
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 11,
                          color: ov.type === "blocked" ? "#E8593C" : "#4B9EFF",
                        }}
                      >
                        {ov.type === "blocked" ? "BLOCKED" : ov.slots ? fmtHours(calcHours(ov.slots)) : ""}
                      </span>
                    </div>
                  ))}
                  {sortedOverrides.length > 4 && (
                    <div style={{ color: "#4A4946", fontSize: 12, paddingTop: 2 }}>
                      +{sortedOverrides.length - 4} more
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Day / Night indicator */}
            <div
              className="rounded-2xl px-4 py-3.5 flex items-center gap-3"
              style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-2 flex-1">
                <Sun size={14} strokeWidth={1.5} style={{ color: "#F0A429" }} />
                <div className="flex-1">
                  <div style={{ color: "#8A8882", fontSize: 11 }}>Earliest start</div>
                  <div style={{ color: "#F4F2EE", fontFamily: "'DM Mono', monospace", fontSize: 13 }}>
                    {(() => {
                      const starts = DAYS_ORDER.filter(d => schedule[d].enabled && schedule[d].slots.length > 0)
                        .map(d => schedule[d].slots[0].start);
                      return starts.length ? starts.sort()[0] : "—";
                    })()}
                  </div>
                </div>
              </div>
              <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.07)" }} />
              <div className="flex items-center gap-2 flex-1 justify-end text-right">
                <div>
                  <div style={{ color: "#8A8882", fontSize: 11 }}>Latest end</div>
                  <div style={{ color: "#F4F2EE", fontFamily: "'DM Mono', monospace", fontSize: 13 }}>
                    {(() => {
                      const ends = DAYS_ORDER.filter(d => schedule[d].enabled && schedule[d].slots.length > 0)
                        .map(d => schedule[d].slots[schedule[d].slots.length - 1].end);
                      return ends.length ? ends.sort().reverse()[0] : "—";
                    })()}
                  </div>
                </div>
                <Moon size={14} strokeWidth={1.5} style={{ color: "#4B9EFF" }} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
