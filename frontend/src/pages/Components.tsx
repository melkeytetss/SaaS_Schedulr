import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft, Check, X, Info, LayoutDashboard, CalendarDays,
  Bell, Settings, Zap, ChevronRight, GripVertical, Plus, Trash2
} from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer
} from "recharts";

const sparkData = [3, 5, 4, 7, 6, 8, 12].map(v => ({ v }));

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <div
        className="text-xs mb-4"
        style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em" }}
      >
        {title}
      </div>
      <div className="flex flex-wrap gap-4 items-start">{children}</div>
    </div>
  );
}

function Label({ text }: { text: string }) {
  return (
    <div className="text-xs mt-2 text-center" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
      {text}
    </div>
  );
}

// ── Nav Sidebar ──
function NavSidebarDemo({ collapsed }: { collapsed: boolean }) {
  const items = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: CalendarDays, label: "Event Types", active: false },
    { icon: Bell, label: "Reminders", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];
  return (
    <div
      className="rounded-xl py-3 flex flex-col"
      style={{
        width: collapsed ? 52 : 180,
        background: "#161618",
        border: "1px solid rgba(255,255,255,0.07)",
        transition: "width 0.2s",
        overflow: "hidden",
      }}
    >
      {items.map(({ icon: Icon, label, active }) => (
        <div
          key={label}
          className="flex items-center gap-3 px-3 py-2 relative cursor-pointer"
          style={{
            background: active ? "rgba(232,89,60,0.08)" : "transparent",
            color: active ? "#F4F2EE" : "#8A8882",
          }}
        >
          {active && (
            <div className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full" style={{ background: "#E8593C" }} />
          )}
          <Icon size={16} strokeWidth={1.5} style={{ color: active ? "#E8593C" : "#8A8882", flexShrink: 0 }} />
          {!collapsed && <span className="text-sm truncate">{label}</span>}
        </div>
      ))}
    </div>
  );
}

// ── Metric Card ──
function MetricCard({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ width: 160, background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="text-xs mb-1" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
        {label.toUpperCase()}
      </div>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.5rem", fontWeight: 700, color: "#F4F2EE" }}>
        {value}
      </div>
      <div className="text-xs mb-2" style={{ color: "#2ECC8A", fontFamily: "'DM Mono', monospace" }}>
        {delta}
      </div>
      <ResponsiveContainer width="100%" height={28}>
        <AreaChart data={sparkData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <Area type="monotone" dataKey="v" stroke="#E8593C" fill="rgba(232,89,60,0.1)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Booking Card ──
function BookingCardDemo({ status }: { status: "confirmed" | "pending" | "cancelled" }) {
  const colors = { confirmed: "#2ECC8A", pending: "#F0A429", cancelled: "#4A4946" };
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{ width: 280, background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div
        className="flex items-center justify-center rounded-full text-xs flex-shrink-0"
        style={{ width: 36, height: 36, background: "#E8593C22", color: "#E8593C", fontFamily: "'DM Mono', monospace" }}
      >
        SK
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: "#F4F2EE" }}>Sarah K.</span>
          <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.06)", color: "#8A8882" }}>
            Discovery Call
          </span>
        </div>
        <div className="text-xs mt-0.5" style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace" }}>
          09:00 · 30 min
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: colors[status] }} />
        <span className="text-xs" style={{ color: colors[status], fontFamily: "'DM Mono', monospace" }}>
          {status}
        </span>
      </div>
    </div>
  );
}

