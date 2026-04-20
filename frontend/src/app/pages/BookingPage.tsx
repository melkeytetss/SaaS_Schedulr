import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ChevronLeft, ChevronRight, Video, Check, Calendar,
  Clock, Zap, ArrowLeft, Lock, CreditCard
} from "lucide-react";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const AVAILABLE_DATES = new Set([1,2,4,5,7,8,9,11,14,15,16,18,19,21,22,24,25,28,29,30]);

const SLOTS = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","14:00","14:30","15:00","15:30","16:00","16:30",
];

type Step = "calendar" | "form" | "payment" | "confirmed";

export function BookingPage() {
  const navigate = useNavigate();
  const [month, setMonth] = useState(3); // April = 3
  const [year] = useState(2026);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("calendar");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [goal, setGoal] = useState("");

  // Payment state
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [paying, setPaying] = useState(false);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1; // Monday start

  const handleConfirm = () => {
    if (name && email) setStep("payment");
  };

  const handlePay = () => {
    if (!cardNumber || !expiry || !cvc) return;
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setStep("confirmed");
    }, 1400);
  };

  // Format card number with spaces
  const formatCard = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  // Format expiry MM/YY
  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-8"
      style={{ background: "#0F0F11" }}
    >
      {/* Back to landing */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-6 left-6 flex items-center gap-2 text-sm z-10"
        style={{ color: "#8A8882" }}
      >
        <Zap size={14} strokeWidth={1.5} style={{ color: "#E8593C" }} />
        <span style={{ fontFamily: "'DM Mono', monospace" }}>schedulr.io</span>
      </button>

      <div className="w-full max-w-3xl">
        {step !== "confirmed" ? (
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "#161618",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
            }}
          >
            <div className="grid md:grid-cols-2">
              {/* Left panel - host info */}
              <div
                className="p-6 md:p-8"
                style={{
                  borderRight: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {/* Avatar */}
                <div
                  className="flex items-center justify-center rounded-full text-white text-lg mb-4"
                  style={{
                    width: 56,
                    height: 56,
                    background: "#E8593C",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  MK
                </div>

                <div className="text-sm mb-1" style={{ color: "#8A8882" }}>Marcus K.</div>
                <h1
                  className="mb-3"
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: "1.4rem",
                    fontWeight: 600,
                    color: "#F4F2EE",
                    lineHeight: 1.2,
                  }}
                >
                  30-min Discovery Call
                </h1>

                <div className="flex flex-wrap gap-2 mb-5">
                  <span
                    className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: "#1E1E21",
                      color: "#8A8882",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    <Clock size={11} strokeWidth={1.5} />
                    30 min
                  </span>
                  <span
                    className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: "#1E1E21",
                      color: "#8A8882",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    <Video size={11} strokeWidth={1.5} />
                    Google Meet
                  </span>
                </div>

                <p className="text-sm" style={{ color: "#8A8882", lineHeight: 1.7 }}>
                  Let's get to know each other. We'll cover your goals, your challenges, and
                  whether we're a good fit to work together. No pressure, just a real conversation.
                </p>

                {selectedDate && selectedTime && (step === "form" || step === "payment") && (
                  <div
                    className="mt-6 p-3 rounded-lg"
                    style={{
                      background: "rgba(232,89,60,0.08)",
                      border: "1px solid rgba(232,89,60,0.2)",
                    }}
                  >
                    <div className="text-xs mb-1" style={{ color: "#E8593C", fontFamily: "'DM Mono', monospace" }}>
                      SELECTED TIME
                    </div>
                    <div className="text-sm" style={{ color: "#F4F2EE" }}>
                      {MONTHS[month]} {selectedDate}, {year}
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace" }}
                    >
                      {selectedTime} · 30 min
                    </div>
                  </div>
                )}

                {/* Timezone */}
                <div
                  className="mt-6 text-xs"
                  style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
                >
                  Showing times in: Asia/Manila (UTC+8) ▾
                </div>
              </div>

              {/* Right panel */}
              <div className="p-6 md:p-8">
                {step === "calendar" && (
                  <>
                    {/* Month nav */}
                    <div
                      className="flex items-center justify-between mb-5"
                    >
                      <span
                        style={{
                          fontFamily: "'Fraunces', serif",
                          fontSize: "1rem",
                          color: "#F4F2EE",
                          fontWeight: 600,
                        }}
                      >
                        {MONTHS[month]} {year}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setMonth(m => Math.max(0, m - 1))}
                          className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                          style={{ color: "#8A8882", background: "#1E1E21" }}
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <button
                          onClick={() => setMonth(m => Math.min(11, m + 1))}
                          className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                          style={{ color: "#8A8882", background: "#1E1E21" }}
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 mb-2">
                      {["Mo","Tu","We","Th","Fr","Sa","Su"].map(d => (
                        <div
                          key={d}
                          className="text-xs text-center py-1"
                          style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
                        >
                          {d}
                        </div>
                      ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1 mb-6">
                      {Array.from({ length: offset }).map((_, i) => (
                        <div key={`e${i}`} />
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const avail = AVAILABLE_DATES.has(day);
                        const sel = selectedDate === day;
                        return (
                          <button
                            key={day}
                            disabled={!avail}
                            onClick={() => avail && setSelectedDate(day)}
                            className="w-full aspect-square rounded-lg text-sm flex items-center justify-center transition-all"
                            style={{
                              background: sel ? "#E8593C" : avail ? "transparent" : "transparent",
                              color: sel ? "white" : avail ? "#F4F2EE" : "#4A4946",
                              cursor: avail ? "pointer" : "default",
                              border: sel ? "none" : avail ? "1px solid transparent" : "none",
                              fontFamily: "'DM Mono', monospace",
                            }}
                            onMouseEnter={(e) => {
                              if (avail && !sel) {
                                (e.currentTarget as HTMLElement).style.background = "rgba(232,89,60,0.15)";
                                (e.currentTarget as HTMLElement).style.color = "#E8593C";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (avail && !sel) {
                                (e.currentTarget as HTMLElement).style.background = "transparent";
                                (e.currentTarget as HTMLElement).style.color = "#F4F2EE";
                              }
                            }}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>

                    {/* Time slots */}
                    {selectedDate && (
                      <>
                        <div
                          className="text-xs mb-3"
                          style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
                        >
                          AVAILABLE TIMES — {MONTHS[month].toUpperCase()} {selectedDate}
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
                          {SLOTS.map(t => {
                            const sel = selectedTime === t;
                            return (
                              <button
                                key={t}
                                onClick={() => setSelectedTime(t)}
                                className="py-2.5 rounded-lg text-sm flex items-center justify-between px-3 transition-all"
                                style={{
                                  background: sel ? "#E8593C" : "transparent",
                                  color: sel ? "white" : "#F4F2EE",
                                  border: `1px solid ${sel ? "#E8593C" : "rgba(255,255,255,0.12)"}`,
                                  fontFamily: "'DM Mono', monospace",
                                }}
                                onMouseEnter={(e) => {
                                  if (!sel) {
                                    (e.currentTarget as HTMLElement).style.background = "rgba(232,89,60,0.1)";
                                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(232,89,60,0.3)";
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!sel) {
                                    (e.currentTarget as HTMLElement).style.background = "transparent";
                                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
                                  }
                                }}
                              >
                                <span>{t}</span>
                                <span className="text-xs opacity-60">30 min</span>
                              </button>
                            );
                          })}
                        </div>

                        {selectedTime && (
                          <button
                            onClick={() => setStep("form")}
                            className="w-full mt-4 py-3 rounded-lg text-sm font-medium transition-all"
                            style={{ background: "#E8593C", color: "white" }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#FF6B47")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#E8593C")}
                          >
                            Continue →
                          </button>
                        )}
                      </>
                    )}
                  </>
                )}

                {step === "form" && (
                  <>
                    <button
                      onClick={() => setStep("calendar")}
                      className="flex items-center gap-2 text-sm mb-6"
                      style={{ color: "#8A8882" }}
                    >
                      <ArrowLeft size={14} strokeWidth={1.5} />
                      Back to times
                    </button>

                    <h2
                      className="mb-6"
                      style={{
                        fontFamily: "'Fraunces', serif",
                        fontSize: "1.1rem",
                        color: "#F4F2EE",
                        fontWeight: 600,
                      }}
                    >
                      Your details
                    </h2>

                    <div className="flex flex-col gap-4">
                      <FormField
                        label="Full name"
                        value={name}
                        onChange={setName}
                        placeholder="Jane Smith"
                      />
                      <FormField
                        label="Email address"
                        value={email}
                        onChange={setEmail}
                        placeholder="jane@example.com"
                        type="email"
                      />
                      <div>
                        <label
                          className="text-xs mb-1.5 block"
                          style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
                        >
                          WHAT ARE YOUR MAIN GOALS? (optional)
                        </label>
                        <textarea
                          value={goal}
                          onChange={e => setGoal(e.target.value)}
                          rows={3}
                          placeholder="Tell me a bit about what you're working on..."
                          className="w-full rounded-lg px-3 py-2.5 text-sm outline-none resize-none transition-all"
                          style={{
                            background: "#1E1E21",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "#F4F2EE",
                          }}
                          onFocus={(e) =>
                            ((e.currentTarget as HTMLElement).style.borderColor = "rgba(232,89,60,0.5)")
                          }
                          onBlur={(e) =>
                            ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)")
                          }
                        />
                      </div>

                      <button
                        onClick={handleConfirm}
                        disabled={!name || !email}
                        className="w-full py-3 rounded-lg text-sm font-medium transition-all mt-2"
                        style={{
                          background: name && email ? "#E8593C" : "rgba(255,255,255,0.06)",
                          color: name && email ? "white" : "#4A4946",
                          cursor: name && email ? "pointer" : "not-allowed",
                        }}
                      >
                        Continue to payment →
                      </button>
                    </div>
                  </>
                )}{/* Payment step */}
                {step === "payment" && (
                  <>
                    {/* Back link */}
                    <button
                      onClick={() => setStep("form")}
                      className="flex items-center gap-2 text-sm mb-6 transition-colors"
                      style={{ color: "#8A8882" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#F4F2EE")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#8A8882")}
                    >
                      <ArrowLeft size={14} strokeWidth={1.5} />
                      Back to details
                    </button>

                    <h2
                      className="mb-6"
                      style={{
                        fontFamily: "'Fraunces', serif",
                        fontSize: "1.1rem",
                        color: "#F4F2EE",
                        fontWeight: 600,
                      }}
                    >
                      Complete payment
                    </h2>

                    {/* Fee summary */}
                    <div
                      className="rounded-xl mb-5 overflow-hidden"
                      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      <div
                        className="flex items-center justify-between px-4 py-3"
                        style={{ background: "#1E1E21" }}
                      >
                        <span
                          className="text-xs"
                          style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", letterSpacing: "0.07em" }}
                        >
                          SESSION
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", letterSpacing: "0.07em" }}
                        >
                          AMOUNT
                        </span>
                      </div>
                      <div
                        className="flex items-center justify-between px-4 py-3.5"
                        style={{ background: "#1A1A1D", borderTop: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        <span className="text-sm" style={{ color: "#F4F2EE" }}>
                          30-min Discovery Call
                        </span>
                        <span
                          className="text-sm"
                          style={{ color: "#F4F2EE", fontFamily: "'DM Mono', monospace" }}
                        >
                          $75.00
                        </span>
                      </div>
                      <div
                        className="flex items-center justify-between px-4 py-3"
                        style={{
                          background: "#161618",
                          borderTop: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <span
                          className="text-xs"
                          style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
                        >
                          TOTAL DUE
                        </span>
                        <span
                          style={{
                            color: "#E8593C",
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 15,
                            fontWeight: 600,
                          }}
                        >
                          $75.00
                        </span>
                      </div>
                    </div>

                    {/* Card fields */}
                    <div className="flex flex-col gap-3 mb-5">
                      {/* Card number */}
                      <div>
                        <label
                          className="text-xs mb-1.5 block"
                          style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
                        >
                          CARD NUMBER
                        </label>
                        <div
                          className="flex items-center gap-2 rounded-lg px-3 py-2.5 transition-all"
                          style={{
                            background: "#1E1E21",
                            border: "1px solid rgba(255,255,255,0.1)",
                          }}
                          onFocusCapture={(e) =>
                            (e.currentTarget.style.borderColor = "rgba(232,89,60,0.5)")
                          }
                          onBlurCapture={(e) =>
                            (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
                          }
                        >
                          <CreditCard size={14} strokeWidth={1.5} style={{ color: "#4A4946", flexShrink: 0 }} />
                          <input
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCard(e.target.value))}
                            placeholder="1234 5678 9012 3456"
                            className="flex-1 bg-transparent outline-none text-sm"
                            style={{ color: "#F4F2EE", fontFamily: "'DM Mono', monospace", caretColor: "#E8593C" }}
                            maxLength={19}
                          />
                          {/* Card type hint */}
                          {cardNumber.startsWith("4") && (
                            <span style={{ fontSize: 10, color: "#4B9EFF", fontFamily: "'DM Mono', monospace" }}>VISA</span>
                          )}
                          {cardNumber.startsWith("5") && (
                            <span style={{ fontSize: 10, color: "#F0A429", fontFamily: "'DM Mono', monospace" }}>MC</span>
                          )}
                        </div>
                      </div>

                      {/* Expiry + CVC */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label
                            className="text-xs mb-1.5 block"
                            style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
                          >
                            EXPIRY
                          </label>
                          <input
                            value={expiry}
                            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                            placeholder="MM / YY"
                            maxLength={5}
                            className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-all"
                            style={{
                              background: "#1E1E21",
                              border: "1px solid rgba(255,255,255,0.1)",
                              color: "#F4F2EE",
                              fontFamily: "'DM Mono', monospace",
                              caretColor: "#E8593C",
                            }}
                            onFocus={(e) =>
                              ((e.currentTarget as HTMLElement).style.borderColor = "rgba(232,89,60,0.5)")
                            }
                            onBlur={(e) =>
                              ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)")
                            }
                          />
                        </div>
                        <div>
                          <label
                            className="text-xs mb-1.5 block"
                            style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
                          >
                            CVC
                          </label>
                          <input
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                            placeholder="•••"
                            maxLength={4}
                            className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-all"
                            style={{
                              background: "#1E1E21",
                              border: "1px solid rgba(255,255,255,0.1)",
                              color: "#F4F2EE",
                              fontFamily: "'DM Mono', monospace",
                              caretColor: "#E8593C",
                            }}
                            onFocus={(e) =>
                              ((e.currentTarget as HTMLElement).style.borderColor = "rgba(232,89,60,0.5)")
                            }
                            onBlur={(e) =>
                              ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)")
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Pay button */}
                    <button
                      onClick={handlePay}
                      disabled={!cardNumber || !expiry || !cvc || paying}
                      className="w-full py-3.5 rounded-lg text-sm font-medium transition-all"
                      style={{
                        background:
                          !cardNumber || !expiry || !cvc
                            ? "rgba(255,255,255,0.06)"
                            : paying
                            ? "rgba(232,89,60,0.7)"
                            : "#E8593C",
                        color:
                          !cardNumber || !expiry || !cvc ? "#4A4946" : "white",
                        cursor:
                          !cardNumber || !expiry || !cvc ? "not-allowed" : "pointer",
                      }}
                      onMouseEnter={(e) => {
                        if (cardNumber && expiry && cvc && !paying)
                          (e.currentTarget as HTMLElement).style.background = "#FF6B47";
                      }}
                      onMouseLeave={(e) => {
                        if (cardNumber && expiry && cvc && !paying)
                          (e.currentTarget as HTMLElement).style.background = "#E8593C";
                      }}
                    >
                      {paying ? "Processing…" : "Pay $75 & confirm booking"}
                    </button>

                    {/* Stripe badge */}
                    <div className="flex items-center justify-center gap-1.5 mt-3">
                      <Lock size={10} strokeWidth={1.5} style={{ color: "#4A4946" }} />
                      <span
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 10,
                          color: "#4A4946",
                          letterSpacing: "0.04em",
                        }}
                      >
                        Secured by Stripe
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Confirmation screen */
          <div
            className="rounded-2xl p-12 text-center max-w-md mx-auto"
            style={{
              background: "#161618",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
            }}
          >
            {/* Geometric checkmark */}
            <div className="flex justify-center mb-6">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="30" stroke="#E8593C" strokeWidth="2" />
                <path
                  d="M20 32L28 40L44 24"
                  stroke="#E8593C"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2
              className="mb-2"
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "2rem",
                fontWeight: 700,
                color: "#F4F2EE",
              }}
            >
              You're booked.
            </h2>
            <p className="text-sm mb-8" style={{ color: "#8A8882" }}>
              A confirmation has been sent to {email}
            </p>

            {/* Summary */}
            <div
              className="rounded-xl p-4 text-left mb-6"
              style={{
                background: "#1E1E21",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {[
                { label: "Event", value: "30-min Discovery Call" },
                { label: "Date", value: `${MONTHS[month]} ${selectedDate}, ${year}` },
                { label: "Time", value: `${selectedTime} (Asia/Manila)` },
                { label: "Duration", value: "30 min" },
                { label: "Location", value: "Google Meet (link in email)" },
              ].map(item => (
                <div
                  key={item.label}
                  className="flex justify-between py-2"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <span
                    className="text-xs"
                    style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
                  >
                    {item.label.toUpperCase()}
                  </span>
                  <span className="text-sm" style={{ color: "#F4F2EE" }}>{item.value}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <button
                className="w-full py-2.5 rounded-lg text-sm transition-all"
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#F4F2EE",
                }}
              >
                <Calendar size={14} strokeWidth={1.5} className="inline mr-2" />
                Add to Google Calendar
              </button>
              <button
                className="w-full py-2.5 rounded-lg text-sm transition-all"
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#F4F2EE",
                }}
              >
                Add to Apple Calendar
              </button>
              <button
                className="text-sm mt-2 transition-all"
                style={{ color: "#4A4946" }}
                onClick={() => {
                  setStep("calendar");
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setName("");
                  setEmail("");
                }}
              >
                Cancel or reschedule →
              </button>
            </div>
          </div>
        )}

        {/* Schedulr badge */}
        <div className="text-center mt-6">
          <span
            className="text-xs"
            style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
          >
            Powered by{" "}
            <button
              onClick={() => navigate("/")}
              style={{ color: "#E8593C" }}
            >
              Schedulr
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label
        className="text-xs mb-1.5 block"
        style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
      >
        {label.toUpperCase()}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-all"
        style={{
          background: "#1E1E21",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#F4F2EE",
        }}
        onFocus={(e) =>
          ((e.currentTarget as HTMLElement).style.borderColor = "rgba(232,89,60,0.5)")
        }
        onBlur={(e) =>
          ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)")
        }
      />
    </div>
  );
}