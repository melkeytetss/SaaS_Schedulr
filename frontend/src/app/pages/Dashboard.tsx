import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  AreaChart, Area, ResponsiveContainer, BarChart, Bar, Tooltip
} from "recharts";
import {
  Copy, Code2, Share2, PauseCircle, Calendar,
  Clock, MoreHorizontal
} from "lucide-react";
import { useBookings } from "@/features/bookings/useBookings";
import { useEvents } from "@/features/events/useEvents";
import { useMyProfile } from "@/features/profile/useProfile";

const sparkData = [
  [3,5,4,7,6,8,12],
  [60,55,70,65,68,72,68],
  [1,3,2,4,2,3,4],
  [800,1100,900,1300,1500,1700,1840],
].map(d => d.map(v => ({ v })));

const EVENT_COLORS = ["#E8593C", "#4B9EFF", "#2ECC8A", "#F0A429"];

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfWeek(d: Date): Date {
  const x = startOfDay(d);
  const day = x.getDay(); // 0 = Sunday
  const diff = (day + 6) % 7; // Monday start
  x.setDate(x.getDate() - diff);
  return x;
}

function SparkLine({ data }: { data: { v: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={32}>
      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <Area
          type="monotone"
          dataKey="v"
          stroke="#E8593C"
          fill="rgba(232,89,60,0.12)"
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const [hoveredBooking, setHoveredBooking] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: profile } = useMyProfile();
  const { data: bookings = [], isLoading: bookingsLoading } = useBookings({ upcomingOnly: true });
  const { data: events = [] } = useEvents();

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  const { todayBookings, weekCount, bookingsPerDay } = useMemo(() => {
    const now = new Date();
    const todayStart = startOfDay(now);
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    const weekStart = startOfWeek(now);

    const today: typeof bookings = [];
    let week = 0;
    const perDay = [0, 0, 0, 0, 0, 0, 0];

    for (const b of bookings) {
      const s = new Date(b.starts_at);
      if (s >= todayStart && s < tomorrowStart) today.push(b);
      if (s >= weekStart) {
        week++;
        const idx = (s.getDay() + 6) % 7;
        perDay[idx]++;
      }
    }

    return {
      todayBookings: today,
      weekCount: week,
      bookingsPerDay: ["M", "T", "W", "T", "F", "S", "S"].map((day, i) => ({ day, v: perDay[i] })),
    };
  }, [bookings]);

  const bookingLink = profile?.username
    ? `${window.location.origin}/${profile.username}`
    : `${window.location.origin}/book`;

  const handleCopy = () => {
    void navigator.clipboard.writeText(bookingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const eventCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of bookings) {
      if (!b.event_type_id) continue;
      map.set(b.event_type_id, (map.get(b.event_type_id) ?? 0) + 1);
    }
    return map;
  }, [bookings]);

  const todayDateLabel = new Date()
    .toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase()
    .replace(/,/g, "");

  const stats = [
    { label: "This week's bookings", value: String(weekCount), sparkIdx: 0, delta: "", positive: true },
    { label: "Conversion rate", value: "—", sparkIdx: 1, delta: "", positive: true },
    { label: "Upcoming today", value: String(todayBookings.length), sparkIdx: 2, delta: "", positive: true },
    { label: "Revenue this month", value: "—", sparkIdx: 3, delta: "", positive: true },
  ];

  return (
    <div className="min-h-[calc(100vh-48px)] p-6 md:p-8" style={{ background: "#0F0F11" }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "2rem",
              fontWeight: 600,
              color: "#F4F2EE",
              lineHeight: 1.2,
            }}
          >
            Good morning, {firstName}
          </h1>
          <p className="text-sm mt-1" style={{ color: "#8A8882" }}>
            You have{" "}
            <span style={{ color: "#F4F2EE" }}>
              {todayBookings.length} {todayBookings.length === 1 ? "booking" : "bookings"}
            </span>{" "}
            today
          </p>
        </div>
        <div
          className="text-sm"
          style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", marginTop: 4 }}
        >
          {todayDateLabel}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-5"
            style={{
              background: "#161618",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <div
                className="text-xs"
                style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
              >
                {stat.label.toUpperCase()}
              </div>
            </div>
            <div
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "#F4F2EE",
                marginBottom: 8,
              }}
            >
              {stat.value}
            </div>
            <SparkLine data={sparkData[stat.sparkIdx]} />
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Bookings + Activity */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Upcoming bookings */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: "#161618",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-2">
                <Calendar size={16} strokeWidth={1.5} style={{ color: "#E8593C" }} />
                <span className="text-sm" style={{ color: "#F4F2EE" }}>
                  Today's bookings
                </span>
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded"
                style={{
                  background: "rgba(232,89,60,0.1)",
                  color: "#E8593C",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {todayBookings.length} total
              </span>
            </div>

            <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              {bookingsLoading && (
                <div className="px-5 py-8 text-sm text-center" style={{ color: "#4A4946" }}>
                  Loading…
                </div>
              )}
              {!bookingsLoading && todayBookings.length === 0 && (
                <div className="px-5 py-10 text-sm text-center" style={{ color: "#8A8882" }}>
                  No bookings today. Share your link to get your first one.
                </div>
              )}
              {todayBookings.map((b, i) => {
                const et = (b as typeof b & { event_types?: { title?: string; color?: string; duration_min?: number } }).event_types;
                const color = et?.color ?? EVENT_COLORS[i % EVENT_COLORS.length];
                return (
                  <div
                    key={b.id}
                    className="flex items-center gap-4 px-5 py-4 relative transition-all cursor-pointer"
                    style={{ background: hoveredBooking === i ? "#1E1E21" : "transparent" }}
                    onMouseEnter={() => setHoveredBooking(i)}
                    onMouseLeave={() => setHoveredBooking(null)}
                  >
                    <div
                      className="flex items-center justify-center rounded-full text-xs flex-shrink-0"
                      style={{
                        width: 36,
                        height: 36,
                        background: color + "22",
                        color,
                        fontFamily: "'DM Mono', monospace",
                        border: `1px solid ${color}33`,
                      }}
                    >
                      {getInitials(b.customer_name)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm" style={{ color: "#F4F2EE" }}>
                          {b.customer_name}
                        </span>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            color: "#8A8882",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          {et?.title ?? "Event"}
                        </span>
                      </div>
                      <div
                        className="flex items-center gap-2 text-xs"
                        style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace" }}
                      >
                        <Clock size={11} strokeWidth={1.5} />
                        {formatTime(b.starts_at)} · {et?.duration_min ?? "—"} min
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            background: b.status === "confirmed" ? "#2ECC8A" : "#F0A429",
                          }}
                        />
                        <span
                          className="text-xs"
                          style={{
                            color: b.status === "confirmed" ? "#2ECC8A" : "#F0A429",
                            fontFamily: "'DM Mono', monospace",
                          }}
                        >
                          {b.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity feed */}
          <div
            className="rounded-xl p-5"
            style={{
              background: "#161618",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="text-sm mb-5" style={{ color: "#F4F2EE" }}>
              Recent activity
            </div>
            <div className="text-sm text-center py-6" style={{ color: "#4A4946" }}>
              Activity will appear here as bookings come in.
            </div>
          </div>
        </div>

        {/* Right: Quick actions */}
        <div className="flex flex-col gap-4">
          <div
            className="rounded-xl p-5"
            style={{
              background: "#161618",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="text-sm mb-4" style={{ color: "#F4F2EE" }}>
              Quick actions
            </div>

            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all text-sm"
              style={{ background: "#E8593C", color: "white" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#FF6B47")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#E8593C")}
            >
              <Copy size={14} strokeWidth={1.5} />
              {copied ? "Copied!" : "Copy booking link"}
            </button>

            <div
              className="rounded-lg p-3 mb-2"
              style={{ background: "#1E1E21", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center justify-between mb-2 text-xs" style={{ color: "#8A8882" }}>
                <div className="flex items-center gap-1.5">
                  <Code2 size={12} strokeWidth={1.5} style={{ color: "#E8593C" }} />
                  Embed widget
                </div>
                <button className="text-xs" style={{ color: "#E8593C" }} onClick={handleCopy}>
                  Copy
                </button>
              </div>
              <code
                className="text-xs block truncate"
                style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
              >
                &lt;script src="schedulr.io/embed.js" data-host="{profile?.username ?? "you"}" /&gt;
              </code>
            </div>

            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 text-sm transition-all"
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#F4F2EE",
                background: "transparent",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "transparent")
              }
            >
              <Share2 size={14} strokeWidth={1.5} style={{ color: "#8A8882" }} />
              Share page
            </button>

            <button
              onClick={() => setPaused(!paused)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-all"
              style={{
                border: `1px solid ${paused ? "rgba(232,89,60,0.3)" : "rgba(255,255,255,0.12)"}`,
                color: paused ? "#E8593C" : "#F4F2EE",
                background: paused ? "rgba(232,89,60,0.06)" : "transparent",
              }}
            >
              <div className="flex items-center gap-3">
                <PauseCircle size={14} strokeWidth={1.5} />
                Pause availability
              </div>
              <div className="relative flex-shrink-0" style={{ width: 36, height: 20 }}>
                <div
                  className="absolute inset-0 rounded-full transition-colors"
                  style={{ background: paused ? "#E8593C" : "rgba(255,255,255,0.12)" }}
                />
                <div
                  className="absolute top-1 rounded-full transition-all"
                  style={{
                    width: 12,
                    height: 12,
                    background: "white",
                    left: paused ? 20 : 4,
                  }}
                />
              </div>
            </button>
          </div>

          {/* Mini chart */}
          <div
            className="rounded-xl p-5"
            style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm" style={{ color: "#F4F2EE" }}>
                Bookings this week
              </div>
              <MoreHorizontal size={14} style={{ color: "#4A4946" }} />
            </div>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={bookingsPerDay} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Bar dataKey="v" fill="#E8593C" radius={[3, 3, 0, 0]} />
                <Tooltip
                  contentStyle={{
                    background: "#1E1E21",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    color: "#F4F2EE",
                    fontSize: 12,
                    fontFamily: "'DM Mono', monospace",
                  }}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                />
              </BarChart>
            </ResponsiveContainer>
            <div
              className="flex justify-between mt-2 text-xs"
              style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
            >
              {bookingsPerDay.map((d, i) => (
                <span key={i}>{d.day}</span>
              ))}
            </div>
          </div>

          {/* Event types */}
          <div
            className="rounded-xl p-5"
            style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="text-sm mb-4" style={{ color: "#F4F2EE" }}>
              Event types
            </div>
            {events.length === 0 && (
              <div className="text-sm py-4 text-center" style={{ color: "#4A4946" }}>
                No event types yet.{" "}
                <button
                  onClick={() => navigate("/app/events")}
                  style={{ color: "#E8593C" }}
                >
                  Create one →
                </button>
              </div>
            )}
            {events.map((et, i) => (
              <div
                key={et.id}
                className="flex items-center gap-3 mb-3 last:mb-0 cursor-pointer"
                onClick={() => navigate("/app/events")}
              >
                <div
                  className="w-1 self-stretch rounded-full flex-shrink-0"
                  style={{ background: et.color ?? EVENT_COLORS[i % EVENT_COLORS.length] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate" style={{ color: "#F4F2EE" }}>
                    {et.title}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace" }}
                  >
                    {et.duration_min} min
                  </div>
                </div>
                <div
                  className="text-xs"
                  style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
                >
                  {eventCounts.get(et.id) ?? 0} this week
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
