import { useState } from "react";
import { useNavigate } from "react-router";
import {
  AreaChart, Area, ResponsiveContainer, BarChart, Bar, Tooltip
} from "recharts";
import {
  Copy, Code2, Share2, PauseCircle, Calendar,
  Clock, MoreHorizontal, RotateCcw, X
} from "lucide-react";

const sparkData = [
  [3,5,4,7,6,8,12],
  [60,55,70,65,68,72,68],
  [1,3,2,4,2,3,4],
  [800,1100,900,1300,1500,1700,1840],
].map(d => d.map(v => ({ v })));

const BOOKINGS = [
  { name: "Sarah K.", initials: "SK", type: "Discovery Call", time: "09:00", dur: "30 min", status: "confirmed", color: "#E8593C" },
  { name: "James R.", initials: "JR", type: "Strategy Session", time: "11:30", dur: "60 min", status: "pending", color: "#4B9EFF" },
  { name: "Priya M.", initials: "PM", type: "Follow-up Call", time: "14:00", dur: "30 min", status: "confirmed", color: "#2ECC8A" },
  { name: "Tom L.", initials: "TL", type: "Intro Call", time: "15:30", dur: "30 min", status: "confirmed", color: "#F0A429" },
];

const ACTIVITY = [
  { text: "Sarah K. booked 30-min intro call", time: "09:14", type: "book" },
  { text: "James R. cancelled strategy session", time: "08:33", type: "cancel" },
  { text: "New reminder sent to 3 guests", time: "08:00", type: "remind" },
  { text: "Priya M. rescheduled follow-up", time: "Yesterday", type: "reschedule" },
  { text: "New booking page viewed 24 times", time: "Yesterday", type: "view" },
];

