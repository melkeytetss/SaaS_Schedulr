import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Video, Phone, MapPin, FileText,
  ChevronLeft, ChevronRight, Save, Trash2, Check, ArrowLeft, X
} from "lucide-react";
import { toast } from "sonner";
import { useEvents, useUpdateEvent, useDeleteEvent } from "@/features/events/useEvents";
import {
  useEventBlockedDates,
  useReplaceEventBlockedDates,
} from "@/features/events/useEventBlockedDates";
import { useMyProfile } from "@/features/profile/useProfile";
import {
  useAvailabilityRules,
  useAvailabilityOverrides,
} from "@/features/availability/useAvailability";
import { useBookings } from "@/features/bookings/useBookings";
import {
  generateSlots,
  isDateBlocked,
  formatDate,
  type BookingLike,
} from "@/features/availability/slots";
import type { AvailabilityRule, AvailabilityOverride } from "@/features/availability/availabilityService";

const DURATIONS = [15, 30, 45, 60];
const COLORS = ["#E8593C", "#4B9EFF", "#2ECC8A", "#F0A429", "#A855F7", "#EC4899", "#F4F2EE", "#8A8882"];

const LOCATIONS = [
  { id: "google_meet", icon: Video, label: "Google Meet", desc: "Auto-generate link" },
  { id: "zoom", icon: Video, label: "Zoom", desc: "Your Zoom account" },
  { id: "phone", icon: Phone, label: "Phone call", desc: "They call you" },
  { id: "in_person", icon: MapPin, label: "In person", desc: "Physical location" },
  { id: "custom", icon: FileText, label: "Custom", desc: "Add custom text" },
];

