import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  Video,
  Phone,
  MapPin,
  FileText,
  Calendar,
  Clock,
  Zap,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { usePublicEvent } from "@/features/events/useEvents";
import { useEventBlockedDates } from "@/features/events/useEventBlockedDates";
import {
  useAvailabilityRulesFor,
  useAvailabilityOverridesFor,
} from "@/features/availability/useAvailability";
import { generateSlots, isDateBlocked } from "@/features/availability/slots";
import { bookingsService } from "@/features/bookings/bookingsService";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const LOCATION_LABELS: Record<string, { label: string; Icon: typeof Video }> = {
  google_meet: { label: "Google Meet", Icon: Video },
  zoom: { label: "Zoom", Icon: Video },
  phone: { label: "Phone call", Icon: Phone },
  in_person: { label: "In person", Icon: MapPin },
  custom: { label: "Custom", Icon: FileText },
};

type Step = "calendar" | "form" | "confirmed";

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function BookingPage() {
  const navigate = useNavigate();
  const { username, slug } = useParams<{ username: string; slug: string }>();

  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const {
    data: event,
    isLoading: eventLoading,
    isError: eventError,
  } = usePublicEvent(username ?? "", slug ?? "");

  const ownerId = event?.owner_id;
  const profile = (
    event as
      | (typeof event & {
          profiles?: {
            username: string;
            full_name: string;
            avatar_url: string | null;
            timezone: string | null;
            show_photo: boolean | null;
          };
        })
      | undefined
  )?.profiles;

  const { data: rules = [] } = useAvailabilityRulesFor(ownerId);
  const { data: overrides = [] } = useAvailabilityOverridesFor(ownerId);
  const { data: blockedRows = [] } = useEventBlockedDates(event?.id);
  const blockedDateStrs = useMemo(
    () => blockedRows.map((r) => r.date),
    [blockedRows],
  );

  const [viewMonth, setViewMonth] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("calendar");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [goal, setGoal] = useState("");

  const createBooking = useMutation({
    mutationFn: bookingsService.create,
  });

  const durationMin = event?.duration_min ?? 30;
  const bookingWindowDays = event?.booking_window_days ?? null;
  const horizonEnd = useMemo(() => {
    if (bookingWindowDays == null) return null;
    const d = new Date(todayStart);
    d.setDate(todayStart.getDate() + bookingWindowDays);
    return d;
  }, [bookingWindowDays, todayStart]);

  const slots = useMemo(() => {
    if (!selectedDate || !event) return [];
    return generateSlots({
      date: selectedDate,
      durationMin,
      rules,
      overrides,
      eventBlockedDates: blockedDateStrs,
    });
  }, [selectedDate, event, durationMin, rules, overrides, blockedDateStrs]);

  if (eventLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0F0F11", color: "#8A8882" }}
      >
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13 }}>
          Loading booking page…
        </span>
      </div>
    );
  }

  if (eventError || !event) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4 p-6"
        style={{ background: "#0F0F11" }}
      >
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "1.5rem",
            color: "#F4F2EE",
          }}
        >
          This booking page isn't available.
        </h1>
        <p className="text-sm" style={{ color: "#8A8882" }}>
          The link may be incorrect, or the host has made this event inactive.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-2 px-4 py-2 rounded-lg text-sm"
          style={{ background: "#E8593C", color: "white" }}
        >
          Back to home
        </button>
      </div>
    );
  }

  const locationMeta = LOCATION_LABELS[event.location_kind] ?? {
    label: event.location_kind,
    Icon: Video,
  };
  const LocationIcon = locationMeta.Icon;

  const initials =
    (profile?.full_name ?? "?")
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "?";

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1; // Monday start

  const canGoPrev =
    viewMonth.getFullYear() > today.getFullYear() ||
    (viewMonth.getFullYear() === today.getFullYear() &&
      viewMonth.getMonth() > today.getMonth());

  const isDayAvailable = (date: Date) => {
    if (date < todayStart) return false;
    if (horizonEnd && date > horizonEnd) return false;
    return !isDateBlocked(date, rules, overrides, blockedDateStrs);
  };

  const handleConfirm = async () => {
    if (
      !event ||
      !selectedDate ||
      !selectedTime ||
      !name.trim() ||
      !email.trim()
    )
      return;
    const [hh, mm] = selectedTime.split(":").map(Number);
    const starts = new Date(selectedDate);
    starts.setHours(hh, mm, 0, 0);
    const ends = new Date(starts.getTime() + event.duration_min * 60_000);
    try {
      await createBooking.mutateAsync({
        event_type_id: event.id,
        owner_id: event.owner_id,
        invitee_name: name.trim(),
        invitee_email: email.trim(),
        notes: goal.trim() || null,
        starts_at: starts.toISOString(),
        ends_at: ends.toISOString(),
      });
      setStep("confirmed");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not create booking",
      );
    }
  };

  const confirmationDateLabel = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-8"
      style={{ background: "#0F0F11" }}
    >
      <button
        onClick={() => navigate("/")}
        className="fixed top-6 left-6 flex items-center gap-2 text-sm z-10"
        style={{ color: "#8A8882" }}
      >
        <Zap size={14} strokeWidth={1.5} style={{ color: "#E8593C" }} />
        <span style={{ fontFamily: "'DM Mono', monospace" }}>schedulr.io</span>
      </button>

      <div className="w-full max-w-3xl">
        {step !== "confirmed" ? (
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "#161618",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
            }}
          >
            <div className="grid md:grid-cols-2">
              {/* Left panel - host info */}
              <div
                className="p-6 md:p-8"
                style={{ borderRight: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div
                  className="flex items-center justify-center rounded-full text-white text-lg mb-4 overflow-hidden"
                  style={{
                    width: 56,
                    height: 56,
                    background: event.color || "#E8593C",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {profile?.show_photo !== false && profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name ?? ""}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    initials
                  )}
                </div>

                <div className="text-sm mb-1" style={{ color: "#8A8882" }}>
                  {profile?.full_name ?? "Your host"}
                </div>
                <h1
                  className="mb-3"
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: "1.4rem",
                    fontWeight: 600,
                    color: "#F4F2EE",
                    lineHeight: 1.2,
                  }}
                >
                  {event.title}
                </h1>

                <div className="flex flex-wrap gap-2 mb-5">
                  <span
                    className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: "#1E1E21",
                      color: "#8A8882",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    <Clock size={11} strokeWidth={1.5} />
                    {durationMin} min
                  </span>
                  <span
                    className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: "#1E1E21",
                      color: "#8A8882",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    <LocationIcon size={11} strokeWidth={1.5} />
                    {locationMeta.label}
                  </span>
                </div>

                {event.description && (
                  <p
                    className="text-sm"
                    style={{ color: "#8A8882", lineHeight: 1.7 }}
                  >
                    {event.description}
                  </p>
                )}

                {selectedDate && selectedTime && step === "form" && (
                  <div
                    className="mt-6 p-3 rounded-lg"
                    style={{
                      background: "rgba(232,89,60,0.08)",
                      border: "1px solid rgba(232,89,60,0.2)",
                    }}
                  >
                    <div
                      className="text-xs mb-1"
                      style={{
                        color: "#E8593C",
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      SELECTED TIME
                    </div>
                    <div className="text-sm" style={{ color: "#F4F2EE" }}>
                      {confirmationDateLabel}
                    </div>
                    <div
                      className="text-sm"
                      style={{
                        color: "#8A8882",
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      {selectedTime} · {durationMin} min
                    </div>
                  </div>
                )}

                <div
                  className="mt-6 text-xs"
                  style={{
                    color: "#4A4946",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  Showing times in: {profile?.timezone ?? "UTC"}
                </div>
              </div>

              {/* Right panel */}
              <div className="p-6 md:p-8">
                {step === "calendar" && (
                  <>
                    <div className="flex items-center justify-between mb-5">
                      <span
                        style={{
                          fontFamily: "'Fraunces', serif",
                          fontSize: "1rem",
                          color: "#F4F2EE",
                          fontWeight: 600,
                        }}
                      >
                        {MONTHS[month]} {year}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() =>
                            canGoPrev &&
                            setViewMonth(new Date(year, month - 1, 1))
                          }
                          disabled={!canGoPrev}
                          className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                          style={{
                            color: canGoPrev ? "#8A8882" : "#4A4946",
                            background: "#1E1E21",
                            cursor: canGoPrev ? "pointer" : "not-allowed",
                          }}
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <button
                          onClick={() =>
                            setViewMonth(new Date(year, month + 1, 1))
                          }
                          className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                          style={{ color: "#8A8882", background: "#1E1E21" }}
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 mb-2">
                      {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                        <div
                          key={d}
                          className="text-xs text-center py-1"
                          style={{
                            color: "#4A4946",
                            fontFamily: "'DM Mono', monospace",
                          }}
                        >
                          {d}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-6">
                      {Array.from({ length: offset }).map((_, i) => (
                        <div key={`e${i}`} />
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const date = new Date(year, month, day);
                        const avail = isDayAvailable(date);
                        const sel = selectedDate
                          ? sameDay(selectedDate, date)
                          : false;
                        return (
                          <button
                            key={day}
                            disabled={!avail}
                            onClick={() => {
                              if (!avail) return;
                              setSelectedDate(date);
                              setSelectedTime(null);
                            }}
                            className="w-full aspect-square rounded-lg text-sm flex items-center justify-center transition-all"
                            style={{
                              background: sel ? "#E8593C" : "transparent",
                              color: sel
                                ? "white"
                                : avail
                                  ? "#F4F2EE"
                                  : "#4A4946",
                              cursor: avail ? "pointer" : "default",
                              border: sel
                                ? "none"
                                : avail
                                  ? "1px solid transparent"
                                  : "none",
                              fontFamily: "'DM Mono', monospace",
                            }}
                            onMouseEnter={(e) => {
                              if (avail && !sel) {
                                (
                                  e.currentTarget as HTMLElement
                                ).style.background = "rgba(232,89,60,0.15)";
                                (e.currentTarget as HTMLElement).style.color =
                                  "#E8593C";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (avail && !sel) {
                                (
                                  e.currentTarget as HTMLElement
                                ).style.background = "transparent";
                                (e.currentTarget as HTMLElement).style.color =
                                  "#F4F2EE";
                              }
                            }}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>

                    {selectedDate && (
                      <>
                        <div
                          className="text-xs mb-3"
                          style={{
                            color: "#4A4946",
                            fontFamily: "'DM Mono', monospace",
                          }}
                        >
                          AVAILABLE TIMES —{" "}
                          {MONTHS[selectedDate.getMonth()].toUpperCase()}{" "}
                          {selectedDate.getDate()}
                        </div>

                        {slots.length === 0 ? (
                          <div
                            className="p-4 rounded-lg text-center text-xs"
                            style={{
                              background: "rgba(255,255,255,0.02)",
                              border: "1px dashed rgba(255,255,255,0.08)",
                              color: "#8A8882",
                            }}
                          >
                            No times available on this date.
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
                            {slots.map((t) => {
                              const sel = selectedTime === t;
                              return (
                                <button
                                  key={t}
                                  onClick={() => setSelectedTime(t)}
                                  className="py-2.5 rounded-lg text-sm flex items-center justify-between px-3 transition-all"
                                  style={{
                                    background: sel ? "#E8593C" : "transparent",
                                    color: sel ? "white" : "#F4F2EE",
                                    border: `1px solid ${sel ? "#E8593C" : "rgba(255,255,255,0.12)"}`,
                                    fontFamily: "'DM Mono', monospace",
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!sel) {
                                      (
                                        e.currentTarget as HTMLElement
                                      ).style.background =
                                        "rgba(232,89,60,0.1)";
                                      (
                                        e.currentTarget as HTMLElement
                                      ).style.borderColor =
                                        "rgba(232,89,60,0.3)";
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!sel) {
                                      (
                                        e.currentTarget as HTMLElement
                                      ).style.background = "transparent";
                                      (
                                        e.currentTarget as HTMLElement
                                      ).style.borderColor =
                                        "rgba(255,255,255,0.12)";
                                    }
                                  }}
                                >
                                  <span>{t}</span>
                                  <span className="text-xs opacity-60">
                                    {durationMin} min
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {selectedTime && (
                          <button
                            onClick={() => setStep("form")}
                            className="w-full mt-4 py-3 rounded-lg text-sm font-medium transition-all"
                            style={{ background: "#E8593C", color: "white" }}
                            onMouseEnter={(e) =>
                              ((
                                e.currentTarget as HTMLElement
                              ).style.background = "#FF6B47")
                            }
                            onMouseLeave={(e) =>
                              ((
                                e.currentTarget as HTMLElement
                              ).style.background = "#E8593C")
                            }
                          >
                            Continue →
                          </button>
                        )}
                      </>
                    )}
                  </>
                )}

                {step === "form" && (
                  <>
                    <button
                      onClick={() => setStep("calendar")}
                      className="flex items-center gap-2 text-sm mb-6"
                      style={{ color: "#8A8882" }}
                    >
                      <ArrowLeft size={14} strokeWidth={1.5} />
                      Back to times
                    </button>

                    <h2
                      className="mb-6"
                      style={{
                        fontFamily: "'Fraunces', serif",
                        fontSize: "1.1rem",
                        color: "#F4F2EE",
                        fontWeight: 600,
                      }}
                    >
                      Your details
                    </h2>

                    <div className="flex flex-col gap-4">
                      <FormField
                        label="Full name"
                        value={name}
                        onChange={setName}
                        placeholder="Jane Smith"
                      />
                      <FormField
                        label="Email address"
                        value={email}
                        onChange={setEmail}
                        placeholder="jane@example.com"
                        type="email"
                      />
                      <div>
                        <label
                          className="text-xs mb-1.5 block"
                          style={{
                            color: "#4A4946",
                            fontFamily: "'DM Mono', monospace",
                          }}
                        >
                          WHAT ARE YOUR MAIN GOALS? (optional)
                        </label>
                        <textarea
                          value={goal}
                          onChange={(e) => setGoal(e.target.value)}
                          rows={3}
                          placeholder="Tell me a bit about what you're working on..."
                          className="w-full rounded-lg px-3 py-2.5 text-sm outline-none resize-none transition-all"
                          style={{
                            background: "#1E1E21",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "#F4F2EE",
                          }}
                          onFocus={(e) =>
                            ((
                              e.currentTarget as HTMLElement
                            ).style.borderColor = "rgba(232,89,60,0.5)")
                          }
                          onBlur={(e) =>
                            ((
                              e.currentTarget as HTMLElement
                            ).style.borderColor = "rgba(255,255,255,0.1)")
                          }
                        />
                      </div>

                      <button
                        onClick={handleConfirm}
                        disabled={
                          !name.trim() ||
                          !email.trim() ||
                          createBooking.isPending
                        }
                        className="w-full py-3 rounded-lg text-sm font-medium transition-all mt-2"
                        style={{
                          background:
                            name.trim() && email.trim()
                              ? createBooking.isPending
                                ? "rgba(232,89,60,0.7)"
                                : "#E8593C"
                              : "rgba(255,255,255,0.06)",
                          color:
                            name.trim() && email.trim() ? "white" : "#4A4946",
                          cursor:
                            name.trim() &&
                            email.trim() &&
                            !createBooking.isPending
                              ? "pointer"
                              : "not-allowed",
                        }}
                      >
                        {createBooking.isPending
                          ? "Booking…"
                          : "Confirm booking"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Confirmation screen */
          <div
            className="rounded-2xl p-12 text-center max-w-md mx-auto"
            style={{
              background: "#161618",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
            }}
          >
            <div className="flex justify-center mb-6">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle
                  cx="32"
                  cy="32"
                  r="30"
                  stroke="#E8593C"
                  strokeWidth="2"
                />
                <path
                  d="M20 32L28 40L44 24"
                  stroke="#E8593C"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2
              className="mb-2"
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "2rem",
                fontWeight: 700,
                color: "#F4F2EE",
              }}
            >
              You're booked.
            </h2>
            <p className="text-sm mb-8" style={{ color: "#8A8882" }}>
              A confirmation has been sent to {email}
            </p>

            <div
              className="rounded-xl p-4 text-left mb-6"
              style={{
                background: "#1E1E21",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {[
                { label: "Event", value: event.title },
                { label: "Date", value: confirmationDateLabel },
                {
                  label: "Time",
                  value: `${selectedTime}${profile?.timezone ? ` (${profile.timezone})` : ""}`,
                },
                { label: "Duration", value: `${durationMin} min` },
                {
                  label: "Location",
                  value:
                    event.location_kind === "google_meet" ||
                    event.location_kind === "zoom"
                      ? `${locationMeta.label} (link in email)`
                      : event.location_detail
                        ? `${locationMeta.label} — ${event.location_detail}`
                        : locationMeta.label,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between py-2"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <span
                    className="text-xs"
                    style={{
                      color: "#4A4946",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {item.label.toUpperCase()}
                  </span>
                  <span className="text-sm" style={{ color: "#F4F2EE" }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <button
                className="w-full py-2.5 rounded-lg text-sm transition-all"
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#F4F2EE",
                }}
              >
                <Calendar size={14} strokeWidth={1.5} className="inline mr-2" />
                Add to Google Calendar
              </button>
              <button
                className="w-full py-2.5 rounded-lg text-sm transition-all"
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#F4F2EE",
                }}
              >
                Add to Apple Calendar
              </button>
              <button
                className="text-sm mt-2 transition-all"
                style={{ color: "#4A4946" }}
                onClick={() => {
                  setStep("calendar");
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setName("");
                  setEmail("");
                  setGoal("");
                }}
              >
                Book another time →
              </button>
            </div>
          </div>
        )}

        <div className="text-center mt-6">
          <span
            className="text-xs"
            style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
          >
            Powered by{" "}
            <button onClick={() => navigate("/")} style={{ color: "#E8593C" }}>
              Schedulr
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label
        className="text-xs mb-1.5 block"
        style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
      >
        {label.toUpperCase()}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-all"
        style={{
          background: "#1E1E21",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#F4F2EE",
        }}
        onFocus={(e) =>
          ((e.currentTarget as HTMLElement).style.borderColor =
            "rgba(232,89,60,0.5)")
        }
        onBlur={(e) =>
          ((e.currentTarget as HTMLElement).style.borderColor =
            "rgba(255,255,255,0.1)")
        }
      />
    </div>
  );
}
