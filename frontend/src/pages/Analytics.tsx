import { useState, useMemo } from "react";
import {
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, ArrowUpRight, BarChart2 } from "lucide-react";

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  bg:        "#0F0F11",
  surface:   "#161618",
  elevated:  "#1E1E21",
  border:    "rgba(255,255,255,0.07)",
  borderMid: "rgba(255,255,255,0.05)",
  coral:     "#E8593C",
  green:     "#2ECC8A",
  amber:     "#F0A429",
  blue:      "#4B9EFF",
  purple:    "#A855F7",
  textPri:   "#F4F2EE",
  textSec:   "#8A8882",
  textMut:   "#4A4946",
};

const MONO = "'DM Mono', monospace";
const SERIF = "'Fraunces', serif";

// ─── Colour per event type ────────────────────────────────────────────────────
const EVENT_COLORS: Record<string, string> = {
  "Discovery Call":   C.coral,
  "Strategy Session": C.blue,
  "Follow-up Call":   C.green,
  "Intro Call":       C.amber,
  "Deep Dive":        C.purple,
};

// ─── Generate deterministic daily data ───────────────────────────────────────
function seed(n: number) { return ((Math.sin(n) * 9301 + 49297) % 233280) / 233280; }

function genDays(count: number) {
  const base = new Date(2026, 2, 20); // 20 Mar 2026
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    const bookings = Math.round(seed(i * 7) * 12 + 2);
    const views    = bookings + Math.round(seed(i * 13) * 20 + 5);
    const revenue  = bookings * (Math.round(seed(i * 3) * 80 + 40));
    return {
      date: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      bookings,
      views,
      revenue,
      conversion: Math.round((bookings / views) * 100),
    };
  });
}

const ALL_DAYS = genDays(90);

// ─── Event type breakdown ─────────────────────────────────────────────────────
const EVENT_TYPES = [
  { name: "Discovery Call",   views: 312, bookings: 87, revenue: 4350  },
  { name: "Strategy Session", views: 198, bookings: 42, revenue: 6720  },
  { name: "Follow-up Call",   views: 156, bookings: 61, revenue: 3050  },
  { name: "Intro Call",       views: 220, bookings: 73, revenue: 3650  },
  { name: "Deep Dive",        views: 88,  bookings: 21, revenue: 3360  },
];

// ─── Range options ─────────────────────────────────────────────────────────────
const RANGES = ["7d", "30d", "90d"] as const;
type Range = typeof RANGES[number];
const RANGE_DAYS: Record<Range, number> = { "7d": 7, "30d": 30, "90d": 90 };

// ─── Tooltip styles ───────────────────────────────────────────────────────────
const tooltipStyle = {
  contentStyle: {
    background: C.elevated,
    border: `1px solid rgba(255,255,255,0.1)`,
    borderRadius: 10,
    color: C.textPri,
    fontSize: 12,
    fontFamily: MONO,
    boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
    padding: "8px 12px",
  },
  labelStyle: { color: C.textSec, marginBottom: 4 },
  itemStyle:  { color: C.textSec },
  cursor:     { stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 },
};

