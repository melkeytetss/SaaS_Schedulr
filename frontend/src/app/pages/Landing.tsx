import { useNavigate } from "react-router";
import { useState } from "react";
import {
  CalendarSync, Globe, Clock, Mail, CreditCard, Users, Shuffle, BarChart2,
  Palette, Shield, ArrowRight, Check, Zap,
} from "lucide-react";
import { LandingNav } from "../components/landing/LandingNav";
import { LandingFooter } from "../components/landing/LandingFooter";

const FEATURES = [
  { icon: CalendarSync, label: "Calendar sync", desc: "Two-way sync with Google, Outlook, Apple." },
  { icon: Globe, label: "Widget embed", desc: "Drop a single script tag. Done." },
  { icon: Clock, label: "Timezone detect", desc: "Auto-detects and converts times for guests." },
  { icon: Mail, label: "Reminder emails", desc: "Automated sequences before every booking." },
  { icon: Globe, label: "Custom domain", desc: "book.yourname.com — fully white-labeled." },
  { icon: CreditCard, label: "Payment collect", desc: "Collect deposits or full fees via Stripe." },
  { icon: Users, label: "Team scheduling", desc: "Shared calendars and team event types." },
  { icon: Shuffle, label: "Round-robin", desc: "Distribute bookings across team members." },
  { icon: BarChart2, label: "Analytics", desc: "Conversion, no-shows, revenue at a glance." },
  { icon: Palette, label: "White-label", desc: "Remove all Schedulr branding completely." },
  { icon: ArrowRight, label: "Cancel flows", desc: "Graceful cancellation with rebooking nudge." },
  { icon: Shield, label: "No-show protect", desc: "Charge fees for unattended appointments." },
];

const LOGOS = [
  { name: "Apex Law", abbr: "AL" },
  { name: "Clarity Studio", abbr: "CS" },
  { name: "Forge Dev", abbr: "FD" },
  { name: "Bloom Wellness", abbr: "BW" },
  { name: "Meridian", abbr: "MR" },
  { name: "Atelier", abbr: "AT" },
];

const TIMES = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];

