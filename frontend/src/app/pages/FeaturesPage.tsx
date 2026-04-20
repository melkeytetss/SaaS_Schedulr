import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowRight, Globe, CreditCard, Check,
  ChevronRight, Zap, RefreshCw, Lock,
} from "lucide-react";
import { LandingNav } from "../components/landing/LandingNav";
import { LandingFooter } from "../components/landing/LandingFooter";

// ─── Section layout helpers ───────────────────────────────────────────────────
function FeatureSection({
  accent,
  headline,
  body,
  bullets,
  cta,
  onCta,
  mockup,
  flip = false,
  dark = false,
}: {
  accent: string;
  headline: React.ReactNode;
  body: string;
  bullets?: string[];
  cta?: string;
  onCta?: () => void;
  mockup: React.ReactNode;
  flip?: boolean;
  dark?: boolean;
}) {
  return (
    <section
      className="px-6 md:px-12 py-20 md:py-28"
      style={{ background: dark ? "#161618" : "#0F0F11" }}
    >
      <div
        className={`max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-14 items-center ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}
      >
        {/* Text */}
        <div>
          <div
            className="text-xs mb-4"
            style={{ color: "#E8593C", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em" }}
          >
            {accent}
          </div>
          <h2
            className="mb-5"
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
              fontWeight: 600,
              color: "#F4F2EE",
              lineHeight: 1.15,
            }}
          >
            {headline}
          </h2>
          <p className="text-base mb-6" style={{ color: "#8A8882", lineHeight: 1.7, maxWidth: 440 }}>
            {body}
          </p>
          {bullets && (
            <ul className="flex flex-col gap-2 mb-7">
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-sm" style={{ color: "#8A8882" }}>
                  <Check size={14} strokeWidth={2} style={{ color: "#2ECC8A", flexShrink: 0 }} />
                  {b}
                </li>
              ))}
            </ul>
          )}
          {cta && (
            <button
              onClick={onCta}
              className="flex items-center gap-2 text-sm transition-colors"
              style={{ color: "#E8593C" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#FF6B47")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#E8593C")}
            >
              {cta}
              <ArrowRight size={14} strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* Mockup */}
        <div className={`flex ${flip ? "lg:justify-start" : "lg:justify-end"}`}>
          {mockup}
        </div>
      </div>
    </section>
  );
}

// ─── Mockup 1: Calendar Sync ──────────────────────────────────────────────────
function CalendarSyncMockup() {
  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        maxWidth: 560,
        background: "#1E1E21",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-3.5"
        style={{ background: "#161618", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F57" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FFBD2E" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28C840" }} />
        </div>
        <div className="flex gap-4 text-xs" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
          <span style={{ color: "#F4F2EE" }}>Google Calendar</span>
          <span>→</span>
          <span style={{ color: "#2ECC8A" }}>Schedulr</span>
        </div>
      </div>

      <div className="p-5 grid grid-cols-2 gap-4">
        {/* Google Calendar panel */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div
              className="flex items-center justify-center rounded text-xs"
              style={{ width: 20, height: 20, background: "#4285F4", color: "white", fontFamily: "'DM Mono', monospace" }}
            >
              G
            </div>
            <span className="text-xs" style={{ color: "#8A8882" }}>Google Calendar</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {[
              { time: "09:00–10:00", label: "Team standup", color: "#4285F4" },
              { time: "11:00–12:00", label: "Client review", color: "#34A853" },
              { time: "14:00–15:00", label: "Dentist appt.", color: "#EA4335" },
              { time: "16:00–17:00", label: "Design sync",   color: "#FBBC04" },
            ].map((ev) => (
              <div
                key={ev.label}
                className="rounded-lg px-2.5 py-2"
                style={{ background: ev.color + "18", borderLeft: `3px solid ${ev.color}` }}
              >
                <div className="text-xs" style={{ color: "#F4F2EE" }}>{ev.label}</div>
                <div className="text-xs mt-0.5" style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace" }}>
                  {ev.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sync arrow + Schedulr */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div
              className="flex items-center justify-center rounded text-xs"
              style={{ width: 20, height: 20, background: "#E8593C", color: "white" }}
            >
              <Zap size={11} strokeWidth={1.5} />
            </div>
            <span className="text-xs" style={{ color: "#8A8882" }}>Schedulr availability</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {[
              { time: "09:00",  avail: false },
              { time: "10:00",  avail: true  },
              { time: "11:00",  avail: false },
              { time: "12:00",  avail: true  },
              { time: "13:00",  avail: true  },
              { time: "14:00",  avail: false },
              { time: "15:00",  avail: true  },
              { time: "16:00",  avail: false },
            ].map((s) => (
              <div
                key={s.time}
                className="flex items-center justify-between rounded-lg px-2.5 py-1.5"
                style={{ background: s.avail ? "rgba(46,204,138,0.08)" : "rgba(255,255,255,0.03)", borderLeft: `2px solid ${s.avail ? "#2ECC8A" : "#2A2A2C"}` }}
              >
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: s.avail ? "#F4F2EE" : "#4A4946" }}>
                  {s.time}
                </span>
                <span style={{ fontSize: 10, color: s.avail ? "#2ECC8A" : "#4A4946", fontFamily: "'DM Mono', monospace" }}>
                  {s.avail ? "open" : "busy"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sync status bar */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#2ECC8A" }} />
          <span style={{ fontSize: 11, color: "#2ECC8A", fontFamily: "'DM Mono', monospace" }}>
            Synced 2 min ago
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <RefreshCw size={11} strokeWidth={1.5} style={{ color: "#4A4946" }} />
          <span style={{ fontSize: 10, color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
            Auto-syncing every 5 min
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Mockup 2: Embeddable Widget ──────────────────────────────────────────────
function EmbedWidgetMockup() {
  return (
    <div className="w-full" style={{ maxWidth: 560 }}>
      {/* Code block */}
      <div
        className="rounded-xl p-4 mb-4"
        style={{ background: "#0F0F11", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full" style={{ background: "#FF5F57" }} />
          <div className="w-2 h-2 rounded-full" style={{ background: "#FFBD2E" }} />
          <div className="w-2 h-2 rounded-full" style={{ background: "#28C840" }} />
          <span className="text-xs ml-1" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>embed.html</span>
        </div>
        <pre className="text-xs overflow-auto" style={{ fontFamily: "'DM Mono', monospace", lineHeight: 1.7 }}>
          <span style={{ color: "#4A4946" }}>{`<!-- Add to your </body> -->`}</span>{"\n"}
          <span style={{ color: "#E8593C" }}>{`<script`}</span>
          <span style={{ color: "#4B9EFF" }}>{` src`}</span>
          <span style={{ color: "#F4F2EE" }}>{`="`}</span>
          <span style={{ color: "#2ECC8A" }}>{`https://schedulr.io/embed.js`}</span>
          <span style={{ color: "#F4F2EE" }}>{`"`}</span>
          <span style={{ color: "#E8593C" }}>{`>`}</span>
          <span style={{ color: "#E8593C" }}>{`</script>`}</span>{"\n"}
          <span style={{ color: "#E8593C" }}>{`<div`}</span>
          <span style={{ color: "#4B9EFF" }}>{` data-schedulr`}</span>
          <span style={{ color: "#F4F2EE" }}>{`="`}</span>
          <span style={{ color: "#2ECC8A" }}>{`marcus/discovery`}</span>
          <span style={{ color: "#F4F2EE" }}>{`"`}</span>
          <span style={{ color: "#E8593C" }}>{`></div>`}</span>
        </pre>
      </div>

      {/* Fake website with widget */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "#1E1E21", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 50px rgba(0,0,0,0.4)" }}
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: "#161618", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F57" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FFBD2E" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28C840" }} />
          </div>
          <span style={{ fontSize: 10, color: "#4A4946", fontFamily: "'DM Mono', monospace", marginLeft: 8 }}>
            yoursite.com/contact
          </span>
        </div>
        {/* Fake page content */}
        <div className="p-5">
          <div className="mb-4">
            <div className="h-4 rounded mb-2" style={{ width: "60%", background: "rgba(255,255,255,0.06)" }} />
            <div className="h-3 rounded mb-1.5" style={{ width: "90%", background: "rgba(255,255,255,0.04)" }} />
            <div className="h-3 rounded" style={{ width: "75%", background: "rgba(255,255,255,0.04)" }} />
          </div>
          {/* Embedded widget */}
          <div
            className="rounded-xl p-4"
            style={{ background: "#0F0F11", border: "1px solid rgba(232,89,60,0.2)", borderRadius: 12 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#E8593C" }} />
              <span style={{ fontSize: 10, color: "#E8593C", fontFamily: "'DM Mono', monospace" }}>SCHEDULR WIDGET</span>
            </div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: "0.85rem", color: "#F4F2EE", marginBottom: 2 }}>
              30-min Discovery Call
            </div>
            <div style={{ fontSize: 10, color: "#8A8882", fontFamily: "'DM Mono', monospace", marginBottom: 10 }}>
              Marcus K. · 30 min · Free
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-center mb-2">
              {["M","T","W","T","F","S","S"].map((d, i) => (
                <div key={i} style={{ fontSize: 9, color: "#4A4946", fontFamily: "'DM Mono', monospace", paddingBottom: 2 }}>{d}</div>
              ))}
              {[null,null,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21].map((d, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 9,
                    color: d === 21 ? "white" : d && d % 3 !== 0 ? "#F4F2EE" : "#4A4946",
                    background: d === 21 ? "#E8593C" : "transparent",
                    borderRadius: 3,
                    padding: "2px 0",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {d || ""}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mockup 3: Timezone Detection ─────────────────────────────────────────────
function TimezoneMockup() {
  const [tz, setTz] = useState("Europe/London (UTC+1)");
  const TZ_OPTIONS = [
    "Europe/London (UTC+1)",
    "Asia/Manila (UTC+8)",
    "America/New_York (UTC-4)",
    "America/Los_Angeles (UTC-7)",
  ];
  const TIMES_TZ: Record<string, string[]> = {
    "Europe/London (UTC+1)": ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00"],
    "Asia/Manila (UTC+8)":   ["16:00", "16:30", "17:00", "17:30", "18:00", "21:00"],
    "America/New_York (UTC-4)": ["04:00", "04:30", "05:00", "05:30", "06:00", "09:00"],
    "America/Los_Angeles (UTC-7)": ["01:00", "01:30", "02:00", "02:30", "03:00", "06:00"],
  };

  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{ maxWidth: 420, background: "#161618", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}
    >
      {/* Host info */}
      <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1rem", color: "#F4F2EE", fontWeight: 600 }}>
          30-min Discovery Call
        </div>
        <div style={{ fontSize: 11, color: "#8A8882", fontFamily: "'DM Mono', monospace", marginTop: 2 }}>
          Marcus K. · Tue, Apr 21
        </div>
      </div>

      <div className="p-5">
        {/* Timezone detection banner */}
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-5"
          style={{ background: "rgba(75,158,255,0.08)", border: "1px solid rgba(75,158,255,0.18)" }}
        >
          <Globe size={14} strokeWidth={1.5} style={{ color: "#4B9EFF", flexShrink: 0 }} />
          <div className="flex-1 min-w-0">
            <div style={{ fontSize: 10, color: "#4B9EFF", fontFamily: "'DM Mono', monospace' " }}>
              TIMEZONE DETECTED
            </div>
            <div style={{ fontSize: 12, color: "#F4F2EE", fontFamily: "'DM Mono', monospace", marginTop: 1 }}>
              {tz}
            </div>
          </div>
        </div>

        {/* TZ selector */}
        <div className="mb-5">
          <div className="text-xs mb-1.5" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
            CHANGE TIMEZONE
          </div>
          <div className="flex flex-col gap-1.5">
            {TZ_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => setTz(t)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all"
                style={{
                  background: tz === t ? "rgba(232,89,60,0.1)" : "transparent",
                  border: `1px solid ${tz === t ? "rgba(232,89,60,0.3)" : "rgba(255,255,255,0.06)"}`,
                }}
              >
                <div
                  className="w-3 h-3 rounded-full border-2 flex-shrink-0"
                  style={{ borderColor: tz === t ? "#E8593C" : "#4A4946", background: tz === t ? "#E8593C" : "transparent" }}
                />
                <span style={{ fontSize: 11, color: tz === t ? "#F4F2EE" : "#8A8882", fontFamily: "'DM Mono', monospace" }}>
                  {t}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Slots in selected TZ */}
        <div className="text-xs mb-2" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
          AVAILABLE TIMES
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {(TIMES_TZ[tz] || []).map((t) => (
            <div
              key={t}
              className="py-1.5 rounded-lg text-center text-xs"
              style={{ background: "#1E1E21", color: "#F4F2EE", fontFamily: "'DM Mono', monospace", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Mockup 4: Reminder Emails ────────────────────────────────────────────────
function ReminderEmailMockup() {
  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{ maxWidth: 500, background: "#1E1E21", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}
    >
      {/* Mail client chrome */}
      <div
        className="flex items-center gap-3 px-5 py-3"
        style={{ background: "#161618", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F57" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FFBD2E" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28C840" }} />
        </div>
        <span style={{ fontSize: 11, color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
          Inbox — sarah@example.com
        </span>
      </div>

      {/* Email header row */}
      <div className="px-5 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center rounded-full text-xs"
              style={{ width: 28, height: 28, background: "rgba(232,89,60,0.15)", color: "#E8593C", fontFamily: "'DM Mono', monospace" }}
            >
              S
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#F4F2EE" }}>Schedulr Reminders</div>
              <div style={{ fontSize: 10, color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
                noreply@schedulr.io
              </div>
            </div>
          </div>
          <span style={{ fontSize: 10, color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>2 min ago</span>
        </div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: "0.9rem", color: "#F4F2EE" }}>
          Reminder: Discovery Call tomorrow at 10:00am
        </div>
      </div>

      {/* Email body */}
      <div className="p-5" style={{ background: "#F8F7F4" }}>
        {/* Email header */}
        <div
          className="rounded-t-xl overflow-hidden mb-0"
          style={{ borderRadius: "8px 8px 0 0" }}
        >
          <div
            className="h-1.5 w-full"
            style={{ background: "#E8593C" }}
          />
        </div>
        <div
          className="rounded-b-xl p-5 mb-3"
          style={{
            background: "white",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            borderRadius: "0 0 8px 8px",
          }}
        >
          <div
            className="flex items-center gap-2 mb-4"
            style={{ borderBottom: "1px solid #F0EEE9", paddingBottom: 12 }}
          >
            <div
              className="flex items-center justify-center rounded"
              style={{ width: 24, height: 24, background: "#E8593C" }}
            >
              <Zap size={12} color="white" strokeWidth={1.5} />
            </div>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: "0.85rem", color: "#1A1A1C" }}>
              Schedulr
            </span>
          </div>
          <p style={{ fontSize: 13, color: "#4A4946", lineHeight: 1.6, marginBottom: 12 }}>
            Hi Sarah,
          </p>
          <p style={{ fontSize: 13, color: "#333", lineHeight: 1.6, marginBottom: 16 }}>
            Just a friendly reminder — you have a{" "}
            <strong style={{ color: "#1A1A1C" }}>30-min Discovery Call</strong> coming up{" "}
            <strong style={{ color: "#1A1A1C" }}>tomorrow at 10:00am</strong>.
          </p>
          {/* Event card */}
          <div
            className="rounded-xl p-4 mb-4"
            style={{ background: "#F8F7F4", border: "1px solid #E8E5E0" }}
          >
            <div style={{ fontSize: 12, color: "#8A8882", fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>
              YOUR BOOKING
            </div>
            <div style={{ fontSize: 14, color: "#1A1A1C", fontFamily: "'Fraunces', serif", marginBottom: 6 }}>
              30-min Discovery Call · Marcus K.
            </div>
            <div style={{ fontSize: 11, color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
              Wed, Apr 22 · 10:00am – 10:30am BST
            </div>
            <div style={{ fontSize: 11, color: "#4A4946", fontFamily: "'DM Mono', monospace", marginTop: 2 }}>
              Google Meet · meet.google.com/xyz-abc
            </div>
          </div>
          <a
            href="#"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              background: "#E8593C",
              color: "white",
              borderRadius: 8,
              fontSize: 12,
              fontFamily: "'DM Mono', monospace",
              textDecoration: "none",
            }}
          >
            View booking details →
          </a>
        </div>
        <p style={{ fontSize: 10, color: "#8A8882", textAlign: "center", fontFamily: "'DM Mono', monospace" }}>
          © 2026 Schedulr · Sent on behalf of Marcus K.
        </p>
      </div>
    </div>
  );
}

// ─── Mockup 5: Payment Collection ─────────────────────────────────────────────
function PaymentMockup() {
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const formatCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExp = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? `${d.slice(0,2)}/${d.slice(2)}` : d;
  };

  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{ maxWidth: 420, background: "#161618", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}
    >
      {/* Summary */}
      <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1rem", color: "#F4F2EE", fontWeight: 600, marginBottom: 10 }}>
          Complete payment
        </div>
        <div className="rounded-xl overflow-hidden" style={{ background: "#1E1E21", border: "1px solid rgba(255,255,255,0.06)" }}>
          {[
            { l: "SESSION", v: "30-min Strategy Call" },
            { l: "AMOUNT",  v: "$75.00" },
            { l: "TOTAL DUE", v: "$75.00", coral: true },
          ].map((r) => (
            <div key={r.l} className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#4A4946" }}>{r.l}</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: r.coral ? "#E8593C" : "#F4F2EE" }}>{r.v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-5">
        {/* Card number */}
        <div className="mb-3">
          <label className="text-xs block mb-1.5" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
            CARD NUMBER
          </label>
          <div className="relative">
            <input
              value={card}
              onChange={(e) => setCard(formatCard(e.target.value))}
              placeholder="4242 4242 4242 4242"
              className="w-full px-3 py-2.5 pr-10 rounded-xl text-sm outline-none"
              style={{ background: "#1E1E21", border: "1px solid rgba(255,255,255,0.1)", color: "#F4F2EE", fontFamily: "'DM Mono', monospace" }}
              onFocus={(e) => (e.currentTarget.style.border = "1px solid rgba(232,89,60,0.5)")}
              onBlur={(e) => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)")}
            />
            <CreditCard size={14} strokeWidth={1.5} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#4A4946" }} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <label className="text-xs block mb-1.5" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>EXPIRY</label>
            <input
              value={expiry}
              onChange={(e) => setExpiry(formatExp(e.target.value))}
              placeholder="MM/YY"
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: "#1E1E21", border: "1px solid rgba(255,255,255,0.1)", color: "#F4F2EE", fontFamily: "'DM Mono', monospace" }}
              onFocus={(e) => (e.currentTarget.style.border = "1px solid rgba(232,89,60,0.5)")}
              onBlur={(e) => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)")}
            />
          </div>
          <div>
            <label className="text-xs block mb-1.5" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>CVC</label>
            <input
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="•••"
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: "#1E1E21", border: "1px solid rgba(255,255,255,0.1)", color: "#F4F2EE", fontFamily: "'DM Mono', monospace" }}
              onFocus={(e) => (e.currentTarget.style.border = "1px solid rgba(232,89,60,0.5)")}
              onBlur={(e) => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)")}
            />
          </div>
        </div>
        <button
          className="w-full py-3 rounded-xl text-sm font-medium mb-3"
          style={{ background: "#E8593C", color: "white" }}
        >
          Pay $75.00
        </button>
        <div className="flex items-center justify-center gap-1.5">
          <Lock size={11} strokeWidth={1.5} style={{ color: "#4A4946" }} />
          <span style={{ fontSize: 10, color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
            Secured by Stripe
          </span>
        </div>
      </div>
    </div>
  );
}

// Fix the template literal issue in PaymentMockup
const r_val_fix = (v: string) => v;

// ─── Mockup 6: Team Scheduling
function TeamSchedulingMockup() {
  const HOSTS = [
    { name: "Marcus K.",  initials: "MK", color: "#E8593C",  bookings: 14, next: true  },
    { name: "Sarah L.",   initials: "SL", color: "#4B9EFF",  bookings: 11, next: false },
    { name: "Priya M.",   initials: "PM", color: "#2ECC8A",  bookings: 9,  next: false },
  ];

  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{ maxWidth: 480, background: "#161618", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}
    >
      {/* Header */}
      <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: "0.95rem", color: "#F4F2EE", fontWeight: 600, marginBottom: 2 }}>
          Team Discovery Call
        </div>
        <div style={{ fontSize: 11, color: "#8A8882", fontFamily: "'DM Mono', monospace" }}>
          Round-robin · 30 min · 3 hosts
        </div>
      </div>

      <div className="p-5">
        {/* Round-robin diagram */}
        <div
          className="relative flex items-center justify-center mb-5 py-4"
          style={{ background: "#1E1E21", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-0">
            {HOSTS.map((h, i) => (
              <div key={h.name} className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="flex items-center justify-center rounded-full text-xs relative"
                    style={{
                      width: 48, height: 48,
                      background: h.color + "22",
                      color: h.color,
                      fontFamily: "'DM Mono', monospace",
                      border: h.next ? `2px solid ${h.color}` : "2px solid transparent",
                      boxShadow: h.next ? `0 0 16px ${h.color}44` : "none",
                    }}
                  >
                    {h.initials}
                    {h.next && (
                      <div
                        className="absolute -top-1 -right-1 flex items-center justify-center rounded-full text-white"
                        style={{ width: 14, height: 14, background: "#E8593C", fontSize: 8, fontFamily: "'DM Mono', monospace" }}
                      >
                        →
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 10, color: h.next ? "#F4F2EE" : "#8A8882" }}>{h.name}</span>
                  <span style={{ fontSize: 9, color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
                    {h.bookings} this mo.
                  </span>
                </div>
                {i < HOSTS.length - 1 && (
                  <div className="mx-3 flex flex-col items-center gap-0.5">
                    <div className="h-px w-8" style={{ background: "rgba(255,255,255,0.08)" }} />
                    <ChevronRight size={12} strokeWidth={1.5} style={{ color: "#4A4946" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Next up banner */}
        <div
          className="flex items-center gap-3 p-3.5 rounded-xl mb-4"
          style={{ background: "rgba(232,89,60,0.08)", border: "1px solid rgba(232,89,60,0.2)" }}
        >
          <div
            className="flex items-center justify-center rounded-full text-xs flex-shrink-0"
            style={{ width: 32, height: 32, background: "rgba(232,89,60,0.2)", color: "#E8593C", fontFamily: "'DM Mono', monospace" }}
          >
            MK
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#E8593C", fontFamily: "'DM Mono', monospace" }}>NEXT ASSIGNMENT</div>
            <div style={{ fontSize: 13, color: "#F4F2EE" }}>Marcus K. — next booking in queue</div>
          </div>
        </div>

        {/* Host load */}
        <div className="text-xs mb-3" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
          BOOKING LOAD THIS MONTH
        </div>
        {HOSTS.map((h) => (
          <div key={h.name} className="flex items-center gap-3 mb-2.5">
            <div
              className="flex items-center justify-center rounded text-xs flex-shrink-0"
              style={{ width: 24, height: 24, background: h.color + "22", color: h.color, fontFamily: "'DM Mono', monospace" }}
            >
              {h.initials[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span style={{ fontSize: 11, color: "#F4F2EE" }}>{h.name}</span>
                <span style={{ fontSize: 10, color: "#8A8882", fontFamily: "'DM Mono', monospace" }}>{h.bookings}</span>
              </div>
              <div className="rounded-full overflow-hidden" style={{ height: 3, background: "rgba(255,255,255,0.06)" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(h.bookings / 14) * 100}%`, background: h.color }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main FeaturesPage ────────────────────────────────────────────────────────
export function FeaturesPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen"
      style={{ background: "#0F0F11", color: "#F4F2EE", fontFamily: "'DM Sans', sans-serif" }}
    >
      <LandingNav />

      {/* Page hero */}
      <section
        className="px-6 md:px-12 py-20 md:py-28 text-center"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-6"
          style={{
            background: "rgba(232,89,60,0.1)",
            color: "#E8593C",
            border: "1px solid rgba(232,89,60,0.2)",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          FEATURES
        </div>
        <h1
          className="mx-auto mb-5"
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(2.4rem, 5vw, 4rem)",
            fontWeight: 700,
            color: "#F4F2EE",
            lineHeight: 1.1,
            maxWidth: 700,
          }}
        >
          Everything you need to run your bookings.
        </h1>
        <p
          className="text-lg mx-auto mb-8"
          style={{ color: "#8A8882", maxWidth: 560, lineHeight: 1.6 }}
        >
          Purpose-built for solo professionals and growing teams. Every feature is polished to the pixel.
        </p>
        <button
          onClick={() => navigate("/signup")}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all"
          style={{ background: "#E8593C", color: "white" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#FF6B47")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#E8593C")}
        >
          Start for free
          <ArrowRight size={15} strokeWidth={1.5} />
        </button>
      </section>

      {/* ── Feature sections ── */}

      {/* 1. Calendar Sync — text left, mockup right */}
      <FeatureSection
        accent="CALENDAR SYNC"
        headline={<>Two-way sync.<br />Always up to date.</>}
        body="Connect Google Calendar, Outlook, or Apple iCal and Schedulr will automatically block off busy times and surface only your real availability. No double-bookings. Ever."
        bullets={["Syncs every 5 minutes automatically", "Supports multiple calendars per account", "Write bookings back to your personal calendar"]}
        cta="Connect your calendar"
        onCta={() => navigate("/signup")}
        mockup={<CalendarSyncMockup />}
        dark={false}
      />

      {/* 2. Embeddable Widget — mockup left, text right */}
      <FeatureSection
        accent="EMBEDDABLE WIDGET"
        headline={<>One script tag.<br />Booking on any page.</>}
        body="Drop a single line of code onto any website and your full booking experience appears inline — no redirects, no popups, no friction. Fully styled to match your brand."
        bullets={["Works on Webflow, Framer, Notion, any HTML", "Zero-config — just point and drop", "Custom colors, fonts, and sizing"]}
        cta="Get your embed code"
        onCta={() => navigate("/signup")}
        mockup={<EmbedWidgetMockup />}
        flip={true}
        dark={true}
      />

      {/* 3. Timezone Detection — text left, mockup right */}
      <FeatureSection
        accent="TIMEZONE AUTO-DETECTION"
        headline={<>Global clients,<br />zero confusion.</>}
        body="Schedulr detects your client's timezone automatically and shows all available times in their local time. They book in their timezone, you see it in yours. Everyone's happy."
        bullets={["Detects timezone from browser automatically", "Manual override for any timezone worldwide", "Daylight saving adjustments handled transparently"]}
        cta="Try the demo"
        onCta={() => navigate("/demo")}
        mockup={<TimezoneMockup />}
        dark={false}
      />

      {/* 4. Reminder Emails — mockup left, text right */}
      <FeatureSection
        accent="REMINDER EMAILS"
        headline={<>Automated reminders.<br />Fewer no-shows.</>}
        body="Send beautifully designed reminder emails before every booking. Configure the timing, customize the copy, and let Schedulr handle the rest. Clients arrive prepared."
        bullets={["24-hour and 1-hour reminders by default", "Fully customizable subject + body copy", "Includes rescheduling link automatically"]}
        cta="See email templates"
        onCta={() => navigate("/signup")}
        mockup={<ReminderEmailMockup />}
        flip={true}
        dark={true}
      />

      {/* 5. Payment Collection — text left, mockup right */}
      <FeatureSection
        accent="PAYMENT COLLECTION"
        headline={<>Collect deposits.<br />Or the full fee.</>}
        body="Require payment before a booking is confirmed. Set fixed amounts or percentages, connect your Stripe account, and get paid instantly. No more chasing invoices."
        bullets={["Powered by Stripe — instant payouts", "Fixed amount, percentage, or full fee", "Automatic refunds on cancellation (optional)"]}
        cta="Set up payments"
        onCta={() => navigate("/signup")}
        mockup={<PaymentMockup />}
        dark={false}
      />

      {/* 6. Team Scheduling — mockup left, text right */}
      <FeatureSection
        accent="TEAM SCHEDULING"
        headline={<>Round-robin.<br />Everyone shares the load.</>}
        body="Distribute incoming bookings evenly across your team. Set up round-robin rotation, define custom routing rules, and show clients a single booking link for the whole team."
        bullets={["Round-robin and pooled availability modes", "Custom assignment rules by skill or tag", "Each team member keeps their own calendar connection"]}
        cta="Explore team features"
        onCta={() => navigate("/signup")}
        mockup={<TeamSchedulingMockup />}
        flip={true}
        dark={true}
      />

      {/* CTA banner */}
      <section className="px-6 md:px-12 py-20" style={{ background: "#0F0F11" }}>
        <div
          className="max-w-[1400px] mx-auto rounded-2xl px-10 py-14 text-center"
          style={{
            background: "#161618",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 0 60px rgba(232,89,60,0.04)",
          }}
        >
          <div className="text-xs mb-4" style={{ color: "#E8593C", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em" }}>
            GET STARTED TODAY
          </div>
          <h2
            className="mb-4"
            style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, color: "#F4F2EE" }}
          >
            Ready to look incredible?
          </h2>
          <p className="text-base mb-8" style={{ color: "#8A8882", maxWidth: 420, margin: "0 auto 2rem" }}>
            Join 2,400+ professionals who book more, chase less, and look impeccable.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate("/signup")}
              className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-medium transition-all"
              style={{ background: "#E8593C", color: "white" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#FF6B47")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#E8593C")}
            >
              Start free
              <ArrowRight size={14} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => navigate("/demo")}
              className="px-7 py-3 rounded-xl text-sm transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.14)", color: "#F4F2EE", background: "transparent" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              See live demo
            </button>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}