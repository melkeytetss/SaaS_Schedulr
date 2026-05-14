import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Globe } from "lucide-react";
import { LandingNav } from "../components/landing/LandingNav";
import { LandingFooter } from "../components/landing/LandingFooter";

const AVAILABLE = new Set([1, 2, 4, 5, 7, 8, 9, 11, 14, 15, 16, 18, 19, 21, 22, 24, 25, 28, 29, 30]);
const SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30"];

export function LiveDemo() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // April 2026 starts on Wednesday (offset = 2 with Mon start)
  const daysInMonth = 30;
  const offset = 2;
  const totalCells = Math.ceil((daysInMonth + offset) / 7) * 7;

  return (
    <div
      className="min-h-screen"
      style={{ background: "#0F0F11", color: "#F4F2EE", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 60% 20%, rgba(232,89,60,0.06) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(75,158,255,0.04) 0%, transparent 50%)",
        }}
      />

      <LandingNav />

      <section className="relative z-10 px-6 md:px-12 py-16 md:py-24 max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.8fr] gap-12 items-center">

          {/* ── Left copy ── */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-6"
              style={{
                background: "rgba(232,89,60,0.1)",
                color: "#E8593C",
                border: "1px solid rgba(232,89,60,0.2)",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#E8593C" }} />
              INTERACTIVE DEMO
            </div>

            <h1
              className="mb-5"
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "clamp(2.4rem, 4vw, 3.5rem)",
                fontWeight: 700,
                color: "#F4F2EE",
                lineHeight: 1.05,
              }}
            >
              See it in
              <br />
              <span style={{ color: "#E8593C", fontStyle: "italic" }}>action.</span>
            </h1>

            <p
              className="mb-3 text-base"
              style={{ color: "#8A8882", lineHeight: 1.7, maxWidth: 380 }}
            >
              This is exactly what your clients will see. Click a date to explore the full
              booking flow — just like a real appointment.
            </p>
            <p
              className="mb-8 text-sm"
              style={{ color: "#4A4946", lineHeight: 1.6, maxWidth: 360, fontFamily: "'DM Mono', monospace" }}
            >
              Marcus K. · 30-min Discovery Call · April 2026
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/signup")}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all w-fit"
                style={{ background: "#E8593C", color: "white" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#FF6B47")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#E8593C")}
              >
                Start booking for real
                <ArrowRight size={15} strokeWidth={1.5} />
              </button>
              <p
                className="text-xs"
                style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
              >
                Free · No credit card needed
              </p>
            </div>

            {/* Stats */}
            <div
              className="mt-10 pt-8 flex gap-8 flex-wrap"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
            >
              {[
                { val: "2,400+", label: "Active users" },
                { val: "180k",   label: "Bookings/mo"  },
                { val: "4.9★",   label: "Avg. rating"  },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    style={{ fontFamily: "'Fraunces', serif", fontSize: "1.4rem", color: "#F4F2EE", fontWeight: 700 }}
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
          </div>

          {/* ── Right: browser frame ── */}
          <div className="flex justify-center lg:justify-end">
            <div
              className="w-full rounded-2xl overflow-hidden"
              style={{
                maxWidth: 720,
                background: "#161618",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
              }}
            >
              {/* Browser chrome */}
              <div
                className="flex items-center gap-3 px-5 py-3.5"
                style={{ background: "#1E1E21", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#FFBD2E" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
                </div>
                <div className="flex items-center gap-2 flex-1 mx-2">
                  <div
                    className="flex items-center gap-1.5 flex-1 px-3 py-1.5 rounded-lg text-xs"
                    style={{ background: "#0F0F11", color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
                  >
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ flexShrink: 0 }}>
                      <rect x="0.5" y="0.5" width="10" height="10" rx="2" stroke="#4A4946" />
                      <path d="M3 5.5h5M5.5 3v5" stroke="#4A4946" strokeWidth="0.8" />
                    </svg>
                    schedulr.io/demo/discovery-call
                  </div>
                </div>
                <Globe size={13} strokeWidth={1.5} style={{ color: "#4A4946" }} />
              </div>

              {/* Booking page content */}
              <div
                className="p-6 grid md:grid-cols-[200px_1fr] gap-5"
                style={{ background: "#0F0F11" }}
              >
                {/* Left: host info */}
                <div
                  className="rounded-xl p-4 h-fit"
                  style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div
                    className="flex items-center justify-center rounded-xl text-lg mb-3"
                    style={{ width: 44, height: 44, background: "rgba(232,89,60,0.15)", color: "#E8593C", fontFamily: "'DM Mono', monospace" }}
                  >
                    MK
                  </div>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: "0.95rem", color: "#F4F2EE", fontWeight: 600, marginBottom: 2 }}>
                    Marcus Kim
                  </div>
                  <div style={{ fontSize: 11, color: "#8A8882", fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>
                    Design & Strategy
                  </div>
                  <div
                    className="text-xs font-medium mb-1"
                    style={{ fontFamily: "'Fraunces', serif", color: "#F4F2EE", fontSize: "0.85rem" }}
                  >
                    30-min Discovery Call
                  </div>
                  <div className="flex flex-col gap-1.5 mt-3">
                    {[
                      { icon: "⏱", text: "30 minutes" },
                      { icon: "📹", text: "Google Meet" },
                      { icon: "💰", text: "Free" },
                    ].map((d) => (
                      <div key={d.text} className="flex items-center gap-2">
                        <span style={{ fontSize: 11 }}>{d.icon}</span>
                        <span style={{ fontSize: 11, color: "#8A8882", fontFamily: "'DM Mono', monospace" }}>{d.text}</span>
                      </div>
                    ))}
                  </div>
                  {selectedDate && selectedTime && (
                    <div
                      className="mt-4 p-2.5 rounded-lg"
                      style={{ background: "rgba(232,89,60,0.1)", border: "1px solid rgba(232,89,60,0.2)" }}
                    >
                      <div style={{ fontSize: 10, color: "#E8593C", fontFamily: "'DM Mono', monospace" }}>SELECTED</div>
                      <div style={{ fontSize: 11, color: "#F4F2EE", fontFamily: "'DM Mono', monospace", marginTop: 2 }}>
                        Apr {selectedDate}, {selectedTime}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: calendar + slots */}
                <div>
                  {/* Calendar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span style={{ fontFamily: "'Fraunces', serif", fontSize: "0.95rem", color: "#F4F2EE" }}>
                        April 2026
                      </span>
                      <div className="flex gap-2">
                        <button className="px-2 py-1 rounded text-xs" style={{ color: "#4A4946", background: "#1E1E21" }}>←</button>
                        <button className="px-2 py-1 rounded text-xs" style={{ color: "#4A4946", background: "#1E1E21" }}>→</button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-0.5 text-center">
                      {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                        <div key={i} className="text-xs py-1.5" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
                          {d}
                        </div>
                      ))}
                      {Array.from({ length: totalCells }).map((_, i) => {
                        const day = i - offset + 1;
                        const isValid = day >= 1 && day <= daysInMonth;
                        const isAvail = isValid && AVAILABLE.has(day);
                        const isSelected = day === selectedDate;
                        return (
                          <button
                            key={i}
                            disabled={!isAvail}
                            onClick={() => { if (isAvail) { setSelectedDate(day); setSelectedTime(null); } }}
                            className="text-xs py-1.5 rounded-lg transition-all"
                            style={{
                              background: isSelected ? "#E8593C" : "transparent",
                              color: isSelected ? "white" : isAvail ? "#F4F2EE" : "#2A2A2C",
                              cursor: isAvail ? "pointer" : "default",
                            }}
                            onMouseEnter={(e) => {
                              if (isAvail && !isSelected)
                                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected)
                                (e.currentTarget as HTMLElement).style.background = "transparent";
                            }}
                          >
                            {isValid ? day : ""}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Timezone label */}
                  <div
                    className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg"
                    style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <Globe size={12} strokeWidth={1.5} style={{ color: "#4A4946" }} />
                    <span style={{ fontSize: 11, color: "#8A8882", fontFamily: "'DM Mono', monospace" }}>
                      Showing times in: Europe/London (UTC+1)
                    </span>
                  </div>

                  {/* Time slots */}
                  {selectedDate ? (
                    <>
                      <div className="text-xs mb-3" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
                        AVAILABLE SLOTS · APR {selectedDate}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {SLOTS.map((t) => (
                          <button
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            className="py-2 rounded-lg text-xs transition-all"
                            style={{
                              background: selectedTime === t ? "#E8593C" : "#161618",
                              color: selectedTime === t ? "white" : "#F4F2EE",
                              border: `1px solid ${selectedTime === t ? "#E8593C" : "rgba(255,255,255,0.1)"}`,
                              fontFamily: "'DM Mono', monospace",
                            }}
                            onMouseEnter={(e) => {
                              if (selectedTime !== t) (e.currentTarget as HTMLElement).style.borderColor = "rgba(232,89,60,0.4)";
                            }}
                            onMouseLeave={(e) => {
                              if (selectedTime !== t) (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                            }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>

                      {selectedTime && (
                        <button
                          onClick={() => navigate("/book")}
                          className="w-full mt-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                          style={{ background: "#E8593C", color: "white" }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#FF6B47")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#E8593C")}
                        >
                          Confirm {selectedTime} →
                        </button>
                      )}
                    </>
                  ) : (
                    <div
                      className="flex items-center justify-center rounded-xl py-6"
                      style={{ background: "#161618", border: "1px dashed rgba(255,255,255,0.08)" }}
                    >
                      <p className="text-sm" style={{ color: "#4A4946" }}>
                        ← Select a date to see available times
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
