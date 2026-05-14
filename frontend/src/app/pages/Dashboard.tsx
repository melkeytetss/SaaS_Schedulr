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
import { useMyProfile, useUpdateProfile } from "@/features/profile/useProfile";
import { useAnalyticsSummary } from "@/features/analytics/useAnalytics";

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
  const [copied, setCopied] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [shared, setShared] = useState(false);

  const { data: profile } = useMyProfile();
  const updateProfile = useUpdateProfile();
  const isPaused = profile?.is_paused ?? false;
  const { data: upcomingBookings = [], isLoading: bookingsLoading } = useBookings({ upcomingOnly: true });
  const { data: allBookings = [] } = useBookings();
  const { data: events = [] } = useEvents();
  const { data: analytics } = useAnalyticsSummary();

  const dynamicSparkData = useMemo(() => {
    const weekSpark = [0, 0, 0, 0, 0, 0, 0];
    const upcomingSpark = [0, 0, 0, 0, 0, 0, 0];
    const now = new Date();
    const today = startOfDay(now);

    for (const b of allBookings) {
      const createdDays = Math.floor((today.getTime() - startOfDay(new Date(b.created_at)).getTime()) / (1000 * 3600 * 24));
      if (createdDays >= 0 && createdDays < 7) {
        weekSpark[6 - createdDays]++;
      }

      const startsDays = Math.floor((startOfDay(new Date(b.starts_at)).getTime() - today.getTime()) / (1000 * 3600 * 24));
      if (startsDays >= 0 && startsDays < 7) {
        upcomingSpark[startsDays]++;
      }
    }

    const convSpark = [60, 55, 70, 65, 68, 72, 68];
    const revSpark = [0, 0, 0, 0, 0, 0, 0];

    return [weekSpark, convSpark, upcomingSpark, revSpark].map(arr => arr.map(v => ({ v })));
  }, [allBookings]);

  const recentActivity = useMemo(() => {
    return [...allBookings]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  }, [allBookings]);

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  const { todayBookings, weekCount, bookingsPerDay } = useMemo(() => {
    const now = new Date();
    const todayStart = startOfDay(now);
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    const weekStart = startOfWeek(now);
    const nextWeekStart = new Date(weekStart);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);

    const today: typeof upcomingBookings = [];
    let week = 0;
    const perDay = [0, 0, 0, 0, 0, 0, 0];

    for (const b of upcomingBookings) {
      const s = new Date(b.starts_at);
      if (s >= todayStart && s < tomorrowStart) today.push(b);
    }

    for (const b of allBookings) {
      const s = new Date(b.starts_at);
      if (s >= weekStart && s < nextWeekStart) {
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
  }, [upcomingBookings, allBookings]);

  const defaultSlug = events.find(e => e.is_active)?.slug;
  const bookingLink = profile?.username
    ? `${window.location.origin}/${profile.username}${defaultSlug ? `/${defaultSlug}` : ""}`
    : `${window.location.origin}/book`;

  const embedSnippet = `<script src="${window.location.origin}/embed.js" data-host="${profile?.username ?? "you"}"${defaultSlug ? ` data-slug="${defaultSlug}"` : ""}></script>`;

  const handleCopy = () => {
    void navigator.clipboard.writeText(bookingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyEmbed = () => {
    void navigator.clipboard.writeText(embedSnippet);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Book a meeting with ${profile?.full_name ?? "me"}`,
          url: bookingLink,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          void navigator.clipboard.writeText(bookingLink);
          setShared(true);
          setTimeout(() => setShared(false), 2000);
        }
      }
    } else {
      void navigator.clipboard.writeText(bookingLink);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const eventCounts = useMemo(() => {
    const map = new Map<string, number>();
    const now = new Date();
    const weekStart = startOfWeek(now);
    const nextWeekStart = new Date(weekStart);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);

    for (const b of allBookings) {
      if (!b.event_type_id) continue;
      const s = new Date(b.starts_at);
      if (s >= weekStart && s < nextWeekStart) {
        map.set(b.event_type_id, (map.get(b.event_type_id) ?? 0) + 1);
      }
    }
    return map;
  }, [allBookings]);

  const todayDateLabel = new Date()
    .toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase()
    .replace(/,/g, "");

  const stats = [
    { label: "This week's bookings", value: String(weekCount), sparkIdx: 0, delta: "", positive: true },
    { label: "Conversion rate", value: analytics ? `${Math.round(analytics.conversionRate * 100)}%` : "—", sparkIdx: 1, delta: "", positive: true },
    { label: "Upcoming today", value: String(todayBookings.length), sparkIdx: 2, delta: "", positive: true },
    { label: "Revenue this month", value: "$0", sparkIdx: 3, delta: "", positive: true },
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
            <SparkLine data={dynamicSparkData[stat.sparkIdx]} />
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
                      {getInitials((b as any).customer_name || b.invitee_name || "??")}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm" style={{ color: "#F4F2EE" }}>
                          {(b as any).customer_name || b.invitee_name}
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
            {recentActivity.length === 0 ? (
              <div className="text-sm text-center py-6" style={{ color: "#4A4946" }}>
                Activity will appear here as bookings come in.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {recentActivity.map((b, i) => {
                  const et = (b as typeof b & { event_types?: { title?: string; color?: string; duration_min?: number } }).event_types;
                  const color = et?.color ?? EVENT_COLORS[i % EVENT_COLORS.length];
                  
                  return (
                    <div key={b.id} className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                        style={{
                          background: color + "22",
                          color,
                          border: `1px solid ${color}33`,
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        {getInitials((b as any).customer_name || b.invitee_name || "??")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm truncate" style={{ color: "#F4F2EE" }}>
                          New booking from <span style={{ color }}>{(b as any).customer_name || b.invitee_name}</span>
                        </div>
                        <div className="text-xs" style={{ color: "#8A8882" }}>
                          for {et?.title ?? "Event"}
                        </div>
                      </div>
                      <div
                        className="text-xs whitespace-nowrap"
                        style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
                      >
                        {new Date(b.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
                <button className="text-xs" style={{ color: "#E8593C" }} onClick={handleCopyEmbed}>
                  {copiedEmbed ? "Copied!" : "Copy"}
                </button>
              </div>
              <code
                className="text-xs block truncate"
                style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
              >
                {embedSnippet}
              </code>
            </div>

            <button
              onClick={handleShare}
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
              {shared ? "Link copied!" : "Share page"}
            </button>

            <button
              onClick={() => updateProfile.mutate({ is_paused: !isPaused })}
              disabled={updateProfile.isPending}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-all"
              style={{
                border: `1px solid ${isPaused ? "rgba(232,89,60,0.3)" : "rgba(255,255,255,0.12)"}`,
                color: isPaused ? "#E8593C" : "#F4F2EE",
                background: isPaused ? "rgba(232,89,60,0.06)" : "transparent",
                opacity: updateProfile.isPending ? 0.7 : 1,
              }}
            >
              <div className="flex items-center gap-3">
                <PauseCircle size={14} strokeWidth={1.5} />
                Pause availability
              </div>
              <div className="relative flex-shrink-0" style={{ width: 36, height: 20 }}>
                <div
                  className="absolute inset-0 rounded-full transition-colors"
                  style={{ background: isPaused ? "#E8593C" : "rgba(255,255,255,0.12)" }}
                />
                <div
                  className="absolute top-1 rounded-full transition-all"
                  style={{
                    width: 12,
                    height: 12,
                    background: "white",
                    left: isPaused ? 20 : 4,
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
