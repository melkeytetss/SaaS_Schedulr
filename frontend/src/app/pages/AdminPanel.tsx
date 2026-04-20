import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Search, Filter, ChevronDown, X, MoreHorizontal,
  UserX, Eye, Check, Clock, XCircle, Send,
  TrendingUp, RefreshCw,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "overview" | "tenants" | "subscriptions" | "usage" | "emails" | "settings";

const VALID_TABS: Tab[] = ["overview", "tenants", "subscriptions", "usage", "emails", "settings"];

// ─── Shared style constants ───────────────────────────────────────────────────
const PLAN_COLORS: Record<string, { bg: string; text: string }> = {
  Free: { bg: "rgba(255,255,255,0.06)",  text: "#8A8882" },
  Pro:  { bg: "rgba(232,89,60,0.12)",    text: "#E8593C" },
  Team: { bg: "rgba(75,158,255,0.12)",   text: "#4B9EFF" },
};

const STATUS_COLORS: Record<string, { dot: string; text: string }> = {
  active:  { dot: "#2ECC8A", text: "#2ECC8A" },
  trial:   { dot: "#F0A429", text: "#F0A429" },
  churned: { dot: "#4A4946", text: "#4A4946" },
};

const TOOLTIP_STYLE = {
  contentStyle: {
    background: "#1E1E21",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    color: "#F4F2EE",
    fontSize: 12,
    fontFamily: "'DM Mono', monospace",
  },
  cursor: { stroke: "rgba(255,255,255,0.06)", strokeWidth: 1 },
};

// ─── Mock data ────────────────────────────────────────────────────────────────
const MRR_DATA = [
  { month: "Nov", mrr: 8200 },
  { month: "Dec", mrr: 9800 },
  { month: "Jan", mrr: 11400 },
  { month: "Feb", mrr: 13100 },
  { month: "Mar", mrr: 15800 },
  { month: "Apr", mrr: 18400 },
];

const DAILY_OVERVIEW = [
  { day: "5 Apr", bookings: 54 },  { day: "6 Apr", bookings: 78 },
  { day: "7 Apr", bookings: 43 },  { day: "8 Apr", bookings: 91 },
  { day: "9 Apr", bookings: 67 },  { day: "10 Apr", bookings: 83 },
  { day: "11 Apr", bookings: 102 },{ day: "12 Apr", bookings: 88 },
  { day: "13 Apr", bookings: 74 }, { day: "14 Apr", bookings: 59 },
  { day: "15 Apr", bookings: 95 }, { day: "16 Apr", bookings: 71 },
  { day: "17 Apr", bookings: 86 }, { day: "18 Apr", bookings: 63 },
];

const TENANTS = [
  { id: 1, name: "Marcus Studio",    email: "marcus@studio.co",  plan: "Pro",  status: "active",  bookings: 48,  mrr: 12, joined: "Jan 2025", color: "#E8593C" },
  { id: 2, name: "Clarity Coaching", email: "sara@clarity.co",   plan: "Team", status: "active",  bookings: 134, mrr: 49, joined: "Oct 2024", color: "#4B9EFF" },
  { id: 3, name: "Forge Dev",        email: "jake@forge.dev",    plan: "Free", status: "trial",   bookings: 7,   mrr: 0,  joined: "Apr 2026", color: "#2ECC8A" },
  { id: 4, name: "Bloom Wellness",   email: "lily@bloom.io",     plan: "Pro",  status: "active",  bookings: 92,  mrr: 12, joined: "Mar 2025", color: "#F0A429" },
  { id: 5, name: "Apex Legal",       email: "tom@apex.law",      plan: "Team", status: "active",  bookings: 67,  mrr: 49, joined: "Aug 2024", color: "#A855F7" },
  { id: 6, name: "Meridian",         email: "ana@meridian.co",   plan: "Pro",  status: "churned", bookings: 23,  mrr: 0,  joined: "Dec 2024", color: "#8A8882" },
  { id: 7, name: "Atelier Design",   email: "paul@atelier.io",   plan: "Free", status: "active",  bookings: 3,   mrr: 0,  joined: "Apr 2026", color: "#EC4899" },
  { id: 8, name: "Nova Analytics",   email: "dev@novahq.io",     plan: "Team", status: "trial",   bookings: 95,  mrr: 0,  joined: "Mar 2026", color: "#06B6D4" },
];