// ─── Sparkline ────────────────────────────────────────────────────────────────
function Sparkline({ data, positive = true }: { data: { v: number }[]; positive?: boolean }) {
  const color = positive ? C.coral : C.amber;
  return (
    <ResponsiveContainer width="100%" height={36}>
      <AreaChart data={data} margin={{ top: 3, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0}    />
          </linearGradient>
        </defs>
        <Area
          type="monotone" dataKey="v"
          stroke={color} strokeWidth={1.5}
          fill={`url(#sg-${color.replace("#","")})`}
          dot={false} isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Metric card ──────────────────────────────────────────────────────────────
function MetricCard({
  label, value, delta, positive, sparkData,
}: {
  label: string; value: string; delta: string; positive: boolean; sparkData: { v: number }[];
}) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col"
      style={{ background: C.surface, border: `1px solid ${C.border}` }}
    >
      <div className="flex items-center justify-between mb-1">
        <span style={{ color: C.textMut, fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em" }}>
          {label.toUpperCase()}
        </span>
        <span
          className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded"
          style={{
            color: positive ? C.green : C.amber,
            background: positive ? "rgba(46,204,138,0.1)" : "rgba(240,164,41,0.1)",
            fontFamily: MONO,
          }}
        >
          {positive ? <TrendingUp size={10} strokeWidth={2} /> : <TrendingDown size={10} strokeWidth={2} />}
          {delta}
        </span>
      </div>
      <div style={{ fontFamily: SERIF, fontSize: "1.8rem", fontWeight: 700, color: C.textPri, lineHeight: 1.1, marginBottom: 10 }}>
        {value}
      </div>
      <Sparkline data={sparkData} positive={positive} />
    </div>
  );
}

// ─── Custom donut tooltip ─────────────────────────────────────────────────────
function DonutTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0].payload;
  const total = EVENT_TYPES.reduce((s, e) => s + e.bookings, 0);
  return (
    <div
      className="px-3 py-2 rounded-xl"
      style={{ background: C.elevated, border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
    >
      <div style={{ color: C.textSec, fontFamily: MONO, fontSize: 11, marginBottom: 4 }}>{name}</div>
      <div style={{ color: C.textPri, fontFamily: MONO, fontSize: 13 }}>{value} bookings</div>
      <div style={{ color: C.textMut, fontFamily: MONO, fontSize: 11 }}>{Math.round((value / total) * 100)}%</div>
    </div>
  );
}

// ─── Custom line tooltip ──────────────────────────────────────────────────────
function LineTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2.5 rounded-xl"
      style={{ background: C.elevated, border: `1px solid rgba(255,255,255,0.12)`, boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}
    >
      <div style={{ color: C.textSec, fontFamily: MONO, fontSize: 11, marginBottom: 6 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1 last:mb-0">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span style={{ color: C.textSec, fontFamily: MONO, fontSize: 11, textTransform: "capitalize" }}>
            {p.dataKey}
          </span>
          <span style={{ color: C.textPri, fontFamily: MONO, fontSize: 11, marginLeft: "auto", paddingLeft: 12 }}>
            {p.dataKey === "revenue" ? `$${p.value}` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Bar for table ────────────────────────────────────────────────────────────
function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 rounded-full overflow-hidden" style={{ height: 5, background: "rgba(255,255,255,0.06)", minWidth: 60 }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}99)` }}
        />
      </div>
      <span style={{ color: C.textSec, fontFamily: MONO, fontSize: 12, minWidth: 34, textAlign: "right" }}>
        {Math.round(pct)}%
      </span>
    </div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ color: C.textMut, fontFamily: MONO, fontSize: 11, letterSpacing: "0.08em", marginBottom: 12 }}>
      {children}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function Analytics() {
  const [range, setRange] = useState<Range>("30d");
  const [activeLines, setActiveLines] = useState({ bookings: true, revenue: false });

  const days = useMemo(() => ALL_DAYS.slice(-(RANGE_DAYS[range])), [range]);

  // Aggregate stats for selected range
  const totalBookings = days.reduce((s, d) => s + d.bookings, 0);
  const totalViews    = days.reduce((s, d) => s + d.views, 0);
  const totalRevenue  = days.reduce((s, d) => s + d.revenue, 0);
  const avgConversion = Math.round((totalBookings / totalViews) * 100);
  const avgSession    = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;

  // Sparkline slices (last 14 points)
  const spark = (key: "bookings" | "views" | "revenue" | "conversion") =>
    ALL_DAYS.slice(-14).map((d) => ({ v: d[key] }));

  // Thin out x-axis labels
  const labeledDays = days.map((d, i) => ({
    ...d,
    label: i === 0 || i === days.length - 1 || i % Math.ceil(days.length / 6) === 0 ? d.date : "",
  }));

  const totalDonut = EVENT_TYPES.reduce((s, e) => s + e.bookings, 0);

  const toggleLine = (key: "bookings" | "revenue") => {
    setActiveLines((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      // keep at least one active
      if (!next.bookings && !next.revenue) return prev;
      return next;
    });
  };

  return (
    <div className="min-h-[calc(100vh-48px)]" style={{ background: C.bg }}>
      {/* ── Page header ── */}
      <div
        className="flex items-center justify-between px-6 md:px-8 py-5"
        style={{ borderBottom: `1px solid ${C.border}` }}
      >
        <div>
          <h1 style={{ fontFamily: SERIF, fontSize: "1.75rem", fontWeight: 600, color: C.textPri, lineHeight: 1.2 }}>
            Analytics
          </h1>
          <p className="text-sm mt-1" style={{ color: C.textSec }}>
            Performance overview · Marcus Studio
          </p>
        </div>
        <div className="flex items-center gap-1 p-0.5 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="px-4 py-1.5 rounded-lg text-sm transition-all"
              style={{
                background: range === r ? C.coral : "transparent",
                color: range === r ? "white" : C.textSec,
                fontFamily: MONO,
                fontSize: 12,
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 md:px-8 py-7 flex flex-col gap-8">

        {/* ── Metric cards ── */}
        <div>
          <SectionLabel>OVERVIEW</SectionLabel>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard
              label="Total bookings"
              value={totalBookings.toString()}
              delta="+18%"
              positive={true}
              sparkData={spark("bookings")}
            />
            <MetricCard
              label="Conversion rate"
              value={`${avgConversion}%`}
              delta="+3.1%"
              positive={true}
              sparkData={spark("conversion")}
            />
            <MetricCard
              label="Revenue"
              value={`$${totalRevenue.toLocaleString()}`}
              delta="+$1,240"
              positive={true}
              sparkData={spark("revenue")}
            />
            <MetricCard
              label="Avg. session value"
              value={`$${avgSession}`}
              delta="-$4"
              positive={false}
              sparkData={ALL_DAYS.slice(-14).map((d) => ({ v: d.bookings > 0 ? Math.round(d.revenue / d.bookings) : 0 }))}
            />
          </div>
        </div>

        {/* ── Main chart row ── */}
        <div className="grid xl:grid-cols-3 gap-5">

          {/* Line chart — 2/3 width */}
          <div
            className="xl:col-span-2 rounded-xl overflow-hidden"
            style={{ background: C.surface, border: `1px solid ${C.border}` }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: `1px solid ${C.border}` }}
            >
              <div>
                <div style={{ color: C.textPri, fontSize: 13 }}>Bookings over time</div>
                <div style={{ color: C.textMut, fontFamily: MONO, fontSize: 11, marginTop: 2 }}>
                  {days[0]?.date} — {days[days.length - 1]?.date}
                </div>
              </div>
              {/* Series toggles */}
              <div className="flex items-center gap-2">
                {(["bookings", "revenue"] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => toggleLine(key)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all"
                    style={{
                      fontFamily: MONO,
                      background: activeLines[key] ? (key === "bookings" ? "rgba(232,89,60,0.12)" : "rgba(46,204,138,0.1)") : "rgba(255,255,255,0.04)",
                      color: activeLines[key] ? (key === "bookings" ? C.coral : C.green) : C.textMut,
                      border: `1px solid ${activeLines[key] ? (key === "bookings" ? "rgba(232,89,60,0.3)" : "rgba(46,204,138,0.25)") : "rgba(255,255,255,0.08)"}`,
                      opacity: activeLines[key] ? 1 : 0.5,
                    }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ background: key === "bookings" ? C.coral : C.green }} />
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div className="px-2 pt-5 pb-3">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={labeledDays} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="bookingsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={C.coral} stopOpacity={0.18} />
                      <stop offset="100%" stopColor={C.coral} stopOpacity={0}    />
                    </linearGradient>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={C.green} stopOpacity={0.14} />
                      <stop offset="100%" stopColor={C.green} stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    stroke="rgba(255,255,255,0.04)"
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: C.textMut, fontFamily: MONO, fontSize: 10 }}
                    interval={0}
                  />
                  <YAxis
                    yAxisId="bookings"
                    orientation="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: C.textMut, fontFamily: MONO, fontSize: 10 }}
                    width={32}
                  />
                  {activeLines.revenue && (
                    <YAxis
                      yAxisId="revenue"
                      orientation="right"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: C.textMut, fontFamily: MONO, fontSize: 10 }}
                      width={40}
                      tickFormatter={(v) => `$${v}`}
                    />
                  )}
                  <Tooltip content={<LineTooltip />} />
                  {activeLines.bookings && (
                    <Line
                      yAxisId="bookings"
                      type="monotone"
                      dataKey="bookings"
                      stroke={C.coral}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: C.coral, strokeWidth: 0 }}
                      isAnimationActive={false}
                    />
                  )}
                  {activeLines.revenue && (
                    <Line
                      yAxisId="revenue"
                      type="monotone"
                      dataKey="revenue"
                      stroke={C.green}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: C.green, strokeWidth: 0 }}
                      isAnimationActive={false}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut chart — 1/3 width */}
          <div
            className="rounded-xl overflow-hidden flex flex-col"
            style={{ background: C.surface, border: `1px solid ${C.border}` }}
          >
            {/* Header */}
            <div
              className="px-5 py-4 flex items-center justify-between flex-shrink-0"
              style={{ borderBottom: `1px solid ${C.border}` }}
            >
              <div>
                <div style={{ color: C.textPri, fontSize: 13 }}>By event type</div>
                <div style={{ color: C.textMut, fontFamily: MONO, fontSize: 11, marginTop: 2 }}>
                  {totalDonut} bookings
                </div>
              </div>
            </div>

            {/* Donut */}
            <div className="flex items-center justify-center pt-4 pb-1">
              <div style={{ position: "relative", width: 160, height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={EVENT_TYPES}
                      dataKey="bookings"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={75}
                      paddingAngle={3}
                      strokeWidth={0}
                      isAnimationActive={false}
                    >
                      {EVENT_TYPES.map((e) => (
                        <Cell key={e.name} fill={EVENT_COLORS[e.name]} opacity={0.9} />
                      ))}
                    </Pie>
                    <Tooltip content={<DonutTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center label */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                >
                  <div style={{ fontFamily: SERIF, fontSize: "1.4rem", fontWeight: 700, color: C.textPri, lineHeight: 1 }}>
                    {totalDonut}
                  </div>
                  <div style={{ color: C.textMut, fontFamily: MONO, fontSize: 10, marginTop: 3 }}>TOTAL</div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="px-5 pb-5 flex flex-col gap-2.5 flex-1">
              {EVENT_TYPES.map((e) => {
                const pct = Math.round((e.bookings / totalDonut) * 100);
                return (
                  <div key={e.name} className="flex items-center gap-2.5">
                    <span
                      className="rounded-sm flex-shrink-0"
                      style={{ width: 10, height: 10, background: EVENT_COLORS[e.name] }}
                    />
                    <span style={{ flex: 1, color: C.textSec, fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {e.name}
                    </span>
                    <span style={{ color: C.textPri, fontFamily: MONO, fontSize: 12, flexShrink: 0 }}>
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Event type performance table ── */}
        <div>
          <SectionLabel>EVENT TYPE PERFORMANCE</SectionLabel>
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: C.surface, border: `1px solid ${C.border}` }}
          >
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {[
                    { label: "Event name",    w: "25%" },
                    { label: "Views",         w: "12%" },
                    { label: "Bookings",      w: "12%" },
                    { label: "Conversion",    w: "28%" },
                    { label: "Revenue",       w: "14%" },
                    { label: "Avg. value",    w: "9%"  },
                  ].map((col) => (
                    <th
                      key={col.label}
                      className="text-left px-5 py-3"
                      style={{
                        width: col.w,
                        color: C.textMut,
                        fontFamily: MONO,
                        fontSize: 11,
                        fontWeight: 500,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {col.label.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {EVENT_TYPES.map((et, i) => {
                  const conv = Math.round((et.bookings / et.views) * 100);
                  const avg  = Math.round(et.revenue / et.bookings);
                  const color = EVENT_COLORS[et.name];
                  const isLast = i === EVENT_TYPES.length - 1;
                  return (
                    <tr
                      key={et.name}
                      className="group transition-colors"
                      style={{
                        borderBottom: isLast ? "none" : `1px solid ${C.borderMid}`,
                        cursor: "default",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {/* Event name */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="rounded-sm flex-shrink-0"
                            style={{ width: 10, height: 10, background: color }}
                          />
                          <span style={{ color: C.textPri, fontSize: 13 }}>{et.name}</span>
                        </div>
                      </td>

                      {/* Views */}
                      <td className="px-5 py-3.5">
                        <span style={{ color: C.textSec, fontFamily: MONO, fontSize: 12 }}>
                          {et.views.toLocaleString()}
                        </span>
                      </td>

                      {/* Bookings */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span style={{ color: C.textPri, fontFamily: MONO, fontSize: 12 }}>
                            {et.bookings}
                          </span>
                          <span
                            className="px-1.5 py-0.5 rounded text-xs"
                            style={{
                              background: `${color}18`,
                              color,
                              fontFamily: MONO,
                              fontSize: 10,
                            }}
                          >
                            +{Math.round(et.bookings * 0.12)}
                          </span>
                        </div>
                      </td>

                      {/* Conversion bar */}
                      <td className="px-5 py-3.5">
                        <MiniBar pct={conv} color={color} />
                      </td>

                      {/* Revenue */}
                      <td className="px-5 py-3.5">
                        <span style={{ color: C.textPri, fontFamily: MONO, fontSize: 12 }}>
                          ${et.revenue.toLocaleString()}
                        </span>
                      </td>

                      {/* Avg value */}
                      <td className="px-5 py-3.5">
                        <span style={{ color: C.textSec, fontFamily: MONO, fontSize: 12 }}>
                          ${avg}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* Totals footer */}
              <tfoot>
                <tr style={{ borderTop: `1px solid ${C.border}`, background: "rgba(255,255,255,0.018)" }}>
                  <td className="px-5 py-3" style={{ color: C.textMut, fontFamily: MONO, fontSize: 11 }}>
                    TOTAL
                  </td>
                  <td className="px-5 py-3">
                    <span style={{ color: C.textSec, fontFamily: MONO, fontSize: 12 }}>
                      {EVENT_TYPES.reduce((s, e) => s + e.views, 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span style={{ color: C.textPri, fontFamily: MONO, fontSize: 12 }}>
                      {totalDonut}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <MiniBar
                      pct={Math.round((totalDonut / EVENT_TYPES.reduce((s, e) => s + e.views, 0)) * 100)}
                      color={C.coral}
                    />
                  </td>
                  <td className="px-5 py-3">
                    <span style={{ color: C.textPri, fontFamily: MONO, fontSize: 12 }}>
                      ${EVENT_TYPES.reduce((s, e) => s + e.revenue, 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span style={{ color: C.textSec, fontFamily: MONO, fontSize: 12 }}>
                      ${Math.round(EVENT_TYPES.reduce((s, e) => s + e.revenue, 0) / totalDonut)}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* ── Secondary stats row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-8">
          {[
            { label: "Busiest day",      value: "Tuesday",  sub: "avg 7.2 bookings" },
            { label: "Peak hour",        value: "10:00 AM", sub: "most slots taken"  },
            { label: "Repeat guests",    value: "34%",      sub: "returned this month" },
            { label: "Cancellation rate",value: "8.4%",     sub: "industry avg 14%"  },
          ].map(({ label, value, sub }) => (
            <div
              key={label}
              className="rounded-xl px-5 py-4"
              style={{ background: C.surface, border: `1px solid ${C.border}` }}
            >
              <div style={{ color: C.textMut, fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", marginBottom: 8 }}>
                {label.toUpperCase()}
              </div>
              <div style={{ fontFamily: SERIF, fontSize: "1.4rem", fontWeight: 600, color: C.textPri, lineHeight: 1, marginBottom: 6 }}>
                {value}
              </div>
              <div style={{ color: C.textMut, fontSize: 12 }}>{sub}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