export function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background: "#0F0F11",
        color: "#F4F2EE",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Noise texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Diagonal light gradient beam */}
      <div
        className="pointer-events-none fixed top-0 right-0 z-0"
        style={{
          width: "60vw",
          height: "60vh",
          background:
            "radial-gradient(ellipse at 80% 0%, rgba(232,89,60,0.07) 0%, rgba(232,89,60,0.02) 40%, transparent 70%)",
        }}
      />

      {/* NAV */}
      <LandingNav />

      {/* HERO */}
      <section className="relative z-10 px-6 md:px-12 pt-20 pb-16 max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-8"
              style={{
                background: "rgba(232,89,60,0.1)",
                color: "#E8593C",
                border: "1px solid rgba(232,89,60,0.2)",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8593C]" />
              Now with team scheduling
            </div>

            <h1
              className="font-display leading-none tracking-tight mb-6"
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "clamp(3rem, 6vw, 5.5rem)",
                fontWeight: 700,
                color: "#F4F2EE",
                lineHeight: 1.0,
              }}
            >
              Your bookings.
              <br />
              <span style={{ color: "#E8593C", fontStyle: "italic" }}>Your brand.</span>
              <br />
              Zero friction.
            </h1>

            <p
              className="text-base md:text-lg mb-10 max-w-md"
              style={{ color: "#8A8882", lineHeight: 1.6 }}
            >
              The scheduling platform for professionals who care how things look.
              Book more. Chase less. Look impeccable.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate("/app/dashboard")}
                className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all"
                style={{ background: "#E8593C", color: "white" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#FF6B47")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#E8593C")}
              >
                Start free
                <ArrowRight size={16} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => navigate("/demo")}
                className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm transition-all"
                style={{
                  color: "#F4F2EE",
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "transparent",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                See it live
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-10">
              {["No credit card", "Free forever plan", "Setup in 2 min"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm" style={{ color: "#4A4946" }}>
                  <Check size={14} strokeWidth={2} style={{ color: "#2ECC8A" }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Floating browser mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div
              className="relative"
              style={{
                transform: "perspective(1200px) rotateY(-8deg) rotateX(4deg)",
                transformStyle: "preserve-3d",
                filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.6))",
              }}
            >
              {/* Browser window */}
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  width: "min(520px, 90vw)",
                  background: "#161618",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                {/* Browser chrome */}
                <div
                  className="flex items-center gap-3 px-4 py-3"
                  style={{ background: "#1E1E21", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: "#FFBD2E" }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
                  </div>
                  <div
                    className="flex-1 mx-2 px-3 py-1 rounded text-xs"
                    style={{
                      background: "#0F0F11",
                      color: "#4A4946",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    schedulr.io/dashboard
                  </div>
                </div>

                {/* Dashboard preview */}
                <div className="p-4">
                  {/* Header row */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div
                        className="text-sm"
                        style={{ fontFamily: "'Fraunces', serif", color: "#F4F2EE" }}
                      >
                        Good morning, Marcus
                      </div>
                      <div
                        className="text-xs mt-0.5"
                        style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace" }}
                      >
                        4 bookings today
                      </div>
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
                    >
                      SAT 18 APR
                    </div>
                  </div>

                  {/* Stats cards mini */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { label: "Bookings", val: "12" },
                      { label: "Conversion", val: "68%" },
                      { label: "Today", val: "4" },
                      { label: "Revenue", val: "$1.8k" },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="rounded-lg p-2"
                        style={{ background: "#1E1E21", border: "1px solid rgba(255,255,255,0.07)" }}
                      >
                        <div
                          className="text-sm font-medium"
                          style={{ fontFamily: "'Fraunces', serif", color: "#F4F2EE" }}
                        >
                          {s.val}
                        </div>
                        <div
                          className="text-xs mt-0.5"
                          style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
                        >
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Booking cards mini */}
                  {[
                    { name: "Sarah K.", type: "Discovery Call", time: "09:00", status: "confirmed" },
                    { name: "James R.", type: "Strategy Session", time: "11:30", status: "pending" },
                    { name: "Priya M.", type: "Follow-up", time: "14:00", status: "confirmed" },
                  ].map((b) => (
                    <div
                      key={b.name}
                      className="flex items-center justify-between rounded-lg px-3 py-2 mb-1.5"
                      style={{ background: "#1E1E21", border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="flex items-center justify-center rounded-full text-xs"
                          style={{
                            width: 24,
                            height: 24,
                            background: "#E8593C",
                            color: "white",
                            fontFamily: "'DM Mono', monospace",
                          }}
                        >
                          {b.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <div className="text-xs" style={{ color: "#F4F2EE" }}>{b.name}</div>
                          <div
                            className="text-xs"
                            style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
                          >
                            {b.type}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs"
                          style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace" }}
                        >
                          {b.time}
                        </span>
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            background: b.status === "confirmed" ? "#2ECC8A" : "#F0A429",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reflection hint */}
              <div
                className="absolute -bottom-px left-0 right-0 h-8 rounded-b-xl"
                style={{
                  background: "linear-gradient(to bottom, rgba(22,22,24,0.3), transparent)",
                  transform: "scaleY(-1) translateY(100%)",
                  opacity: 0.2,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section
        className="relative z-10 px-6 md:px-12 py-10"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="max-w-[1400px] mx-auto">
          <p
            className="text-sm text-center mb-8"
            style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
          >
            Trusted by 2,400+ coaches, consultants, and creators
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {LOGOS.map((logo) => (
              <div key={logo.name} className="flex items-center gap-2">
                <div
                  className="flex items-center justify-center rounded text-xs"
                  style={{
                    width: 32,
                    height: 32,
                    background: "#1E1E21",
                    color: "#8A8882",
                    fontFamily: "'DM Mono', monospace",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  {logo.abbr}
                </div>
                <span className="text-sm" style={{ color: "#4A4946" }}>{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section id="features" className="relative z-10 px-6 md:px-12 py-24 max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <p
            className="text-sm mb-3"
            style={{ color: "#E8593C", fontFamily: "'DM Mono', monospace" }}
          >
            EVERYTHING YOU NEED
          </p>
          <h2
            className="font-display"
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: "#F4F2EE",
              fontWeight: 600,
            }}
          >
            Built for how you actually work.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="p-5 rounded-xl transition-all cursor-default group"
              style={{
                background: "#161618",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.14)";
                (e.currentTarget as HTMLElement).style.background = "#1E1E21";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLElement).style.background = "#161618";
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex items-center justify-center rounded-lg flex-shrink-0 mt-0.5"
                  style={{
                    width: 32,
                    height: 32,
                    background: "rgba(232,89,60,0.1)",
                  }}
                >
                  <Icon size={16} strokeWidth={1.5} style={{ color: "#E8593C" }} />
                </div>
                <div>
                  <div
                    className="text-sm mb-1"
                    style={{ color: "#F4F2EE", fontFamily: "'DM Mono', monospace" }}
                  >
                    {label}
                  </div>
                  <div className="text-sm" style={{ color: "#8A8882", lineHeight: 1.5 }}>
                    {desc}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOOKING WIDGET PREVIEW */}
      <section
        className="relative z-10 px-6 md:px-12 py-24"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <div>
            <p
              className="text-sm mb-4"
              style={{ color: "#E8593C", fontFamily: "'DM Mono', monospace" }}
            >
              DROP-IN WIDGET
            </p>
            <h2
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
                color: "#F4F2EE",
                fontWeight: 600,
                lineHeight: 1.15,
                marginBottom: "1.5rem",
              }}
            >
              Drop it anywhere.
              <br />
              A single line of code.
            </h2>
            <p className="text-base mb-8" style={{ color: "#8A8882", lineHeight: 1.7 }}>
              Embed your full booking experience on any website, landing page, or web app. 
              Fully styled to match your brand. Zero configuration.
            </p>
            <div
              className="rounded-lg px-4 py-3 text-sm flex items-center gap-3 mb-8"
              style={{
                background: "#161618",
                border: "1px solid rgba(255,255,255,0.1)",
                fontFamily: "'DM Mono', monospace",
                color: "#8A8882",
              }}
            >
              <span style={{ color: "#E8593C" }}>&lt;script</span>
              <span>src="schedulr.io/embed.js"</span>
              <span style={{ color: "#E8593C" }}>/&gt;</span>
            </div>
            <button
              onClick={() => navigate("/app/dashboard")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm transition-all"
              style={{ background: "#E8593C", color: "white" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#FF6B47")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#E8593C")}
            >
              Get your embed code
              <ArrowRight size={14} strokeWidth={1.5} />
            </button>
          </div>

          {/* Right: widget preview */}
          <div className="flex justify-center lg:justify-end">
            <div
              className="rounded-xl overflow-hidden"
              style={{
                width: "min(400px, 90vw)",
                background: "#161618",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
              }}
            >
              {/* Browser chrome */}
              <div
                className="flex items-center gap-2 px-4 py-2.5"
                style={{
                  background: "#1E1E21",
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F57" }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FFBD2E" }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28C840" }} />
                </div>
                <div
                  className="text-xs"
                  style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
                >
                  schedulr.io/marcus
                </div>
              </div>

              {/* Booking widget content */}
              <div className="p-5">
                <div
                  className="text-sm mb-1"
                  style={{ fontFamily: "'Fraunces', serif", color: "#F4F2EE" }}
                >
                  30-min Discovery Call
                </div>
                <div
                  className="text-xs mb-5"
                  style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace" }}
                >
                  30 min · Google Meet
                </div>

                {/* Mini calendar */}
                <div className="mb-4">
                  <div
                    className="flex items-center justify-between mb-3 text-xs"
                    style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace" }}
                  >
                    <span>April 2026</span>
                    <div className="flex gap-2">
                      <button style={{ color: "#4A4946" }}>←</button>
                      <button style={{ color: "#4A4946" }}>→</button>
                    </div>
                  </div>
                  <div
                    className="grid grid-cols-7 gap-0.5 text-center"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                      <div key={i} className="text-xs py-1" style={{ color: "#4A4946" }}>
                        {d}
                      </div>
                    ))}
                    {[null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map((d, i) => (
                      <div
                        key={i}
                        className="text-xs py-1 rounded transition-all cursor-pointer"
                        style={{
                          color: d === 21 ? "white" : d && d % 3 !== 0 ? "#F4F2EE" : "#4A4946",
                          background: d === 21 ? "#E8593C" : "transparent",
                          cursor: !d || d % 3 === 0 ? "default" : "pointer",
                        }}
                      >
                        {d || ""}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time slots */}
                <div className="grid grid-cols-2 gap-1.5">
                  {TIMES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className="py-1.5 rounded text-xs transition-all"
                      style={{
                        background: selectedTime === t ? "#E8593C" : "transparent",
                        color: selectedTime === t ? "white" : "#F4F2EE",
                        border: `1px solid ${selectedTime === t ? "#E8593C" : "rgba(255,255,255,0.14)"}`,
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING TEASER */}
      <section
        className="relative z-10 px-6 md:px-12 py-24"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="max-w-[1400px] mx-auto text-center">
          <h2
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: "#F4F2EE",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            Simple pricing. No surprises.
          </h2>
          <p className="text-base mb-10" style={{ color: "#8A8882" }}>
            Start free. Scale when you're ready.
          </p>

          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
            {[
              { name: "Free", price: "$0", highlight: false },
              { name: "Pro", price: "$12/mo", highlight: true },
              { name: "Team", price: "$49/mo", highlight: false },
            ].map((plan) => (
              <div
                key={plan.name}
                className="rounded-xl p-5 text-left"
                style={{
                  background: plan.highlight ? "rgba(232,89,60,0.08)" : "#161618",
                  border: plan.highlight
                    ? "1px solid rgba(232,89,60,0.3)"
                    : "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm" style={{ color: "#F4F2EE" }}>{plan.name}</span>
                  {plan.highlight && (
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        background: "rgba(232,89,60,0.2)",
                        color: "#E8593C",
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      POPULAR
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: "1.75rem",
                    color: "#F4F2EE",
                    fontWeight: 700,
                    marginBottom: "1rem",
                  }}
                >
                  {plan.price}
                </div>
                <button
                  onClick={() => navigate("/pricing")}
                  className="w-full py-2 rounded-lg text-sm transition-all"
                  style={
                    plan.highlight
                      ? { background: "#E8593C", color: "white" }
                      : {
                          border: "1px solid rgba(255,255,255,0.14)",
                          color: "#F4F2EE",
                          background: "transparent",
                        }
                  }
                >
                  See pricing →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <LandingFooter />
    </div>
  );
}