const SUBSCRIPTIONS = [
  { id: 1, name: "Marcus Studio",    email: "marcus@studio.co",  plan: "Pro",  status: "active",  billing: "Monthly", amount: 12, renewal: "May 19, 2026", color: "#E8593C" },
  { id: 2, name: "Clarity Coaching", email: "sara@clarity.co",   plan: "Team", status: "active",  billing: "Annual",  amount: 49, renewal: "Jan 10, 2027", color: "#4B9EFF" },
  { id: 3, name: "Forge Dev",        email: "jake@forge.dev",    plan: "Free", status: "trial",   billing: "—",       amount: 0,  renewal: "May 3, 2026",  color: "#2ECC8A" },
  { id: 4, name: "Bloom Wellness",   email: "lily@bloom.io",     plan: "Pro",  status: "active",  billing: "Monthly", amount: 12, renewal: "May 12, 2026", color: "#F0A429" },
  { id: 5, name: "Apex Legal",       email: "tom@apex.law",      plan: "Team", status: "active",  billing: "Annual",  amount: 49, renewal: "Aug 31, 2026", color: "#A855F7" },
  { id: 6, name: "Meridian",         email: "ana@meridian.co",   plan: "Pro",  status: "churned", billing: "—",       amount: 0,  renewal: "—",            color: "#8A8882" },
  { id: 7, name: "Atelier Design",   email: "paul@atelier.io",   plan: "Free", status: "active",  billing: "—",       amount: 0,  renewal: "—",            color: "#EC4899" },
  { id: 8, name: "Nova Analytics",   email: "dev@novahq.io",     plan: "Team", status: "trial",   billing: "—",       amount: 0,  renewal: "May 7, 2026",  color: "#06B6D4" },
];

const BILLING_HISTORY = [
  { date: "Apr 19, 2026", amount: "$12.00", status: "paid",     desc: "Pro Monthly" },
  { date: "Mar 19, 2026", amount: "$12.00", status: "paid",     desc: "Pro Monthly" },
  { date: "Feb 19, 2026", amount: "$12.00", status: "paid",     desc: "Pro Monthly" },
  { date: "Jan 19, 2026", amount: "$12.00", status: "paid",     desc: "Pro Monthly" },
  { date: "Dec 19, 2025", amount: "$12.00", status: "paid",     desc: "Pro Monthly" },
  { date: "Nov 19, 2025", amount: "$12.00", status: "refunded", desc: "Pro Monthly" },
];

const EMAIL_LOGS = [
  { id: 1, recipient: "sarah@example.com",  type: "Confirmation", tenant: "Marcus Studio",    sentAt: "Today 09:14",     status: "delivered" },
  { id: 2, recipient: "james@corp.com",     type: "Cancellation", tenant: "Marcus Studio",    sentAt: "Today 08:33",     status: "delivered" },
  { id: 3, recipient: "user@bounce.net",    type: "Reminder",     tenant: "Clarity Coaching", sentAt: "Today 08:00",     status: "bounced"   },
  { id: 4, recipient: "client@example.io",  type: "Confirmation", tenant: "Bloom Wellness",   sentAt: "Yesterday 16:22", status: "delivered" },
  { id: 5, recipient: "test@pending.co",    type: "Reminder",     tenant: "Forge Dev",        sentAt: "Yesterday 12:00", status: "pending"   },
  { id: 6, recipient: "hello@apex.law",     type: "Confirmation", tenant: "Apex Legal",       sentAt: "Yesterday 10:45", status: "delivered" },
];

const DAILY_BOOKINGS_30 = [
  { day: "24 Mar", v: 42 }, { day: "25 Mar", v: 58 }, { day: "26 Mar", v: 35 },
  { day: "27 Mar", v: 67 }, { day: "28 Mar", v: 71 }, { day: "29 Mar", v: 88 },
  { day: "30 Mar", v: 52 }, { day: "31 Mar", v: 49 }, { day: "01 Apr", v: 63 },
  { day: "02 Apr", v: 77 }, { day: "03 Apr", v: 82 }, { day: "04 Apr", v: 68 },
  { day: "05 Apr", v: 91 }, { day: "06 Apr", v: 103 },{ day: "07 Apr", v: 87 },
  { day: "08 Apr", v: 74 }, { day: "09 Apr", v: 56 }, { day: "10 Apr", v: 69 },
  { day: "11 Apr", v: 95 }, { day: "12 Apr", v: 108 },{ day: "13 Apr", v: 84 },
  { day: "14 Apr", v: 79 }, { day: "15 Apr", v: 92 }, { day: "16 Apr", v: 101 },
  { day: "17 Apr", v: 88 }, { day: "18 Apr", v: 76 }, { day: "19 Apr", v: 93 },
  { day: "20 Apr", v: 85 }, { day: "21 Apr", v: 97 }, { day: "22 Apr", v: 104 },
];

const PLAN_USAGE = [
  { name: "Team", value: 6240, color: "#4B9EFF" },
  { name: "Pro",  value: 4890, color: "#E8593C" },
  { name: "Free", value: 1717, color: "#4A4946" },
];

const TOP_TENANTS_USAGE = [
  { name: "Clarity Coaching", initials: "CC", bookings: 312, color: "#4B9EFF", plan: "Team" },
  { name: "Apex Legal",       initials: "AL", bookings: 287, color: "#A855F7", plan: "Team" },
  { name: "Nova Analytics",   initials: "NA", bookings: 201, color: "#06B6D4", plan: "Team" },
  { name: "Bloom Wellness",   initials: "BW", bookings: 164, color: "#F0A429", plan: "Pro"  },
  { name: "Marcus Studio",    initials: "MS", bookings: 78,  color: "#E8593C", plan: "Pro"  },
];

