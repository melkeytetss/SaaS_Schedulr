import { useState, useRef, useEffect } from "react";
import {
  Search, ChevronDown, RotateCcw, X, Mail, FileText,
  Calendar, Clock, User, Bell, ChevronRight, Filter,
  CalendarRange, ArrowUpDown
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Status = "confirmed" | "pending" | "cancelled" | "no-show";

interface Booking {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  email: string;
  eventType: string;
  eventColor: string;
  date: string;         // display
  dateISO: string;      // for sorting
  time: string;
  duration: string;
  status: Status;
  notes: string;
  location: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const ALL_BOOKINGS: Booking[] = [
  {
    id: "b001", name: "Sarah Kowalski", initials: "SK", avatarColor: "#E8593C",
    email: "sarah.k@gmail.com", eventType: "Discovery Call", eventColor: "#E8593C",
    date: "Sun 19 Apr 2026", dateISO: "2026-04-19", time: "09:00", duration: "30 min",
    status: "confirmed", notes: "Interested in the Pro plan. Came via Twitter.", location: "Google Meet",
  },
  {
    id: "b002", name: "James Rourke", initials: "JR", avatarColor: "#4B9EFF",
    email: "j.rourke@acme.co", eventType: "Strategy Session", eventColor: "#4B9EFF",
    date: "Sun 19 Apr 2026", dateISO: "2026-04-19", time: "11:30", duration: "60 min",
    status: "pending", notes: "Needs onboarding walkthrough for his team of 8.", location: "Zoom",
  },
  {
    id: "b003", name: "Priya Mehta", initials: "PM", avatarColor: "#2ECC8A",
    email: "priya.m@designco.io", eventType: "Follow-up Call", eventColor: "#2ECC8A",
    date: "Sun 19 Apr 2026", dateISO: "2026-04-19", time: "14:00", duration: "30 min",
    status: "confirmed", notes: "Second check-in after last month's discovery.", location: "Google Meet",
  },
  {
    id: "b004", name: "Tom Li", initials: "TL", avatarColor: "#F0A429",
    email: "tom.li@startup.xyz", eventType: "Intro Call", eventColor: "#F0A429",
    date: "Sun 19 Apr 2026", dateISO: "2026-04-19", time: "15:30", duration: "30 min",
    status: "confirmed", notes: "", location: "Phone",
  },
  {
    id: "b005", name: "Amara Osei", initials: "AO", avatarColor: "#B07EFF",
    email: "amara@osei.dev", eventType: "Discovery Call", eventColor: "#E8593C",
    date: "Mon 20 Apr 2026", dateISO: "2026-04-20", time: "10:00", duration: "30 min",
    status: "pending", notes: "Referred by Priya. Freelance designer.", location: "Google Meet",
  },
  {
    id: "b006", name: "Daniel Ferreira", initials: "DF", avatarColor: "#FF7BAC",
    email: "daniel.f@techwave.com", eventType: "Strategy Session", eventColor: "#4B9EFF",
    date: "Mon 20 Apr 2026", dateISO: "2026-04-20", time: "13:00", duration: "60 min",
    status: "cancelled", notes: "Cancelled due to travel conflict. Asked to rebook.", location: "Zoom",
  },
  {
    id: "b007", name: "Lin Chen", initials: "LC", avatarColor: "#2ECC8A",
    email: "lin.chen@vc.fund", eventType: "Intro Call", eventColor: "#F0A429",
    date: "Tue 21 Apr 2026", dateISO: "2026-04-21", time: "08:30", duration: "30 min",
    status: "confirmed", notes: "Potential investor. Keep brief and focused.", location: "Zoom",
  },
  {
    id: "b008", name: "Marcus Webb", initials: "MW", avatarColor: "#E8593C",
    email: "m.webb@webstudio.co", eventType: "Discovery Call", eventColor: "#E8593C",
    date: "Tue 21 Apr 2026", dateISO: "2026-04-21", time: "11:00", duration: "30 min",
    status: "no-show", notes: "Did not show up. Send follow-up email.", location: "Google Meet",
  },
  {
    id: "b009", name: "Elena Russo", initials: "ER", avatarColor: "#4B9EFF",
    email: "elena@russo.design", eventType: "Follow-up Call", eventColor: "#2ECC8A",
    date: "Wed 22 Apr 2026", dateISO: "2026-04-22", time: "09:30", duration: "30 min",
    status: "confirmed", notes: "Follow-up on proposal sent last week.", location: "Phone",
  },
  {
    id: "b010", name: "Kwame Asante", initials: "KA", avatarColor: "#F0A429",
    email: "kwame.a@buildfast.io", eventType: "Strategy Session", eventColor: "#4B9EFF",
    date: "Wed 22 Apr 2026", dateISO: "2026-04-22", time: "14:30", duration: "60 min",
    status: "pending", notes: "Enterprise client. BCC compliance@buildfast.io", location: "Zoom",
  },
  {
    id: "b011", name: "Sofia Andersson", initials: "SA", avatarColor: "#FF7BAC",
    email: "sofia.a@nordic.se", eventType: "Intro Call", eventColor: "#F0A429",
    date: "Thu 23 Apr 2026", dateISO: "2026-04-23", time: "10:00", duration: "30 min",
    status: "confirmed", notes: "", location: "Google Meet",
  },
  {
    id: "b012", name: "Ravi Patel", initials: "RP", avatarColor: "#B07EFF",
    email: "ravi.p@payvault.com", eventType: "Discovery Call", eventColor: "#E8593C",
    date: "Thu 23 Apr 2026", dateISO: "2026-04-23", time: "16:00", duration: "30 min",
    status: "cancelled", notes: "Cancelled 2h before. Asked to reschedule next week.", location: "Zoom",
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string }> = {
  confirmed: { label: "Confirmed", color: "#2ECC8A", bg: "rgba(46,204,138,0.12)" },
  pending:   { label: "Pending",   color: "#F0A429", bg: "rgba(240,164,41,0.12)" },
  cancelled: { label: "Cancelled", color: "#E8593C", bg: "rgba(232,89,60,0.12)"  },
  "no-show": { label: "No-show",   color: "#8A8882", bg: "rgba(138,136,130,0.12)" },
};

const EVENT_TYPES = ["All types", "Discovery Call", "Strategy Session", "Follow-up Call", "Intro Call"];
const STATUS_FILTERS = ["All statuses", "confirmed", "pending", "cancelled", "no-show"];

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatusDot({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: cfg.color, boxShadow: status === "confirmed" ? `0 0 6px ${cfg.color}88` : "none" }}
      />
      <span style={{ color: cfg.color, fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
        {cfg.label}
      </span>
    </span>
  );
}

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      className="flex items-center justify-center rounded-full flex-shrink-0"
      style={{
        width: 34, height: 34,
        background: color + "22",
        color,
        border: `1px solid ${color}44`,
        fontFamily: "'DM Mono', monospace",
        fontSize: 12,
      }}
    >
      {initials}
    </div>
  );
}

function EventTypePill({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="px-2 py-0.5 rounded text-xs whitespace-nowrap"
      style={{
        background: color + "18",
        color,
        border: `1px solid ${color}33`,
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {label}
    </span>
  );
}

// ─── Detail Drawer ────────────────────────────────────────────────────────────
function BookingDrawer({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const cfg = STATUS_CONFIG[booking.status];
  const [reminderSent, setReminderSent] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onClose]);

  // Keyboard close
  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [onClose]);

  const handleReminder = () => {
    setReminderSent(true);
    setTimeout(() => setReminderSent(false), 3000);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(15,15,17,0.6)", backdropFilter: "blur(4px)" }}
      />
      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col overflow-y-auto"
        style={{
          width: 400,
          background: "#161618",
          borderLeft: "1px solid rgba(255,255,255,0.09)",
          boxShadow: "-24px 0 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div
            style={{ fontFamily: "'Fraunces', serif", fontSize: "1.2rem", fontWeight: 600, color: "#F4F2EE" }}
          >
            Booking detail
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg transition-colors"
            style={{ width: 32, height: 32, background: "rgba(255,255,255,0.06)", color: "#8A8882" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)")}
          >
            <X size={14} strokeWidth={1.5} />
          </button>
        </div>

        {/* Guest card */}
        <div className="px-6 pt-6 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-4 mb-4">
            <div
              className="flex items-center justify-center rounded-full flex-shrink-0"
              style={{
                width: 52, height: 52,
                background: booking.avatarColor + "22",
                color: booking.avatarColor,
                border: `1.5px solid ${booking.avatarColor}55`,
                fontFamily: "'DM Mono', monospace",
                fontSize: 15,
              }}
            >
              {booking.initials}
            </div>
            <div>
              <div style={{ color: "#F4F2EE", fontSize: 15, fontWeight: 500 }}>{booking.name}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Mail size={11} strokeWidth={1.5} style={{ color: "#4A4946" }} />
                <span style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace", fontSize: 11 }}>
                  {booking.email}
                </span>
              </div>
            </div>
          </div>
          {/* Status pill */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
            style={{ background: cfg.bg, border: `1px solid ${cfg.color}33` }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
            <span style={{ color: cfg.color, fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
              {cfg.label}
            </span>
          </div>
        </div>

        {/* Details grid */}
        <div className="px-6 py-5 flex flex-col gap-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <DetailRow icon={<Calendar size={14} strokeWidth={1.5} />} label="Date">
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#F4F2EE" }}>
              {booking.date}
            </span>
          </DetailRow>
          <DetailRow icon={<Clock size={14} strokeWidth={1.5} />} label="Time">
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#F4F2EE" }}>
              {booking.time} · {booking.duration}
            </span>
          </DetailRow>
          <DetailRow icon={<CalendarRange size={14} strokeWidth={1.5} />} label="Event type">
            <EventTypePill label={booking.eventType} color={booking.eventColor} />
          </DetailRow>
          <DetailRow icon={<User size={14} strokeWidth={1.5} />} label="Location">
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#F4F2EE" }}>
              {booking.location}
            </span>
          </DetailRow>
        </div>

        {/* Notes */}
        <div className="px-6 py-5 flex-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-2 mb-3">
            <FileText size={13} strokeWidth={1.5} style={{ color: "#4A4946" }} />
            <span style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace", fontSize: 11 }}>NOTES</span>
          </div>
          {booking.notes ? (
            <p style={{ color: "#8A8882", fontSize: 13, lineHeight: 1.65 }}>{booking.notes}</p>
          ) : (
            <p style={{ color: "#4A4946", fontSize: 13, fontStyle: "italic" }}>No notes added.</p>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-5 flex flex-col gap-2">
          {/* Send reminder */}
          <button
            onClick={handleReminder}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all text-sm"
            style={{
              background: reminderSent ? "rgba(46,204,138,0.12)" : "#E8593C",
              color: reminderSent ? "#2ECC8A" : "white",
              border: reminderSent ? "1px solid rgba(46,204,138,0.3)" : "none",
            }}
            onMouseEnter={(e) => {
              if (!reminderSent) (e.currentTarget as HTMLElement).style.background = "#FF6B47";
            }}
            onMouseLeave={(e) => {
              if (!reminderSent) (e.currentTarget as HTMLElement).style.background = "#E8593C";
            }}
          >
            <Bell size={14} strokeWidth={1.5} />
            {reminderSent ? "Reminder sent!" : "Send reminder"}
          </button>

          {/* Ghost buttons row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#8A8882", background: "transparent" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = "#F4F2EE"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#8A8882"; }}
            >
              <RotateCcw size={13} strokeWidth={1.5} />
              Reschedule
            </button>
            <button
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all"
              style={{ border: "1px solid rgba(232,89,60,0.25)", color: "#E8593C", background: "transparent" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(232,89,60,0.06)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <X size={13} strokeWidth={1.5} />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function DetailRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 flex-shrink-0" style={{ color: "#4A4946", minWidth: 100 }}>
        {icon}
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#8A8882" }}>
          {label.toUpperCase()}
        </span>
      </div>
      <div className="text-right">{children}</div>
    </div>
  );
}

// ─── Custom dropdown ──────────────────────────────────────────────────────────
function Dropdown({
  value, options, onChange, placeholder,
}: {
  value: string; options: string[]; onChange: (v: string) => void; placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#F4F2EE",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ color: value.startsWith("All") ? "#8A8882" : "#F4F2EE" }}>
          {placeholder && value.startsWith("All") ? placeholder : value}
        </span>
        <ChevronDown size={13} strokeWidth={1.5} style={{ color: "#4A4946" }} />
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-1 z-30 rounded-xl overflow-hidden py-1"
          style={{
            background: "#1E1E21",
            border: "1px solid rgba(255,255,255,0.1)",
            minWidth: "100%",
            boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm transition-colors"
              style={{
                color: opt === value ? "#F4F2EE" : "#8A8882",
                background: opt === value ? "rgba(232,89,60,0.08)" : "transparent",
                fontFamily: opt.startsWith("All") ? undefined : "'DM Mono', monospace",
                fontSize: opt.startsWith("All") ? 13 : 12,
              }}
              onMouseEnter={(e) => { if (opt !== value) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={(e) => { if (opt !== value) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              {opt.startsWith("All") ? opt : (
                <span className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ background: STATUS_CONFIG[opt as Status]?.color ?? "#8A8882" }}
                  />
                  {STATUS_CONFIG[opt as Status]?.label ?? opt}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function Bookings() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [sortField, setSortField] = useState<"date" | "name" | "status" | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field: "date" | "name" | "status") => {
    if (sortField === field) setSortAsc((a) => !a);
    else { setSortField(field); setSortAsc(true); }
  };

  const filtered = ALL_BOOKINGS
    .filter((b) => {
      const q = search.toLowerCase();
      if (q && !b.name.toLowerCase().includes(q) && !b.email.toLowerCase().includes(q)) return false;
      if (statusFilter !== "All statuses" && b.status !== statusFilter) return false;
      if (typeFilter !== "All types" && b.eventType !== typeFilter) return false;
      if (dateFrom && b.dateISO < dateFrom) return false;
      if (dateTo && b.dateISO > dateTo) return false;
      return true;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      let cmp = 0;
      if (sortField === "date") cmp = `${a.dateISO}${a.time}`.localeCompare(`${b.dateISO}${b.time}`);
      if (sortField === "name") cmp = a.name.localeCompare(b.name);
      if (sortField === "status") cmp = a.status.localeCompare(b.status);
      return sortAsc ? cmp : -cmp;
    });

  const SortBtn = ({ field, children }: { field: "date" | "name" | "status"; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 transition-colors"
      style={{ color: sortField === field ? "#E8593C" : "#4A4946" }}
    >
      {children}
      <ArrowUpDown size={11} strokeWidth={1.5} style={{ opacity: sortField === field ? 1 : 0.5 }} />
    </button>
  );

  return (
    <div className="min-h-[calc(100vh-48px)] flex flex-col" style={{ background: "#0F0F11" }}>
      {/* Page header */}
      <div className="px-6 md:px-8 pt-8 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.75rem", fontWeight: 600, color: "#F4F2EE", lineHeight: 1.2 }}>
              Bookings
            </h1>
            <p className="text-sm mt-1" style={{ color: "#8A8882" }}>
              <span style={{ color: "#F4F2EE" }}>{filtered.length}</span> booking{filtered.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#4A4946", paddingBottom: 2 }}>
            SUN 19 APR 2026
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 min-w-[180px] max-w-xs"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <Search size={14} strokeWidth={1.5} style={{ color: "#4A4946", flexShrink: 0 }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guest name or email…"
              className="bg-transparent outline-none flex-1 text-sm"
              style={{ color: "#F4F2EE", caretColor: "#E8593C" }}
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X size={12} strokeWidth={1.5} style={{ color: "#4A4946" }} />
              </button>
            )}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <Filter size={13} strokeWidth={1.5} style={{ color: "#4A4946" }} />
            <Dropdown value={statusFilter} options={STATUS_FILTERS} onChange={setStatusFilter} placeholder="Status" />
          </div>

          {/* Event type filter */}
          <Dropdown value={typeFilter} options={EVENT_TYPES} onChange={setTypeFilter} placeholder="Event type" />

          {/* Date range */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <CalendarRange size={13} strokeWidth={1.5} style={{ color: "#4A4946", flexShrink: 0 }} />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-transparent outline-none text-sm"
              style={{ color: dateFrom ? "#F4F2EE" : "#4A4946", fontFamily: "'DM Mono', monospace", width: 110 }}
            />
            <span style={{ color: "#4A4946" }}>–</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-transparent outline-none text-sm"
              style={{ color: dateTo ? "#F4F2EE" : "#4A4946", fontFamily: "'DM Mono', monospace", width: 110 }}
            />
            {(dateFrom || dateTo) && (
              <button onClick={() => { setDateFrom(""); setDateTo(""); }}>
                <X size={12} strokeWidth={1.5} style={{ color: "#4A4946" }} />
              </button>
            )}
          </div>

          {/* Clear all */}
          {(search || statusFilter !== "All statuses" || typeFilter !== "All types" || dateFrom || dateTo) && (
            <button
              className="text-sm transition-colors px-2 py-1 rounded"
              style={{ color: "#E8593C" }}
              onClick={() => { setSearch(""); setStatusFilter("All statuses"); setTypeFilter("All types"); setDateFrom(""); setDateTo(""); }}
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: 820 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {[
                { key: "guest", label: "GUEST", sortKey: "name" as const, w: "22%" },
                { key: "type",  label: "EVENT TYPE", sortKey: null, w: "18%" },
                { key: "date",  label: "DATE & TIME", sortKey: "date" as const, w: "18%" },
                { key: "dur",   label: "DURATION", sortKey: null, w: "10%" },
                { key: "stat",  label: "STATUS", sortKey: "status" as const, w: "14%" },
                { key: "act",   label: "ACTIONS", sortKey: null, w: "18%" },
              ].map((col) => (
                <th
                  key={col.key}
                  className="text-left px-5 py-3"
                  style={{ width: col.w, color: "#4A4946", fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 500 }}
                >
                  {col.sortKey ? (
                    <SortBtn field={col.sortKey}>{col.label}</SortBtn>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center" style={{ color: "#4A4946" }}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", color: "#4A4946", marginBottom: 8 }}>
                    No bookings found
                  </div>
                  <div className="text-sm" style={{ color: "#4A4946" }}>Try adjusting your filters</div>
                </td>
              </tr>
            ) : (
              filtered.map((booking) => {
                const isHovered = hoveredRow === booking.id;
                const isSelected = selectedBooking?.id === booking.id;
                return (
                  <tr
                    key={booking.id}
                    onClick={() => setSelectedBooking(booking)}
                    onMouseEnter={() => setHoveredRow(booking.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className="cursor-pointer transition-all relative group"
                    style={{
                      background: isSelected
                        ? "rgba(232,89,60,0.06)"
                        : isHovered
                        ? "rgba(255,255,255,0.025)"
                        : "transparent",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    {/* Guest */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar initials={booking.initials} color={booking.avatarColor} />
                        <div>
                          <div style={{ color: "#F4F2EE", fontSize: 13 }}>{booking.name}</div>
                          <div style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", fontSize: 11 }}>
                            {booking.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Event type */}
                    <td className="px-5 py-3.5">
                      <EventTypePill label={booking.eventType} color={booking.eventColor} />
                    </td>

                    {/* Date & time */}
                    <td className="px-5 py-3.5">
                      <div style={{ color: "#F4F2EE", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
                        {booking.time}
                      </div>
                      <div style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace", fontSize: 11, marginTop: 2 }}>
                        {booking.date}
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="px-5 py-3.5">
                      <span style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
                        {booking.duration}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <StatusDot status={booking.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div
                        className="flex items-center gap-2 transition-all"
                        style={{ opacity: isHovered || isSelected ? 1 : 0 }}
                      >
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs transition-all"
                          style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#8A8882", background: "transparent" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#F4F2EE"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#8A8882"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; }}
                        >
                          <RotateCcw size={11} strokeWidth={1.5} />
                          Reschedule
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs transition-all"
                          style={{ border: "1px solid rgba(232,89,60,0.2)", color: "#E8593C", background: "transparent" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(232,89,60,0.08)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                        >
                          <X size={11} strokeWidth={1.5} />
                          Cancel
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedBooking(booking); }}
                          className="flex items-center justify-center rounded transition-all"
                          style={{ width: 26, height: 26, background: "rgba(255,255,255,0.04)", color: "#8A8882" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = "#F4F2EE"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = "#8A8882"; }}
                        >
                          <ChevronRight size={13} strokeWidth={1.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination stub */}
      {filtered.length > 0 && (
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <span style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", fontSize: 11 }}>
            SHOWING {filtered.length} OF {ALL_BOOKINGS.length} BOOKINGS
          </span>
          <div className="flex items-center gap-1">
            {["1", "2", "3"].map((p, i) => (
              <button
                key={p}
                className="flex items-center justify-center rounded text-xs transition-all"
                style={{
                  width: 28, height: 28,
                  fontFamily: "'DM Mono', monospace",
                  background: i === 0 ? "#E8593C" : "rgba(255,255,255,0.04)",
                  color: i === 0 ? "white" : "#8A8882",
                  border: i === 0 ? "none" : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Drawer */}
      {selectedBooking && (
        <BookingDrawer booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
      )}
    </div>
  );
}