// ── Calendar Grid ──
function CalendarGridDemo() {
  const [sel, setSel] = useState<number | null>(21);
  const avail = new Set([4,5,7,8,14,15,19,21,22,25,28]);
  return (
    <div className="rounded-xl p-4" style={{ width: 240, background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="flex items-center justify-between mb-3 text-xs" style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace" }}>
        <span>← April 2026 →</span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {["M","T","W","T","F","S","S"].map((d,i) => (
          <div key={i} className="text-xs py-0.5" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>{d}</div>
        ))}
        {[null,null,null,null].map((_,i) => <div key={`e${i}`} />)}
        {Array.from({ length: 30 }, (_, i) => i + 1).map(d => (
          <button
            key={d}
            onClick={() => avail.has(d) && setSel(d)}
            className="w-full aspect-square rounded text-xs flex items-center justify-center"
            style={{
              background: sel === d ? "#E8593C" : "transparent",
              color: sel === d ? "white" : avail.has(d) ? "#F4F2EE" : "#4A4946",
              cursor: avail.has(d) ? "pointer" : "default",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Time Slot Button ──
function TimeSlotDemo() {
  const [sel, setSel] = useState("10:00");
  const slots = [
    { t: "09:00", state: "default" },
    { t: "10:00", state: "selected" },
    { t: "11:00", state: "default" },
    { t: "12:00", state: "disabled" },
  ];
  return (
    <div className="flex flex-col gap-1.5" style={{ width: 120 }}>
      {slots.map(({ t, state }) => (
        <button
          key={t}
          disabled={state === "disabled"}
          onClick={() => state !== "disabled" && setSel(t)}
          className="py-2 rounded-lg text-xs flex items-center justify-between px-3 transition-all"
          style={{
            background: sel === t ? "#E8593C" : "transparent",
            color: sel === t ? "white" : state === "disabled" ? "#4A4946" : "#F4F2EE",
            border: `1px solid ${sel === t ? "#E8593C" : state === "disabled" ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.12)"}`,
            cursor: state === "disabled" ? "not-allowed" : "pointer",
            opacity: state === "disabled" ? 0.5 : 1,
            fontFamily: "'DM Mono', monospace",
          }}
        >
          <span>{t}</span>
          <span className="text-xs opacity-60">30m</span>
        </button>
      ))}
    </div>
  );
}

// ── Plan Badge ──
function PlanBadge({ plan }: { plan: "Free" | "Pro" | "Team" }) {
  const styles = {
    Free: { bg: "rgba(255,255,255,0.06)", color: "#8A8882" },
    Pro: { bg: "rgba(232,89,60,0.12)", color: "#E8593C" },
    Team: { bg: "rgba(75,158,255,0.12)", color: "#4B9EFF" },
  };
  return (
    <span
      className="text-xs px-2.5 py-1 rounded"
      style={{ background: styles[plan].bg, color: styles[plan].color, fontFamily: "'DM Mono', monospace" }}
    >
      {plan.toUpperCase()}
    </span>
  );
}

// ── Status Dot ──
function StatusDot({ status }: { status: "Confirmed" | "Pending" | "Cancelled" | "No-show" }) {
  const c = { Confirmed: "#2ECC8A", Pending: "#F0A429", Cancelled: "#4A4946", "No-show": "#E8593C" };
  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full" style={{ background: c[status] }} />
      <span className="text-sm" style={{ color: c[status], fontFamily: "'DM Mono', monospace" }}>
        {status}
      </span>
    </div>
  );
}

// ── Integration Card ──
function IntCardDemo({ connected }: { connected: boolean }) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3"
      style={{
        width: 180,
        background: "#161618",
        border: connected ? "1px solid rgba(46,204,138,0.2)" : "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-center justify-between">
        <div
          className="flex items-center justify-center rounded-lg text-xs"
          style={{
            width: 40,
            height: 40,
            background: connected ? "rgba(75,158,255,0.15)" : "#1E1E21",
            color: connected ? "#4B9EFF" : "#8A8882",
            fontFamily: "'DM Mono', monospace",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          GC
        </div>
        {connected && (
          <span className="text-xs" style={{ color: "#2ECC8A", fontFamily: "'DM Mono', monospace" }}>
            ✓
          </span>
        )}
      </div>
      <div>
        <div className="text-sm" style={{ color: "#F4F2EE" }}>Google Cal</div>
        <div className="text-xs" style={{ color: "#8A8882" }}>Calendar sync</div>
      </div>
      <button
        className="w-full py-1.5 rounded-lg text-xs"
        style={
          connected
            ? { border: "1px solid rgba(255,255,255,0.12)", color: "#8A8882", background: "transparent" }
            : { background: "#E8593C", color: "white" }
        }
      >
        {connected ? "Manage" : "Connect"}
      </button>
    </div>
  );
}

// ── Input Field ──
function InputDemo() {
  const [val, setVal] = useState("marcus@studio.co");
  return (
    <div className="flex flex-col gap-2" style={{ width: 240 }}>
      {/* Default */}
      <input
        value={val}
        onChange={e => setVal(e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-sm outline-none"
        style={{ background: "#1E1E21", border: "1px solid rgba(255,255,255,0.1)", color: "#F4F2EE" }}
      />
      {/* Focused (simulated) */}
      <input
        defaultValue="Focused state"
        className="w-full px-3 py-2 rounded-lg text-sm outline-none"
        style={{ background: "#1E1E21", border: "1px solid rgba(232,89,60,0.5)", color: "#F4F2EE" }}
      />
      {/* Error */}
      <input
        defaultValue="Error state"
        className="w-full px-3 py-2 rounded-lg text-sm outline-none"
        style={{ background: "rgba(232,89,60,0.06)", border: "1px solid rgba(232,89,60,0.4)", color: "#E8593C" }}
      />
      {/* Disabled */}
      <input
        disabled
        defaultValue="Disabled"
        className="w-full px-3 py-2 rounded-lg text-sm"
        style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.05)", color: "#4A4946", cursor: "not-allowed" }}
      />
    </div>
  );
}

// ── Toggle ──
function ToggleDemo() {
  const [on, setOn] = useState(true);
  return (
    <button onClick={() => setOn(!on)} className="relative" style={{ width: 44, height: 24 }}>
      <div className="absolute inset-0 rounded-full transition-colors" style={{ background: on ? "#E8593C" : "rgba(255,255,255,0.12)" }} />
      <div className="absolute top-1 rounded-full transition-all" style={{ width: 16, height: 16, background: "white", left: on ? 24 : 4 }} />
    </button>
  );
}

// ── Segmented Control ──
function SegmentedDemo() {
  const opts = ["15 min", "30 min", "45 min", "60 min"];
  const [sel, setSel] = useState("30 min");
  return (
    <div className="flex gap-1 p-1 rounded-xl" style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}>
      {opts.map(o => (
        <button
          key={o}
          onClick={() => setSel(o)}
          className="px-3 py-1.5 rounded-lg text-sm transition-all"
          style={{
            background: sel === o ? "#E8593C" : "transparent",
            color: sel === o ? "white" : "#8A8882",
          }}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

// ── Toast ──
function ToastDemo({ type }: { type: "success" | "error" | "info" }) {
  const cfg = {
    success: { icon: <Check size={14} strokeWidth={2} />, color: "#2ECC8A", label: "Booking confirmed!" },
    error: { icon: <X size={14} strokeWidth={2} />, color: "#E8593C", label: "Something went wrong." },
    info: { icon: <Info size={14} strokeWidth={2} />, color: "#4B9EFF", label: "Reminder sent to guest." },
  };
  const c = cfg[type];
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{
        background: "#1E1E21",
        border: `1px solid ${c.color}33`,
        minWidth: 220,
      }}
    >
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: c.color + "22", color: c.color }}
      >
        {c.icon}
      </div>
      <span className="text-sm" style={{ color: "#F4F2EE" }}>{c.label}</span>
    </div>
  );
}

// ── Empty State ──
function EmptyStateDemo() {
  return (
    <div
      className="flex flex-col items-center justify-center p-8 rounded-xl"
      style={{
        width: 280,
        background: "#161618",
        border: "1px dashed rgba(255,255,255,0.1)",
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ background: "rgba(232,89,60,0.1)" }}
      >
        <CalendarDays size={20} strokeWidth={1.5} style={{ color: "#E8593C" }} />
      </div>
      <div className="text-sm mb-1 text-center" style={{ color: "#F4F2EE" }}>
        No bookings yet
      </div>
      <div className="text-xs text-center mb-4" style={{ color: "#8A8882" }}>
        Share your booking link to get started.
      </div>
      <button
        className="px-4 py-2 rounded-lg text-sm"
        style={{ background: "#E8593C", color: "white" }}
      >
        Copy link
      </button>
    </div>
  );
}

// ── Avatar ──
function AvatarDemo() {
  return (
    <div className="flex gap-3 items-center">
      {/* Default */}
      <div
        className="flex items-center justify-center rounded-full text-sm"
        style={{ width: 40, height: 40, background: "#E8593C22", color: "#E8593C", fontFamily: "'DM Mono', monospace" }}
      >
        MK
      </div>
      {/* With status ring - online */}
      <div className="relative">
        <div
          className="flex items-center justify-center rounded-full text-sm"
          style={{ width: 40, height: 40, background: "#4B9EFF22", color: "#4B9EFF", fontFamily: "'DM Mono', monospace" }}
        >
          SK
        </div>
        <div
          className="absolute bottom-0 right-0 w-3 h-3 rounded-full"
          style={{ background: "#2ECC8A", border: "2px solid #0F0F11" }}
        />
      </div>
      {/* Busy */}
      <div className="relative">
        <div
          className="flex items-center justify-center rounded-full text-sm"
          style={{ width: 40, height: 40, background: "#F0A42922", color: "#F0A429", fontFamily: "'DM Mono', monospace" }}
        >
          JR
        </div>
        <div
          className="absolute bottom-0 right-0 w-3 h-3 rounded-full"
          style={{ background: "#F0A429", border: "2px solid #0F0F11" }}
        />
      </div>
    </div>
  );
}

// ── Data Table Row ──
function DataTableDemo() {
  const [hov, setHov] = useState<number | null>(null);
  const [sel, setSel] = useState<number | null>(null);
  const rows = [
    { name: "Marcus Studio", plan: "Pro", bookings: 48 },
    { name: "Clarity Coaching", plan: "Team", bookings: 134 },
    { name: "Forge Dev", plan: "Free", bookings: 7 },
  ];
  const planColors: Record<string, string> = { Free: "#8A8882", Pro: "#E8593C", Team: "#4B9EFF" };
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)", width: 360 }}
    >
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            {["Tenant", "Plan", "Bookings"].map(h => (
              <th key={h} className="px-4 py-2 text-left text-xs" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              onClick={() => setSel(sel === i ? null : i)}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              className="cursor-pointer"
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                background: sel === i ? "rgba(232,89,60,0.06)" : hov === i ? "#1E1E21" : "transparent",
              }}
            >
              <td className="px-4 py-2.5 text-sm" style={{ color: "#F4F2EE" }}>{r.name}</td>
              <td className="px-4 py-2.5">
                <span className="text-xs px-1.5 py-0.5 rounded" style={{ color: planColors[r.plan], background: planColors[r.plan] + "22", fontFamily: "'DM Mono', monospace" }}>
                  {r.plan}
                </span>
              </td>
              <td className="px-4 py-2.5 text-sm" style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace" }}>{r.bookings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Modal ──
function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-lg text-sm"
        style={{ background: "#E8593C", color: "white" }}
      >
        Open modal
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="rounded-2xl p-6"
            style={{ width: 400, background: "#1E1E21", border: "1px solid rgba(255,255,255,0.12)" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", color: "#F4F2EE", fontWeight: 600 }}>
                Confirm action
              </span>
              <button onClick={() => setOpen(false)} style={{ color: "#4A4946" }}><X size={16} /></button>
            </div>
            <p className="text-sm mb-6" style={{ color: "#8A8882" }}>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg text-sm"
                style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#F4F2EE", background: "transparent" }}
              >
                Keep booking
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg text-sm"
                style={{ background: "#E8593C", color: "white" }}
              >
                Cancel booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ComponentsPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen px-8 py-10"
      style={{ background: "#0F0F11", color: "#F4F2EE", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-12">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm"
          style={{ color: "#8A8882" }}
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
        </button>
        <div>
          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "2rem",
              fontWeight: 700,
              color: "#F4F2EE",
              lineHeight: 1,
            }}
          >
            Component Library
          </h1>
          <p className="text-sm mt-1" style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace" }}>
            Schedulr Design System — v1.0
          </p>
        </div>
      </div>

      {/* Navigation Sidebar */}
      <Section title="NAVIGATION SIDEBAR">
        <div className="flex flex-col gap-1">
          <NavSidebarDemo collapsed={false} />
          <Label text="Expanded" />
        </div>
        <div className="flex flex-col gap-1">
          <NavSidebarDemo collapsed={true} />
          <Label text="Collapsed" />
        </div>
      </Section>

      {/* Metric Cards */}
      <Section title="METRIC CARD">
        <div className="flex flex-col gap-1">
          <MetricCard label="Bookings" value="12" delta="+3 this week" />
          <Label text="With sparkline" />
        </div>
        <div className="flex flex-col gap-1">
          <MetricCard label="Revenue" value="$1,840" delta="+$340" />
          <Label text="Revenue variant" />
        </div>
        <div className="flex flex-col gap-1">
          <MetricCard label="Conversion" value="68%" delta="+2.4%" />
          <Label text="Percentage" />
        </div>
      </Section>

      {/* Booking Card */}
      <Section title="BOOKING CARD">
        {(["confirmed", "pending", "cancelled"] as const).map(s => (
          <div key={s} className="flex flex-col gap-1">
            <BookingCardDemo status={s} />
            <Label text={s} />
          </div>
        ))}
      </Section>

      {/* Calendar Grid */}
      <Section title="CALENDAR GRID WIDGET">
        <div className="flex flex-col gap-1">
          <CalendarGridDemo />
          <Label text="With availability + selection" />
        </div>
      </Section>

      {/* Time Slot Button */}
      <Section title="TIME SLOT BUTTON">
        <div className="flex flex-col gap-1">
          <TimeSlotDemo />
          <Label text="default / selected / disabled" />
        </div>
      </Section>

      {/* Plan Badge */}
      <Section title="PLAN BADGE">
        {(["Free", "Pro", "Team"] as const).map(p => (
          <div key={p} className="flex flex-col items-center gap-1">
            <PlanBadge plan={p} />
            <Label text={p} />
          </div>
        ))}
      </Section>

      {/* Status Dot */}
      <Section title="STATUS DOT + LABEL">
        {(["Confirmed", "Pending", "Cancelled", "No-show"] as const).map(s => (
          <div key={s} className="flex flex-col gap-1">
            <StatusDot status={s} />
            <Label text={s} />
          </div>
        ))}
      </Section>

      {/* Integration Card */}
      <Section title="INTEGRATION CARD">
        <div className="flex flex-col gap-1">
          <IntCardDemo connected={true} />
          <Label text="Connected" />
        </div>
        <div className="flex flex-col gap-1">
          <IntCardDemo connected={false} />
          <Label text="Not connected" />
        </div>
      </Section>

      {/* Input */}
      <Section title="INPUT FIELD">
        <div className="flex flex-col gap-1">
          <InputDemo />
          <Label text="default / focused / error / disabled" />
        </div>
      </Section>

      {/* Toggle */}
      <Section title="TOGGLE SWITCH">
        <div className="flex flex-col items-center gap-1">
          <ToggleDemo />
          <Label text="Interactive" />
        </div>
      </Section>

      {/* Segmented control */}
      <Section title="SEGMENTED CONTROL">
        <div className="flex flex-col gap-1">
          <SegmentedDemo />
          <Label text="Duration picker" />
        </div>
      </Section>

      {/* Modal */}
      <Section title="MODAL / DRAWER OVERLAY">
        <div className="flex flex-col gap-1">
          <ModalDemo />
          <Label text="Click to open" />
        </div>
      </Section>

      {/* Toast */}
      <Section title="TOAST NOTIFICATION">
        {(["success", "error", "info"] as const).map(t => (
          <div key={t} className="flex flex-col gap-1">
            <ToastDemo type={t} />
            <Label text={t} />
          </div>
        ))}
      </Section>

      {/* Empty State */}
      <Section title="EMPTY STATE CARD">
        <div className="flex flex-col gap-1">
          <EmptyStateDemo />
          <Label text="With illustration + CTA" />
        </div>
      </Section>

      {/* Data Table Row */}
      <Section title="DATA TABLE ROW">
        <div className="flex flex-col gap-1">
          <DataTableDemo />
          <Label text="default / hover / selected" />
        </div>
      </Section>

      {/* Avatar */}
      <Section title="AVATAR">
        <div className="flex flex-col gap-1">
          <AvatarDemo />
          <Label text="initials / online / busy" />
        </div>
      </Section>

      {/* Typography */}
      <Section title="TYPOGRAPHY">
        <div className="flex flex-col gap-4 max-w-lg">
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: "2.5rem", fontWeight: 700, color: "#F4F2EE", lineHeight: 1 }}>
              Display Heading
            </div>
            <div className="text-xs mt-1" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>Fraunces — 700 — Display</div>
          </div>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "#F4F2EE", lineHeight: 1.6 }}>
              Body text for UI. Clean, readable, professional. DM Sans for all interface labels and body copy.
            </div>
            <div className="text-xs mt-1" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>DM Sans — 400 — Body</div>
          </div>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.875rem", color: "#8A8882" }}>
              09:30 · 30 min · Asia/Manila (UTC+8)
            </div>
            <div className="text-xs mt-1" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>DM Mono — 400 — Data/mono</div>
          </div>
        </div>
      </Section>

      {/* Color Palette */}
      <Section title="COLOR PALETTE">
        <div className="flex flex-wrap gap-3">
          {[
            { name: "Primary BG", color: "#0F0F11" },
            { name: "Surface", color: "#161618" },
            { name: "Elevated", color: "#1E1E21" },
            { name: "Text Primary", color: "#F4F2EE" },
            { name: "Text Secondary", color: "#8A8882" },
            { name: "Text Muted", color: "#4A4946" },
            { name: "Accent", color: "#E8593C" },
            { name: "Accent Hover", color: "#FF6B47" },
            { name: "Success", color: "#2ECC8A" },
            { name: "Warning", color: "#F0A429" },
            { name: "Info", color: "#4B9EFF" },
          ].map(c => (
            <div key={c.name} className="flex flex-col items-center gap-1">
              <div
                className="w-14 h-14 rounded-xl"
                style={{
                  background: c.color,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
              <div className="text-xs text-center" style={{ color: "#8A8882" }}>{c.name}</div>
              <div className="text-xs text-center" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>{c.color}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