const STATS = [
  { label: "This week's bookings", value: "12", sparkIdx: 0, delta: "+3", positive: true },
  { label: "Conversion rate", value: "68%", sparkIdx: 1, delta: "+2.4%", positive: true },
  { label: "Upcoming today", value: "4", sparkIdx: 2, delta: "0", positive: true },
  { label: "Revenue this month", value: "$1,840", sparkIdx: 3, delta: "+$340", positive: true },
];

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

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            Good morning, Marcus
          </h1>
          <p className="text-sm mt-1" style={{ color: "#8A8882" }}>
            You have{" "}
            <span style={{ color: "#F4F2EE" }}>4 bookings</span> today
          </p>
        </div>
        <div
          className="text-sm"
          style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", marginTop: 4 }}
        >
          SAT 18 APR 2026
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat, i) => (
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
              <div
                className="text-xs"
                style={{
                  color: stat.positive ? "#2ECC8A" : "#E8593C",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {stat.delta}
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
                {BOOKINGS.length} total
              </span>
            </div>

            <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              {BOOKINGS.map((b, i) => (
                <div
                  key={b.name}
                  className="flex items-center gap-4 px-5 py-4 relative transition-all cursor-pointer"
                  style={{
                    background: hoveredBooking === i ? "#1E1E21" : "transparent",
                  }}
                  onMouseEnter={() => setHoveredBooking(i)}
                  onMouseLeave={() => setHoveredBooking(null)}
                >
                  {/* Avatar */}
                  <div
                    className="flex items-center justify-center rounded-full text-xs flex-shrink-0"
                    style={{
                      width: 36,
                      height: 36,
                      background: b.color + "22",
                      color: b.color,
                      fontFamily: "'DM Mono', monospace",
                      border: `1px solid ${b.color}33`,
                    }}
                  >
                    {b.initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm" style={{ color: "#F4F2EE" }}>
                        {b.name}
                      </span>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          color: "#8A8882",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        {b.type}
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-2 text-xs"
                      style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace" }}
                    >
                      <Clock size={11} strokeWidth={1.5} />
                      {b.time} · {b.dur}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background:
                            b.status === "confirmed" ? "#2ECC8A" : "#F0A429",
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

                    {/* Ghost actions on hover */}
                    {hoveredBooking === i && (
                      <div className="flex items-center gap-1">
                        <button
                          className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-all"
                          style={{
                            border: "1px solid rgba(255,255,255,0.12)",
                            color: "#8A8882",
                          }}
                        >
                          <RotateCcw size={11} strokeWidth={1.5} />
                          Reschedule
                        </button>
                        <button
                          className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-all"
                          style={{
                            border: "1px solid rgba(255,255,255,0.12)",
                            color: "#8A8882",
                          }}
                        >
                          <X size={11} strokeWidth={1.5} />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
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
            <div className="relative">
              {/* Timeline line */}
              <div
                className="absolute left-[7px] top-3 bottom-3"
                style={{
                  width: 1,
                  background: "rgba(255,255,255,0.07)",
                }}
              />
              {ACTIVITY.map((a, i) => (
                <div key={i} className="flex gap-4 mb-4 last:mb-0 relative">
                  <div
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0 mt-0.5 z-10"
                    style={{
                      background:
                        a.type === "book"
                          ? "#2ECC8A"
                          : a.type === "cancel"
                          ? "#E8593C"
                          : a.type === "remind"
                          ? "#4B9EFF"
                          : "#F0A429",
                      boxShadow:
                        a.type === "book"
                          ? "0 0 6px rgba(46,204,138,0.4)"
                          : "none",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm" style={{ color: "#F4F2EE" }}>
                      {a.text}
                    </div>
                    <div
                      className="text-xs mt-0.5"
                      style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
                    >
                      {a.time}
                    </div>
                  </div>
                </div>
              ))}
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

            {/* Copy booking link */}
            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all text-sm"
              style={{
                background: "#E8593C",
                color: "white",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#FF6B47")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#E8593C")
              }
            >
              <Copy size={14} strokeWidth={1.5} />
              {copied ? "Copied!" : "Copy booking link"}
            </button>

            {/* Embed widget */}
            <div
              className="rounded-lg p-3 mb-2"
              style={{
                background: "#1E1E21",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="flex items-center justify-between mb-2 text-xs"
                style={{ color: "#8A8882" }}
              >
                <div className="flex items-center gap-1.5">
                  <Code2 size={12} strokeWidth={1.5} style={{ color: "#E8593C" }} />
                  Embed widget
                </div>
                <button
                  className="text-xs"
                  style={{ color: "#E8593C" }}
                  onClick={handleCopy}
                >
                  Copy
                </button>
              </div>
              <code
                className="text-xs block"
                style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
              >
                &lt;script src="schedulr.io/embed.js"
                data-host="marcus" /&gt;
              </code>
            </div>

            {/* Share page */}
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

            {/* Pause availability */}
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
              {/* Toggle */}
              <div
                className="relative flex-shrink-0"
                style={{ width: 36, height: 20 }}
              >
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
            style={{
              background: "#161618",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm" style={{ color: "#F4F2EE" }}>
                Bookings this week
              </div>
              <MoreHorizontal size={14} style={{ color: "#4A4946" }} />
            </div>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart
                data={[
                  { day: "M", v: 3 },
                  { day: "T", v: 5 },
                  { day: "W", v: 2 },
                  { day: "T", v: 7 },
                  { day: "F", v: 4 },
                  { day: "S", v: 6 },
                  { day: "S", v: 4 },
                ]}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
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
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>
          </div>

          {/* Upcoming event types */}
          <div
            className="rounded-xl p-5"
            style={{
              background: "#161618",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="text-sm mb-4" style={{ color: "#F4F2EE" }}>
              Event types
            </div>
            {[
              { name: "Discovery Call", dur: "30 min", bookings: 8, color: "#E8593C" },
              { name: "Strategy Session", dur: "60 min", bookings: 3, color: "#4B9EFF" },
              { name: "Follow-up", dur: "30 min", bookings: 1, color: "#2ECC8A" },
            ].map((et) => (
              <div
                key={et.name}
                className="flex items-center gap-3 mb-3 last:mb-0 cursor-pointer"
                onClick={() => navigate("/app/events")}
              >
                <div
                  className="w-1 self-stretch rounded-full flex-shrink-0"
                  style={{ background: et.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm" style={{ color: "#F4F2EE" }}>{et.name}</div>
                  <div
                    className="text-xs"
                    style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace" }}
                  >
                    {et.dur}
                  </div>
                </div>
                <div
                  className="text-xs"
                  style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
                >
                  {et.bookings} this week
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