export function EventEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: events = [], isLoading } = useEvents();
  const { data: profile } = useMyProfile();
  const { data: rules = [] } = useAvailabilityRules();
  const { data: overrides = [] } = useAvailabilityOverrides();
  const { data: bookings = [] } = useBookings();
  const { data: blockedDateRows = [] } = useEventBlockedDates(id);
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const replaceBlocked = useReplaceEventBlockedDates();

  const event = useMemo(() => events.find((e) => e.id === id), [events, id]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [customDuration, setCustomDuration] = useState(false);
  const [color, setColor] = useState("#E8593C");
  const [slug, setSlug] = useState("");
  const [locationKind, setLocationKind] = useState("google_meet");
  const [locationDetail, setLocationDetail] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [bookingWindowDays, setBookingWindowDays] = useState<number | null>(60);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

  // Auto-select the next available date (from today forward) once rules load.
  useEffect(() => {
    if (selectedDate) return;
    if (rules.length === 0) return;
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const horizon = bookingWindowDays ?? 60;
    for (let i = 0; i <= horizon; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      if (!isDateBlocked(d, rules, overrides, blockedDates)) {
        setSelectedDate(d);
        return;
      }
    }
  }, [rules, overrides, selectedDate, bookingWindowDays, blockedDates]);

  useEffect(() => {
    if (!event) return;
    setTitle(event.title);
    setDescription(event.description ?? "");
    setDuration(event.duration_min);
    setCustomDuration(!DURATIONS.includes(event.duration_min));
    setColor(event.color);
    setSlug(event.slug);
    setLocationKind(event.location_kind);
    setLocationDetail(event.location_detail ?? "");
    setIsActive(event.is_active);
    setBookingWindowDays(event.booking_window_days ?? null);
  }, [event]);

  useEffect(() => {
    setBlockedDates(blockedDateRows.map((r) => r.date));
  }, [blockedDateRows]);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-48px)] flex items-center justify-center" style={{ background: "#0F0F11", color: "#8A8882" }}>
        Loading…
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-[calc(100vh-48px)] flex flex-col items-center justify-center gap-4" style={{ background: "#0F0F11" }}>
        <p className="text-sm" style={{ color: "#8A8882" }}>Event type not found.</p>
        <button
          onClick={() => navigate("/app/events")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
          style={{ background: "#E8593C", color: "white" }}
        >
          <ArrowLeft size={14} /> Back to event types
        </button>
      </div>
    );
  }

  const handleSave = async () => {
    if (!title.trim() || !slug.trim()) {
      toast.error("Title and URL slug are required");
      return;
    }
    try {
      await updateEvent.mutateAsync({
        id: event.id,
        patch: {
          title: title.trim(),
          description: description.trim() || null,
          duration_min: duration,
          color,
          slug: slug.trim(),
          location_kind: locationKind,
          location_detail: locationDetail.trim() || null,
          is_active: isActive,
          booking_window_days: bookingWindowDays,
        },
      });
      await replaceBlocked.mutateAsync({
        eventTypeId: event.id,
        ownerId: event.owner_id,
        dates: blockedDates,
      });
      toast.success("Saved");
      navigate("/app/events");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this event type? Bookings tied to it will keep their data but the type will be gone.")) return;
    try {
      await deleteEvent.mutateAsync(event.id);
      toast.success("Event type deleted");
      navigate("/app/events");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const usernamePrefix = profile?.username ? `${profile.username}/` : "…/";

  return (
    <div className="h-[calc(100vh-48px)] flex flex-col" style={{ background: "#0F0F11" }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-6 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "#161618" }}
      >
        <button
          onClick={() => navigate("/app/events")}
          className="flex items-center gap-2 text-sm transition-colors"
          style={{ color: "#8A8882" }}
        >
          <ChevronLeft size={16} />
          All event types
        </button>
        <div className="text-xs" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
          schedulr.io/{usernamePrefix}{slug || "…"}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Form editor */}
        <div
          className="flex flex-col overflow-y-auto"
          style={{ width: "50%", borderRight: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="p-6 flex-1">
            <Section title="Basic Info">
              <div className="mb-4">
                <label className="text-xs mb-1.5 block" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
                  EVENT NAME
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-transparent outline-none text-base border-b pb-1"
                  style={{
                    color: "#F4F2EE",
                    borderColor: "rgba(255,255,255,0.14)",
                    fontFamily: "'Fraunces', serif",
                    fontSize: "1.1rem",
                  }}
                />
              </div>

              <div className="mb-4">
                <label className="text-xs mb-1.5 block" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
                  DESCRIPTION
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
                  style={{
                    background: "#1E1E21",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#F4F2EE",
                  }}
                />
              </div>

              <div className="mb-4">
                <label className="text-xs mb-1.5 block" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
                  DURATION
                </label>
                <div className="flex gap-1 flex-wrap">
                  {DURATIONS.map((d) => (
                    <button
                      key={d}
                      onClick={() => { setCustomDuration(false); setDuration(d); }}
                      className="px-3 py-1.5 rounded-lg text-sm transition-all"
                      style={{
                        background: !customDuration && duration === d ? color : "#1E1E21",
                        color: !customDuration && duration === d ? "white" : "#8A8882",
                        border: `1px solid ${!customDuration && duration === d ? color : "rgba(255,255,255,0.1)"}`,
                      }}
                    >
                      {d} min
                    </button>
                  ))}
                  <button
                    onClick={() => setCustomDuration(true)}
                    className="px-3 py-1.5 rounded-lg text-sm transition-all"
                    style={{
                      background: customDuration ? color : "#1E1E21",
                      color: customDuration ? "white" : "#8A8882",
                      border: `1px solid ${customDuration ? color : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    Custom
                  </button>
                  {customDuration && (
                    <input
                      type="number"
                      min={5}
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value || "0", 10))}
                      className="w-20 px-2 py-1.5 rounded-lg text-sm outline-none"
                      style={{
                        background: "#1E1E21",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#F4F2EE",
                        fontFamily: "'DM Mono', monospace",
                      }}
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs mb-1.5 block" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
                  ACCENT COLOR
                </label>
                <div className="flex gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className="w-7 h-7 rounded-lg transition-all flex items-center justify-center"
                      style={{
                        background: c,
                        boxShadow: color === c ? `0 0 0 2px #0F0F11, 0 0 0 4px ${c}` : "none",
                      }}
                    >
                      {color === c && <Check size={12} color="white" strokeWidth={2.5} />}
                    </button>
                  ))}
                </div>
              </div>
            </Section>

            <Section title="Location">
              <div className="flex flex-col gap-2">
                {LOCATIONS.map(({ id: lid, icon: Icon, label, desc }) => (
                  <button
                    key={lid}
                    onClick={() => setLocationKind(lid)}
                    className="flex items-center gap-3 p-3 rounded-lg text-left"
                    style={{
                      background: locationKind === lid ? "rgba(232,89,60,0.08)" : "#1E1E21",
                      border: `1px solid ${locationKind === lid ? "rgba(232,89,60,0.3)" : "rgba(255,255,255,0.07)"}`,
                    }}
                  >
                    <Icon size={16} strokeWidth={1.5} style={{ color: locationKind === lid ? color : "#8A8882", flexShrink: 0 }} />
                    <div>
                      <div className="text-sm" style={{ color: "#F4F2EE" }}>{label}</div>
                      <div className="text-xs" style={{ color: "#8A8882" }}>{desc}</div>
                    </div>
                    {locationKind === lid && (
                      <div className="ml-auto">
                        <Check size={14} style={{ color }} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {(locationKind === "in_person" || locationKind === "custom" || locationKind === "phone") && (
                <div className="mt-3">
                  <label className="text-xs mb-1.5 block" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
                    DETAILS
                  </label>
                  <input
                    value={locationDetail}
                    onChange={(e) => setLocationDetail(e.target.value)}
                    placeholder={locationKind === "phone" ? "Your phone number" : locationKind === "in_person" ? "Address" : "Meeting details"}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{
                      background: "#1E1E21",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#F4F2EE",
                    }}
                  />
                </div>
              )}
            </Section>

            <Section title="Booking Page">
              <div className="mb-4">
                <label className="text-xs mb-1.5 block" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
                  URL SLUG
                </label>
                <div
                  className="flex items-center rounded-lg overflow-hidden"
                  style={{ border: "1px solid rgba(255,255,255,0.1)", background: "#1E1E21" }}
                >
                  <span
                    className="px-3 py-2 text-sm border-r"
                    style={{
                      color: "#4A4946",
                      borderColor: "rgba(255,255,255,0.1)",
                      fontFamily: "'DM Mono', monospace",
                      whiteSpace: "nowrap",
                    }}
                  >
                    schedulr.io/{usernamePrefix}
                  </span>
                  <input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                    className="flex-1 px-3 py-2 bg-transparent outline-none text-sm"
                    style={{ color: "#F4F2EE", fontFamily: "'DM Mono', monospace" }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs mb-1.5 block" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
                  BOOKING WINDOW
                </label>
                <div className="flex gap-1 flex-wrap">
                  {[7, 14, 30, 60, 90].map((n) => (
                    <button
                      key={n}
                      onClick={() => setBookingWindowDays(n)}
                      className="px-3 py-1.5 rounded-lg text-sm transition-all"
                      style={{
                        background: bookingWindowDays === n ? color : "#1E1E21",
                        color: bookingWindowDays === n ? "white" : "#8A8882",
                        border: `1px solid ${bookingWindowDays === n ? color : "rgba(255,255,255,0.1)"}`,
                      }}
                    >
                      {n} days
                    </button>
                  ))}
                  <button
                    onClick={() => setBookingWindowDays(null)}
                    className="px-3 py-1.5 rounded-lg text-sm transition-all"
                    style={{
                      background: bookingWindowDays === null ? color : "#1E1E21",
                      color: bookingWindowDays === null ? "white" : "#8A8882",
                      border: `1px solid ${bookingWindowDays === null ? color : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    Unlimited
                  </button>
                </div>
                <p className="text-xs mt-2" style={{ color: "#8A8882" }}>
                  {bookingWindowDays === null
                    ? "Invitees can book any future date."
                    : `Invitees can book up to ${bookingWindowDays} days from today.`}
                </p>
              </div>

              <div className="flex items-center justify-between py-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <div className="text-sm" style={{ color: "#F4F2EE" }}>Active</div>
                  <div className="text-xs" style={{ color: "#8A8882" }}>
                    {isActive ? "Accepting bookings" : "Hidden from booking page"}
                  </div>
                </div>
                <button
                  onClick={() => setIsActive(!isActive)}
                  className="relative flex-shrink-0"
                  style={{ width: 40, height: 22 }}
                >
                  <div
                    className="absolute inset-0 rounded-full transition-colors"
                    style={{ background: isActive ? color : "rgba(255,255,255,0.12)" }}
                  />
                  <div
                    className="absolute top-1 rounded-full transition-all"
                    style={{
                      width: 14,
                      height: 14,
                      background: "white",
                      left: isActive ? 22 : 4,
                    }}
                  />
                </button>
              </div>
            </Section>

            <Section title="Blocked Dates">
              <p className="text-xs mb-3" style={{ color: "#8A8882" }}>
                Click a day to block this event on that date. Blocked dates apply
                only to this event, not your global availability.
              </p>
              <BlockedDatesPicker
                accentColor={color}
                blockedDates={blockedDates}
                onToggle={(dateStr) =>
                  setBlockedDates((prev) =>
                    prev.includes(dateStr)
                      ? prev.filter((d) => d !== dateStr)
                      : [...prev, dateStr],
                  )
                }
              />
              {blockedDates.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs mb-2" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
                    {blockedDates.length} DATE{blockedDates.length === 1 ? "" : "S"} BLOCKED
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[...blockedDates].sort().map((d) => (
                      <button
                        key={d}
                        onClick={() =>
                          setBlockedDates((prev) => prev.filter((x) => x !== d))
                        }
                        className="flex items-center gap-1 px-2 py-1 rounded-md text-xs"
                        style={{
                          background: "rgba(232,89,60,0.1)",
                          border: "1px solid rgba(232,89,60,0.25)",
                          color: "#E8593C",
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        {d}
                        <X size={11} strokeWidth={2} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Section>
          </div>

          <div
            className="flex items-center justify-between gap-3 px-6 py-4 flex-shrink-0"
            style={{ background: "#161618", borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <button
              onClick={handleDelete}
              disabled={deleteEvent.isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
              style={{
                border: "1px solid rgba(232,89,60,0.3)",
                color: "#E8593C",
                background: "transparent",
              }}
            >
              <Trash2 size={14} strokeWidth={1.5} />
              Delete
            </button>
            <button
              onClick={handleSave}
              disabled={updateEvent.isPending || replaceBlocked.isPending}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm"
              style={{
                background: color,
                color: "white",
                opacity: updateEvent.isPending || replaceBlocked.isPending ? 0.7 : 1,
                cursor: updateEvent.isPending || replaceBlocked.isPending ? "not-allowed" : "pointer",
              }}
            >
              <Save size={14} strokeWidth={1.5} />
              {updateEvent.isPending || replaceBlocked.isPending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>

        {/* RIGHT: Live preview */}
        <div className="flex-1 overflow-y-auto flex items-start justify-center p-8" style={{ background: "#0F0F11" }}>
          <div className="w-full max-w-xs">
            <div
              className="text-xs text-center mb-4"
              style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
            >
              LIVE PREVIEW
            </div>
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "#161618",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              }}
            >
              <div className="px-5 pt-6 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-3 text-white text-sm"
                  style={{ background: color, fontFamily: "'DM Mono', monospace" }}
                >
                  {(profile?.full_name ?? "You")
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((p) => p[0]?.toUpperCase() ?? "")
                    .join("")}
                </div>
                <div
                  className="text-center text-sm mb-1"
                  style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace" }}
                >
                  {profile?.full_name ?? "You"}
                </div>
                <div
                  className="text-center"
                  style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", color: "#F4F2EE", fontWeight: 600 }}
                >
                  {title || "Untitled event"}
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "#1E1E21", color: "#8A8882", fontFamily: "'DM Mono', monospace" }}
                  >
                    {duration} min
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "#1E1E21", color: "#8A8882", fontFamily: "'DM Mono', monospace" }}
                  >
                    {LOCATIONS.find((l) => l.id === locationKind)?.label ?? locationKind}
                  </span>
                </div>
                {description && (
                  <p
                    className="text-xs text-center mt-3"
                    style={{ color: "#8A8882", lineHeight: 1.5 }}
                  >
                    {description.slice(0, 120)}{description.length > 120 && "…"}
                  </p>
                )}
              </div>

              <div className="px-4 py-4">
                <MiniCalendar
                  accentColor={color}
                  rules={rules}
                  overrides={overrides}
                  selectedDate={selectedDate}
                  onSelect={setSelectedDate}
                  bookingWindowDays={bookingWindowDays}
                  eventBlockedDates={blockedDates}
                />
                <TimeSlots
                  accentColor={color}
                  selectedDate={selectedDate}
                  durationMin={duration}
                  rules={rules}
                  overrides={overrides}
                  bookings={bookings}
                  eventBlockedDates={blockedDates}
                />
              </div>

              <div
                className="px-4 py-3 text-xs"
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                  color: "#4A4946",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {profile?.timezone ?? "UTC"} ▾
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function MiniCalendar({
  accentColor,
  rules,
  overrides,
  selectedDate,
  onSelect,
  bookingWindowDays,
  eventBlockedDates,
}: {
  accentColor: string;
  rules: AvailabilityRule[];
  overrides: AvailabilityOverride[];
  selectedDate: Date | null;
  onSelect: (d: Date) => void;
  bookingWindowDays: number | null;
  eventBlockedDates: string[];
}) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7; // Mon = 0

  const monthLabel = viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const horizonEnd = bookingWindowDays != null
    ? new Date(todayStart.getFullYear(), todayStart.getMonth(), todayStart.getDate() + bookingWindowDays)
    : null;

  return (
    <div>
      <div
        className="flex items-center justify-between mb-3 text-xs"
        style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace" }}
      >
        <button
          onClick={() => setViewMonth(new Date(year, month - 1, 1))}
          style={{ color: "#4A4946" }}
        >
          <ChevronLeft size={14} />
        </button>
        <span>{monthLabel}</span>
        <button
          onClick={() => setViewMonth(new Date(year, month + 1, 1))}
          style={{ color: "#4A4946" }}
        >
          <ChevronRight size={14} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i} className="text-xs" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`e${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
          const date = new Date(year, month, d);
          const isPast = date < todayStart;
          const pastHorizon = horizonEnd ? date > horizonEnd : false;
          const blocked = isDateBlocked(date, rules, overrides, eventBlockedDates);
          const isAvail = !isPast && !pastHorizon && !blocked;
          const isSel = selectedDate ? sameDay(date, selectedDate) : false;
          return (
            <button
              key={d}
              onClick={() => isAvail && onSelect(date)}
              className="w-full aspect-square rounded-lg text-xs flex items-center justify-center transition-all"
              style={{
                background: isSel ? accentColor : isAvail ? "rgba(255,255,255,0.04)" : "transparent",
                color: isSel ? "white" : isAvail ? "#F4F2EE" : "#4A4946",
                cursor: isAvail ? "pointer" : "default",
                textDecoration: blocked && !isPast && !pastHorizon ? "line-through" : "none",
                opacity: pastHorizon ? 0.4 : 1,
              }}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TimeSlots({
  accentColor,
  selectedDate,
  durationMin,
  rules,
  overrides,
  bookings,
  eventBlockedDates,
}: {
  accentColor: string;
  selectedDate: Date | null;
  durationMin: number;
  rules: AvailabilityRule[];
  overrides: AvailabilityOverride[];
  bookings: BookingLike[];
  eventBlockedDates: string[];
}) {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [selectedDate, durationMin]);

  if (!selectedDate) {
    return (
      <div
        className="mt-4 p-4 rounded-lg text-center text-xs"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px dashed rgba(255,255,255,0.08)",
          color: "#8A8882",
        }}
      >
        Pick a date to see times
      </div>
    );
  }

  const slots = generateSlots({
    date: selectedDate,
    durationMin,
    rules,
    overrides,
    bookings,
    eventBlockedDates,
  });

  if (slots.length === 0) {
    return (
      <div
        className="mt-4 p-4 rounded-lg text-center text-xs"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px dashed rgba(255,255,255,0.08)",
          color: "#8A8882",
        }}
      >
        No times available on this date
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-1.5 mt-4">
      {slots.map((t) => (
        <button
          key={t}
          onClick={() => setSelected(t)}
          className="py-2 rounded-lg text-xs transition-all"
          style={{
            background: selected === t ? accentColor : "transparent",
            color: selected === t ? "white" : "#F4F2EE",
            border: `1px solid ${selected === t ? accentColor : "rgba(255,255,255,0.12)"}`,
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

function BlockedDatesPicker({
  accentColor,
  blockedDates,
  onToggle,
}: {
  accentColor: string;
  blockedDates: string[];
  onToggle: (dateStr: string) => void;
}) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const monthLabel = viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div>
      <div
        className="flex items-center justify-between mb-3 text-xs"
        style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace" }}
      >
        <button onClick={() => setViewMonth(new Date(year, month - 1, 1))} style={{ color: "#4A4946" }}>
          <ChevronLeft size={14} />
        </button>
        <span>{monthLabel}</span>
        <button onClick={() => setViewMonth(new Date(year, month + 1, 1))} style={{ color: "#4A4946" }}>
          <ChevronRight size={14} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i} className="text-xs" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`e${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
          const date = new Date(year, month, d);
          const isPast = date < todayStart;
          const dateStr = formatDate(date);
          const isBlocked = blockedDates.includes(dateStr);
          return (
            <button
              key={d}
              onClick={() => !isPast && onToggle(dateStr)}
              disabled={isPast}
              className="w-full aspect-square rounded-lg text-xs flex items-center justify-center transition-all"
              style={{
                background: isBlocked
                  ? "rgba(232,89,60,0.15)"
                  : isPast
                  ? "transparent"
                  : "rgba(255,255,255,0.04)",
                color: isBlocked ? accentColor : isPast ? "#4A4946" : "#F4F2EE",
                border: isBlocked ? `1px solid ${accentColor}` : "1px solid transparent",
                cursor: isPast ? "default" : "pointer",
                textDecoration: isBlocked ? "line-through" : "none",
              }}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <div
        className="text-xs mb-4"
        style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em" }}
      >
        {title.toUpperCase()}
      </div>
      <div
        className="p-4 rounded-xl"
        style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {children}
      </div>
    </div>
  );
}