const USAGE_TABLE = [
  { name: "Clarity Coaching", plan: "Team", bookings: 312, eventTypes: 18, emails: 847,  storage: "2.4 GB", color: "#4B9EFF" },
  { name: "Apex Legal",       plan: "Team", bookings: 287, eventTypes: 14, emails: 671,  storage: "1.8 GB", color: "#A855F7" },
  { name: "Nova Analytics",   plan: "Team", bookings: 201, eventTypes: 11, emails: 543,  storage: "1.1 GB", color: "#06B6D4" },
  { name: "Bloom Wellness",   plan: "Pro",  bookings: 164, eventTypes: 9,  emails: 412,  storage: "980 MB", color: "#F0A429" },
  { name: "Marcus Studio",    plan: "Pro",  bookings: 78,  eventTypes: 5,  emails: 201,  storage: "640 MB", color: "#E8593C" },
  { name: "Meridian",         plan: "Pro",  bookings: 43,  eventTypes: 7,  emails: 134,  storage: "380 MB", color: "#8A8882" },
  { name: "Atelier Design",   plan: "Free", bookings: 24,  eventTypes: 3,  emails: 89,   storage: "120 MB", color: "#EC4899" },
  { name: "Forge Dev",        plan: "Free", bookings: 16,  eventTypes: 2,  emails: 48,   storage: "64 MB",  color: "#2ECC8A" },
];

// ─── Reusable small components ────────────────────────────────────────────────
function PlanBadge({ plan }: { plan: string }) {
  return (
    <span
      className="text-xs px-2 py-0.5 rounded"
      style={{ background: PLAN_COLORS[plan]?.bg, color: PLAN_COLORS[plan]?.text, fontFamily: "'DM Mono', monospace" }}
    >
      {plan}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLORS[status]?.dot }} />
      <span className="text-xs" style={{ color: STATUS_COLORS[status]?.text, fontFamily: "'DM Mono', monospace" }}>
        {status}
      </span>
    </div>
  );
}

function TenantAvatar({ name, color, size = 32 }: { name: string; color: string; size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-lg flex-shrink-0 text-xs"
      style={{ width: size, height: size, background: color + "22", color, fontFamily: "'DM Mono', monospace" }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

function MetricCard({ label, value, sub, subColor }: { label: string; value: string; sub?: string; subColor?: string }) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="text-xs mb-1" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", letterSpacing: "0.07em" }}>
        {label.toUpperCase()}
      </div>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.75rem", fontWeight: 700, color: "#F4F2EE", lineHeight: 1.15, marginBottom: 4 }}>
        {value}
      </div>
      {sub && (
        <div className="text-xs" style={{ color: subColor ?? "#8A8882", fontFamily: "'DM Mono', monospace" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function PageTitle({ title }: { title: string }) {
  return (
    <h1 className="mb-6" style={{ fontFamily: "'Fraunces', serif", fontSize: "1.75rem", fontWeight: 600, color: "#F4F2EE", lineHeight: 1.2 }}>
      {title}
    </h1>
  );
}

function ChartCard({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl p-5 ${className}`} style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="text-sm mb-5" style={{ color: "#F4F2EE" }}>{title}</div>
      {children}
    </div>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: React.ReactNode[] }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}>
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-5" style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="text-xs mb-4" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em" }}>
        {title.toUpperCase()}
      </div>
      {children}
    </div>
  );
}

function MiniDropdown({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
        style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.1)", color: value.startsWith("All") ? "#8A8882" : "#F4F2EE" }}
      >
        {value}
        <ChevronDown size={12} style={{ color: "#4A4946" }} />
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-1 z-30 rounded-xl py-1 overflow-hidden"
          style={{ background: "#1E1E21", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 12px 40px rgba(0,0,0,0.4)", minWidth: "100%" }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm transition-colors"
              style={{ background: opt === value ? "rgba(232,89,60,0.08)" : "transparent", color: opt === value ? "#F4F2EE" : "#8A8882", fontFamily: "'DM Mono', monospace", fontSize: 12 }}
              onMouseEnter={(e) => { if (opt !== value) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={(e) => { if (opt !== value) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Subscription detail drawer ───────────────────────────────────────────────
function SubDrawer({ sub, onClose }: { sub: typeof SUBSCRIPTIONS[0]; onClose: () => void }) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const click = (e: MouseEvent) => { if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) onClose(); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", click);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", click); document.removeEventListener("keydown", esc); };
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: "rgba(15,15,17,0.55)", backdropFilter: "blur(3px)" }} />
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col overflow-y-auto"
        style={{ width: 360, background: "#161618", borderLeft: "1px solid rgba(255,255,255,0.1)", boxShadow: "-24px 0 60px rgba(0,0,0,0.5)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1rem", fontWeight: 600, color: "#F4F2EE" }}>
            Subscription detail
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg"
            style={{ width: 28, height: 28, background: "rgba(255,255,255,0.06)", color: "#8A8882" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)")}
          >
            <X size={13} strokeWidth={1.5} />
          </button>
        </div>

        {/* Tenant info */}
        <div className="px-5 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-3 mb-3">
            <TenantAvatar name={sub.name} color={sub.color} size={44} />
            <div>
              <div style={{ color: "#F4F2EE", fontSize: 14 }}>{sub.name}</div>
              <div style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", fontSize: 11 }}>{sub.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PlanBadge plan={sub.plan} />
            <StatusDot status={sub.status} />
          </div>
        </div>

        {/* Plan details */}
        <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="text-xs mb-3" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", letterSpacing: "0.07em" }}>
            PLAN DETAILS
          </div>
          <div className="rounded-xl overflow-hidden" style={{ background: "#1E1E21", border: "1px solid rgba(255,255,255,0.06)" }}>
            {[
              { label: "PLAN",          val: sub.plan },
              { label: "BILLING CYCLE", val: sub.billing },
              { label: "AMOUNT",        val: sub.amount > 0 ? `$${sub.amount}.00 / mo` : "—" },
              { label: "NEXT RENEWAL",  val: sub.renewal },
              { label: "STATUS",        val: sub.status },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between px-4 py-2.5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              >
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#4A4946" }}>{row.label}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#F4F2EE" }}>{row.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Billing history */}
        <div className="px-5 py-4 flex-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="text-xs mb-3" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", letterSpacing: "0.07em" }}>
            BILLING HISTORY
          </div>
          {BILLING_HISTORY.map((row, i) => (
            <div key={i} className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: row.status === "paid" ? "#2ECC8A" : "#F0A429" }} />
                <div>
                  <div style={{ color: "#F4F2EE", fontFamily: "'DM Mono', monospace", fontSize: 11 }}>{row.desc}</div>
                  <div style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", fontSize: 10 }}>{row.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ color: "#F4F2EE", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>{row.amount}</span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{
                    background: row.status === "paid" ? "rgba(46,204,138,0.12)" : "rgba(240,164,41,0.12)",
                    color: row.status === "paid" ? "#2ECC8A" : "#F0A429",
                    fontFamily: "'DM Mono', monospace", fontSize: 9,
                  }}
                >
                  {row.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="px-5 py-5 flex flex-col gap-2">
          <button
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all"
            style={{ background: "#E8593C", color: "white" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#FF6B47")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#E8593C")}
          >
            <TrendingUp size={13} strokeWidth={1.5} />
            Upgrade plan
          </button>
          <button
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all"
            style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#8A8882", background: "transparent" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = "#F4F2EE"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#8A8882"; }}
          >
            Cancel subscription
          </button>
          <button
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all"
            style={{ border: "1px solid rgba(232,89,60,0.25)", color: "#E8593C", background: "transparent" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(232,89,60,0.06)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            <RefreshCw size={13} strokeWidth={1.5} />
            Refund last payment
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main AdminPanel ──────────────────────────────────────────────────────────
export function AdminPanel() {
  const location = useLocation();
  const navigate = useNavigate();

  // Derive active tab from URL hash — syncs with AdminShell sidebar
  const hashRaw = location.hash.replace("#", "") as Tab;
  const tab: Tab = VALID_TABS.includes(hashRaw) ? hashRaw : "overview";

  const setTab = (t: Tab) => navigate(`/admin#${t}`, { replace: true });

  // Local state
  const [tenantSearch, setTenantSearch] = useState("");
  const [selectedTenant, setSelectedTenant] = useState<typeof TENANTS[0] | null>(null);
  const [maintenance, setMaintenance] = useState(false);
  const [expandedEmail, setExpandedEmail] = useState<number | null>(null);
  const [subSearch, setSubSearch] = useState("");
  const [subPlanFilter, setSubPlanFilter] = useState("All plans");
  const [subStatusFilter, setSubStatusFilter] = useState("All statuses");
  const [selectedSub, setSelectedSub] = useState<typeof SUBSCRIPTIONS[0] | null>(null);

  const filteredTenants = TENANTS.filter((t) =>
    t.name.toLowerCase().includes(tenantSearch.toLowerCase()) ||
    t.email.toLowerCase().includes(tenantSearch.toLowerCase())
  );

  const filteredSubs = SUBSCRIPTIONS.filter((s) => {
    const q = subSearch.toLowerCase();
    if (q && !s.name.toLowerCase().includes(q) && !s.email.toLowerCase().includes(q)) return false;
    if (subPlanFilter !== "All plans" && s.plan !== subPlanFilter) return false;
    if (subStatusFilter !== "All statuses" && s.status !== subStatusFilter) return false;
    return true;
  });

  // Top header tabs (the 4 original ones)
  const HEADER_TABS: { id: Tab; label: string }[] = [
    { id: "overview",  label: "Overview"        },
    { id: "tenants",   label: "Tenants"         },
    { id: "emails",    label: "Email Logs"      },
    { id: "settings",  label: "System Settings" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#0F0F11", color: "#F4F2EE" }}>
      {/* Top bar */}
      <div
        className="flex items-center gap-4 px-6 py-3 sticky top-0 z-10"
        style={{ background: "#161618", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex gap-1">
          {HEADER_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-3 py-1.5 rounded-lg text-sm transition-all"
              style={{
                background: tab === t.id ? "rgba(232,89,60,0.1)" : "transparent",
                color: tab === t.id ? "#F4F2EE" : "#8A8882",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="text-xs" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
          SAT 19 APR 2026
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <>
            <PageTitle title="Overview" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <MetricCard label="Total tenants"         value="2,419" sub="+47 this month"   />
              <MetricCard label="MRR"                   value="$18,400" sub="+$1,240" subColor="#2ECC8A" />
              <MetricCard label="Active bookings today" value="847"   sub="Live" subColor="#E8593C" />
              <MetricCard label="Churn rate"            value="2.1%"  sub="-0.3%" subColor="#2ECC8A" />
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <ChartCard title="MRR Growth — 6 months">
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={MRR_DATA} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" tick={{ fill: "#4A4946", fontSize: 11, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#4A4946", fontSize: 11, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`$${Number(v).toLocaleString()}`, "MRR"]} />
                    <Line type="monotone" dataKey="mrr" stroke="#E8593C" strokeWidth={2} dot={{ fill: "#E8593C", r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
              <ChartCard title="Daily bookings — all tenants">
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={DAILY_OVERVIEW} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" tick={{ fill: "#4A4946", fontSize: 10, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} interval={2} />
                    <YAxis tick={{ fill: "#4A4946", fontSize: 11, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} />
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Bar dataKey="bookings" fill="#E8593C" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </>
        )}

        {/* ── TENANTS ── */}
        {tab === "tenants" && (
          <>
            <PageTitle title="Tenants" />
            <div className="flex gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="flex items-center gap-2 flex-1 max-w-sm rounded-xl px-3 py-2"
                    style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <Search size={14} strokeWidth={1.5} style={{ color: "#4A4946" }} />
                    <input
                      value={tenantSearch}
                      onChange={(e) => setTenantSearch(e.target.value)}
                      placeholder="Search tenants..."
                      className="flex-1 bg-transparent outline-none text-sm"
                      style={{ color: "#F4F2EE" }}
                    />
                  </div>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm" style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.1)", color: "#8A8882" }}>
                    <Filter size={13} strokeWidth={1.5} />
                    Filter
                    <ChevronDown size={12} />
                  </button>
                </div>
                <DataTable
                  headers={["Tenant", "Plan", "Status", "Bookings", "MRR", "Joined", ""]}
                  rows={filteredTenants.map((t) => (
                    <tr
                      key={t.id}
                      className="cursor-pointer transition-all"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                      onClick={() => setSelectedTenant(selectedTenant?.id === t.id ? null : t)}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1E1E21")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <TenantAvatar name={t.name} color={t.color} />
                          <div>
                            <div className="text-sm" style={{ color: "#F4F2EE" }}>{t.name}</div>
                            <div className="text-xs" style={{ color: "#4A4946" }}>{t.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><PlanBadge plan={t.plan} /></td>
                      <td className="px-4 py-3"><StatusDot status={t.status} /></td>
                      <td className="px-4 py-3 text-sm" style={{ color: "#F4F2EE", fontFamily: "'DM Mono', monospace" }}>{t.bookings}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: "#F4F2EE", fontFamily: "'DM Mono', monospace" }}>${t.mrr}/mo</td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace" }}>{t.joined}</td>
                      <td className="px-4 py-3"><MoreHorizontal size={14} style={{ color: "#4A4946" }} /></td>
                    </tr>
                  ))}
                />
              </div>

              {selectedTenant && (
                <div className="flex-shrink-0 rounded-xl overflow-hidden" style={{ width: 280, background: "#161618", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    <span className="text-sm" style={{ color: "#F4F2EE" }}>Tenant details</span>
                    <button onClick={() => setSelectedTenant(null)} style={{ color: "#4A4946" }}><X size={14} /></button>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-center mb-3">
                      <TenantAvatar name={selectedTenant.name} color={selectedTenant.color} size={56} />
                    </div>
                    <div className="text-center mb-4">
                      <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1rem", color: "#F4F2EE", fontWeight: 600 }}>{selectedTenant.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: "#8A8882" }}>{selectedTenant.email}</div>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <PlanBadge plan={selectedTenant.plan} />
                        <StatusDot status={selectedTenant.status} />
                      </div>
                    </div>
                    <div className="rounded-lg p-3 mb-4" style={{ background: "#1E1E21", border: "1px solid rgba(255,255,255,0.07)" }}>
                      {[
                        { label: "Bookings (total)", val: selectedTenant.bookings },
                        { label: "MRR contribution", val: `$${selectedTenant.mrr}/mo` },
                        { label: "Joined",            val: selectedTenant.joined },
                        { label: "Event types",       val: "5 created" },
                        { label: "Integrations",      val: "3 connected" },
                      ].map((s) => (
                        <div key={s.label} className="flex justify-between py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <span className="text-xs" style={{ color: "#8A8882" }}>{s.label}</span>
                          <span className="text-xs" style={{ color: "#F4F2EE", fontFamily: "'DM Mono', monospace" }}>{s.val}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-2">
                      <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm" style={{ background: "#E8593C", color: "white" }}>
                        <Eye size={13} strokeWidth={1.5} />
                        Impersonate user
                      </button>
                      <button className="w-full py-2.5 rounded-lg text-sm" style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#F4F2EE", background: "transparent" }}>
                        Upgrade plan
                      </button>
                      <button className="w-full py-2.5 rounded-lg text-sm" style={{ border: "1px solid rgba(232,89,60,0.3)", color: "#E8593C", background: "transparent" }}>
                        <UserX size={13} strokeWidth={1.5} className="inline mr-1.5" />
                        Suspend account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── SUBSCRIPTIONS ── */}
        {tab === "subscriptions" && (
          <>
            <PageTitle title="Subscriptions" />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <MetricCard label="MRR"                value="$842"  sub="Active paying tenants"         />
              <MetricCard label="Active subscribers" value="47"    sub="Across all paid plans"         />
              <MetricCard label="Churned this month" value="3"     sub="vs. 2 last month" subColor="#E8593C" />
              <MetricCard label="Trial accounts"     value="8"     sub="Converting in 14 days"         />
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-2 flex-1 min-w-[180px] max-w-xs"
                style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <Search size={14} strokeWidth={1.5} style={{ color: "#4A4946" }} />
                <input
                  value={subSearch}
                  onChange={(e) => setSubSearch(e.target.value)}
                  placeholder="Search tenant or email…"
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: "#F4F2EE" }}
                />
                {subSearch && (
                  <button onClick={() => setSubSearch("")}>
                    <X size={12} strokeWidth={1.5} style={{ color: "#4A4946" }} />
                  </button>
                )}
              </div>
              <MiniDropdown value={subPlanFilter} options={["All plans", "Free", "Pro", "Team"]} onChange={setSubPlanFilter} />
              <MiniDropdown value={subStatusFilter} options={["All statuses", "active", "trial", "churned"]} onChange={setSubStatusFilter} />
            </div>

            <DataTable
              headers={["Tenant", "Plan", "Status", "Billing cycle", "Amount", "Next renewal", ""]}
              rows={filteredSubs.map((s) => (
                <tr
                  key={s.id}
                  className="cursor-pointer transition-all"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  onClick={() => setSelectedSub(s)}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1E1E21")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <TenantAvatar name={s.name} color={s.color} />
                      <div>
                        <div className="text-sm" style={{ color: "#F4F2EE" }}>{s.name}</div>
                        <div className="text-xs" style={{ color: "#4A4946" }}>{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><PlanBadge plan={s.plan} /></td>
                  <td className="px-4 py-3"><StatusDot status={s.status} /></td>
                  <td className="px-4 py-3">
                    {s.billing !== "—" ? (
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{
                          background: s.billing === "Annual" ? "rgba(75,158,255,0.08)" : "rgba(255,255,255,0.05)",
                          color: s.billing === "Annual" ? "#4B9EFF" : "#8A8882",
                          border: `1px solid ${s.billing === "Annual" ? "rgba(75,158,255,0.2)" : "rgba(255,255,255,0.08)"}`,
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        {s.billing}
                      </span>
                    ) : (
                      <span style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>—</span>
                    )}
                  </td>
                  <td className="px-4 py-3" style={{ color: "#F4F2EE", fontFamily: "'DM Mono', monospace", fontSize: 13 }}>
                    {s.amount > 0 ? `$${s.amount}.00` : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace" }}>
                    {s.renewal}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedSub(s); }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#F4F2EE")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#4A4946")}
                    >
                      <MoreHorizontal size={14} style={{ color: "#4A4946" }} />
                    </button>
                  </td>
                </tr>
              ))}
            />

            {selectedSub && <SubDrawer sub={selectedSub} onClose={() => setSelectedSub(null)} />}
          </>
        )}

        {/* ── USAGE ── */}
        {tab === "usage" && (
          <>
            <PageTitle title="Usage" />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <MetricCard label="Total bookings all-time" value="12,847" sub="Across all tenants"       />
              <MetricCard label="Bookings this month"     value="1,204"  sub="+14% vs last month" subColor="#2ECC8A" />
              <MetricCard label="Emails sent this month"  value="3,891"  sub="98.2% delivery rate" subColor="#2ECC8A" />
              <MetricCard label="Active event types"      value="318"    sub="Across all tenants"       />
            </div>

            {/* Line chart */}
            <ChartCard title="Daily bookings — last 30 days" className="mb-6">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={DAILY_BOOKINGS_30} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid horizontal={true} vertical={false} stroke="rgba(255,255,255,0.05)" strokeDasharray="0" />
                  <XAxis dataKey="day" tick={{ fill: "#4A4946", fontSize: 10, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} interval={4} />
                  <YAxis tick={{ fill: "#4A4946", fontSize: 10, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} width={32} />
                  <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [v, "bookings"]} />
                  <Line type="monotone" dataKey="v" stroke="#E8593C" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#E8593C", strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Two side-by-side panels */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {/* Top tenants */}
              <div className="rounded-xl p-5" style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="text-xs mb-5" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", letterSpacing: "0.07em" }}>
                  TOP TENANTS BY BOOKINGS — THIS MONTH
                </div>
                <div className="flex flex-col gap-4">
                  {TOP_TENANTS_USAGE.map((t, i) => {
                    const pct = Math.round((t.bookings / TOP_TENANTS_USAGE[0].bookings) * 100);
                    return (
                      <div key={t.name}>
                        <div className="flex items-center gap-3 mb-1.5">
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#4A4946", width: 14, flexShrink: 0 }}>
                            {i + 1}
                          </span>
                          <TenantAvatar name={t.name} color={t.color} size={26} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm truncate" style={{ color: "#F4F2EE" }}>{t.name}</div>
                          </div>
                          <PlanBadge plan={t.plan} />
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#F4F2EE", flexShrink: 0 }}>
                            {t.bookings}
                          </span>
                        </div>
                        <div className="ml-9 rounded-full overflow-hidden" style={{ height: 3, background: "rgba(255,255,255,0.06)" }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: t.color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Donut chart */}
              <div className="rounded-xl p-5" style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="text-xs mb-5" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", letterSpacing: "0.07em" }}>
                  BOOKINGS BY PLAN — THIS MONTH
                </div>
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie data={PLAN_USAGE} cx="50%" cy="50%" innerRadius={48} outerRadius={72} dataKey="value" strokeWidth={0} paddingAngle={2}>
                        {PLAN_USAGE.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip {...TOOLTIP_STYLE} formatter={(v, name) => [Number(v).toLocaleString(), name]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-4">
                    {PLAN_USAGE.map((p) => {
                      const total = PLAN_USAGE.reduce((a, b) => a + b.value, 0);
                      const pct = Math.round((p.value / total) * 100);
                      return (
                        <div key={p.name}>
                          <div className="flex items-center gap-2 mb-0.5">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#8A8882" }}>{p.name}</span>
                          </div>
                          <div className="flex items-baseline gap-1.5 ml-4">
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: "#F4F2EE" }}>
                              {p.value.toLocaleString()}
                            </span>
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#4A4946" }}>{pct}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Per-tenant table */}
            <div className="text-xs mb-3" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", letterSpacing: "0.07em" }}>
              PER-TENANT BREAKDOWN — APRIL 2026
            </div>
            <DataTable
              headers={["Tenant", "Plan", "Bookings", "Event types", "Emails sent", "Storage"]}
              rows={USAGE_TABLE.map((row) => (
                <tr
                  key={row.name}
                  className="transition-all"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1E1E21")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <TenantAvatar name={row.name} color={row.color} />
                      <span className="text-sm" style={{ color: "#F4F2EE" }}>{row.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><PlanBadge plan={row.plan} /></td>
                  <td className="px-4 py-3 text-sm" style={{ color: "#F4F2EE", fontFamily: "'DM Mono', monospace" }}>{row.bookings}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "#F4F2EE", fontFamily: "'DM Mono', monospace" }}>{row.eventTypes}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "#F4F2EE", fontFamily: "'DM Mono', monospace" }}>{row.emails}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace" }}>{row.storage}</td>
                </tr>
              ))}
            />
          </>
        )}

        {/* ── EMAIL LOGS ── */}
        {tab === "emails" && (
          <>
            <PageTitle title="Email Logs" />
            <DataTable
              headers={["Recipient", "Type", "Tenant", "Sent at", "Status"]}
              rows={EMAIL_LOGS.map((log) => (
                <React.Fragment key={log.id}>
                  <tr
                    className="cursor-pointer transition-all"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    onClick={() => setExpandedEmail(expandedEmail === log.id ? null : log.id)}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1E1E21")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                  >
                    <td className="px-5 py-3 text-sm" style={{ color: "#F4F2EE", fontFamily: "'DM Mono', monospace" }}>{log.recipient}</td>
                    <td className="px-5 py-3">
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{
                          background: log.type === "Confirmation" ? "rgba(46,204,138,0.1)" : log.type === "Cancellation" ? "rgba(232,89,60,0.1)" : "rgba(75,158,255,0.1)",
                          color: log.type === "Confirmation" ? "#2ECC8A" : log.type === "Cancellation" ? "#E8593C" : "#4B9EFF",
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        {log.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm" style={{ color: "#8A8882" }}>{log.tenant}</td>
                    <td className="px-5 py-3 text-xs" style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace" }}>{log.sentAt}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        {log.status === "delivered" && <Check size={12} style={{ color: "#2ECC8A" }} />}
                        {log.status === "bounced"   && <XCircle size={12} style={{ color: "#E8593C" }} />}
                        {log.status === "pending"   && <Clock size={12} style={{ color: "#F0A429" }} />}
                        <span className="text-xs" style={{ color: log.status === "delivered" ? "#2ECC8A" : log.status === "bounced" ? "#E8593C" : "#F0A429", fontFamily: "'DM Mono', monospace" }}>
                          {log.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                  {expandedEmail === log.id && (
                    <tr style={{ background: "#1E1E21" }}>
                      <td colSpan={5} className="px-5 py-4">
                        <div className="rounded-xl p-4 text-xs" style={{ background: "#0F0F11", border: "1px solid rgba(255,255,255,0.07)", fontFamily: "'DM Mono', monospace", color: "#8A8882", lineHeight: 1.7 }}>
                          <div style={{ color: "#4A4946" }}>From: noreply@schedulr.io</div>
                          <div style={{ color: "#4A4946" }}>To: {log.recipient}</div>
                          <div style={{ color: "#4A4946" }}>Subject: Your booking {log.type.toLowerCase()}</div>
                          <div style={{ color: "#4A4946" }}>---</div>
                          <div style={{ color: "#F4F2EE" }}>
                            Hi there,<br /><br />
                            {log.type === "Confirmation" ? "Your booking has been confirmed. We look forward to speaking with you."
                              : log.type === "Cancellation" ? "Your booking has been cancelled. You can reschedule at any time."
                              : "This is a reminder about your upcoming booking in 24 hours."}
                            <br /><br />— The Schedulr team
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            />
          </>
        )}

        {/* ── SYSTEM SETTINGS ── */}
        {tab === "settings" && (
          <>
            <PageTitle title="System Settings" />
            <div className="max-w-2xl flex flex-col gap-6">
              <SettingsCard title="Maintenance Mode">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm" style={{ color: "#F4F2EE" }}>Enable maintenance mode</div>
                    <div className="text-xs mt-0.5" style={{ color: "#8A8882" }}>All booking pages will show a maintenance message</div>
                  </div>
                  <button
                    onClick={() => setMaintenance(!maintenance)}
                    className="relative flex-shrink-0"
                    style={{ width: 44, height: 24 }}
                  >
                    <div className="absolute inset-0 rounded-full transition-colors" style={{ background: maintenance ? "#E8593C" : "rgba(255,255,255,0.12)" }} />
                    <div className="absolute top-1 rounded-full transition-all" style={{ width: 16, height: 16, background: "white", left: maintenance ? 24 : 4 }} />
                  </button>
                </div>
              </SettingsCard>

              <SettingsCard title="SMTP Configuration">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "SMTP HOST", val: "smtp.mailgun.org" },
                    { label: "PORT", val: "587" },
                    { label: "USERNAME", val: "postmaster@schedulr.io" },
                    { label: "PASSWORD", val: "••••••••••••" },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="text-xs mb-1 block" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>{f.label}</label>
                      <input defaultValue={f.val} className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={{ background: "#1E1E21", border: "1px solid rgba(255,255,255,0.1)", color: "#F4F2EE", fontFamily: "'DM Mono', monospace" }} />
                    </div>
                  ))}
                </div>
              </SettingsCard>

              <SettingsCard title="Default Reminder Timing">
                <div className="flex gap-4">
                  {[{ label: "HOURS BEFORE", val: "24" }, { label: "MINUTES BEFORE", val: "60" }].map((f) => (
                    <div key={f.label}>
                      <label className="text-xs mb-1 block" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>{f.label}</label>
                      <input defaultValue={f.val} className="w-24 px-3 py-2 rounded-xl text-sm outline-none text-center" style={{ background: "#1E1E21", border: "1px solid rgba(255,255,255,0.1)", color: "#F4F2EE", fontFamily: "'DM Mono', monospace" }} />
                    </div>
                  ))}
                </div>
              </SettingsCard>

              <SettingsCard title="Webhook Endpoint">
                <div className="flex gap-2">
                  <input defaultValue="https://hooks.example.com/schedulr" className="flex-1 px-3 py-2 rounded-xl text-sm outline-none" style={{ background: "#1E1E21", border: "1px solid rgba(255,255,255,0.1)", color: "#F4F2EE", fontFamily: "'DM Mono', monospace" }} />
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ background: "#E8593C", color: "white" }}>
                    <Send size={13} strokeWidth={1.5} />
                    Test
                  </button>
                </div>
              </SettingsCard>

              <button className="self-end flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm" style={{ background: "#E8593C", color: "white" }}>
                Save settings
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
