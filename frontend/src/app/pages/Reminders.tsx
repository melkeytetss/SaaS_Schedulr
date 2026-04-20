import { useState } from "react";
import {
  Plus, Mail, MessageSquare, Pencil, Bell,
  Clock, X, Check,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Channel = "email" | "sms";

interface ReminderRule {
  id: string;
  trigger: string;
  triggerDetail: string;
  channel: Channel;
  active: boolean;
  subject?: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const INITIAL_RULES: ReminderRule[] = [
  {
    id: "r1",
    trigger: "24 hours before",
    triggerDetail: "Sent 24h before the booking starts",
    channel: "email",
    active: true,
    subject: "Reminder: Your call with Marcus K. is tomorrow",
  },
  {
    id: "r2",
    trigger: "1 hour before",
    triggerDetail: "Sent 1h before the booking starts",
    channel: "sms",
    active: true,
  },
  {
    id: "r3",
    trigger: "Immediately after booking",
    triggerDetail: "Sent as soon as a booking is confirmed",
    channel: "email",
    active: true,
    subject: "You're confirmed: 30-min Discovery Call with Marcus K.",
  },
  {
    id: "r4",
    trigger: "1 day after — follow-up",
    triggerDetail: "Sent 1 day after the event ends",
    channel: "email",
    active: false,
    subject: "Thanks for meeting — a quick follow-up",
  },
];

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ active, onChange }: { active: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative flex-shrink-0 transition-all focus:outline-none"
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        background: active ? "#E8593C" : "rgba(255,255,255,0.1)",
        boxShadow: active ? "0 0 10px rgba(232,89,60,0.3)" : "none",
        transition: "background 0.2s, box-shadow 0.2s",
      }}
      aria-checked={active}
      role="switch"
    >
      <div
        className="absolute top-1 rounded-full"
        style={{
          width: 12,
          height: 12,
          background: "white",
          left: active ? 20 : 4,
          transition: "left 0.15s",
        }}
      />
    </button>
  );
}

// ─── Channel badge ────────────────────────────────────────────────────────────
function ChannelBadge({ channel }: { channel: Channel }) {
  const isEmail = channel === "email";
  return (
    <span
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
      style={{
        background: isEmail ? "rgba(75,158,255,0.1)" : "rgba(46,204,138,0.1)",
        color: isEmail ? "#4B9EFF" : "#2ECC8A",
        border: `1px solid ${isEmail ? "rgba(75,158,255,0.25)" : "rgba(46,204,138,0.25)"}`,
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {isEmail
        ? <Mail size={10} strokeWidth={1.5} />
        : <MessageSquare size={10} strokeWidth={1.5} />}
      {isEmail ? "Email" : "SMS"}
    </span>
  );
}

// ─── Email preview panel ──────────────────────────────────────────────────────
function EmailPreview({ ruleId }: { ruleId: string }) {
  const rule = INITIAL_RULES.find((r) => r.id === ruleId);
  const subject = rule?.subject ?? "Reminder: Your upcoming booking with Marcus K.";
  const triggerLabel = rule?.trigger ?? "24 hours before";

  return (
    <div>
      {/* Panel header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "1.05rem",
              fontWeight: 600,
              color: "#F4F2EE",
            }}
          >
            Email preview
          </div>
          <div
            className="flex items-center gap-1.5 mt-0.5"
            style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#4A4946" }}
          >
            <Clock size={10} strokeWidth={1.5} />
            {triggerLabel.toUpperCase()}
          </div>
        </div>
        <span
          className="px-2.5 py-1 rounded-full text-xs"
          style={{
            background: "rgba(232,89,60,0.1)",
            color: "#E8593C",
            border: "1px solid rgba(232,89,60,0.2)",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          PREVIEW ONLY
        </span>
      </div>

      {/* Mock email client */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        }}
      >
        {/* Dark chrome – title bar */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{
            background: "#1A1A1D",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#FFBD2E" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
          </div>
          <div
            className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{
              background: "rgba(255,255,255,0.05)",
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: "#4A4946",
            }}
          >
            <Mail size={10} strokeWidth={1.5} />
            noreply@schedulr.io
          </div>
        </div>

        {/* Email header rows */}
        <div style={{ background: "#1E1E21" }}>
          {[
            { label: "FROM", value: "Marcus K. via Schedulr <noreply@schedulr.io>" },
            { label: "TO", value: "sarah.k@gmail.com" },
            { label: "DATE", value: "Sat, Apr 18, 2026 · 11:00 AM" },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center gap-3 px-5 py-2.5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
            >
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  color: "#4A4946",
                  width: 36,
                  flexShrink: 0,
                }}
              >
                {row.label}
              </span>
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: "#8A8882",
                }}
              >
                {row.value}
              </span>
            </div>
          ))}
          <div
            className="flex items-center gap-3 px-5 py-2.5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                color: "#4A4946",
                width: 36,
                flexShrink: 0,
              }}
            >
              RE
            </span>
            <span style={{ fontSize: 13, color: "#F4F2EE" }}>{subject}</span>
          </div>
        </div>

        {/* White email body */}
        <div className="p-6 md:p-8" style={{ background: "#FFFFFF" }}>
          {/* Brand mark */}
          <div className="flex items-center gap-2 mb-7">
            <div
              className="flex items-center justify-center rounded-md text-white"
              style={{
                width: 26,
                height: 26,
                background: "#E8593C",
                fontFamily: "'DM Mono', monospace",
                fontSize: 12,
              }}
            >
              S
            </div>
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 13,
                color: "#0F0F11",
                letterSpacing: "0.06em",
              }}
            >
              schedulr
            </span>
          </div>

          {/* Heading */}
          <h2
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "#0F0F11",
              lineHeight: 1.2,
              marginBottom: 12,
            }}
          >
            See you tomorrow.
          </h2>
          <p style={{ color: "#555", fontSize: 14, lineHeight: 1.8, marginBottom: 24 }}>
            Hi Sarah — just a quick reminder that you have a{" "}
            <strong style={{ color: "#0F0F11" }}>30-min Discovery Call</strong> with{" "}
            <strong style={{ color: "#0F0F11" }}>Marcus K.</strong> scheduled for tomorrow.
            Here are the details:
          </p>

          {/* Event card */}
          <div
            className="rounded-xl overflow-hidden mb-6"
            style={{ border: "1px solid #E8E4DE" }}
          >
            {/* Card accent bar */}
            <div style={{ height: 3, background: "#E8593C" }} />
            <div className="p-5" style={{ background: "#FAFAF8" }}>
              {[
                { label: "DATE",     value: "Sunday, April 19, 2026" },
                { label: "TIME",     value: "09:00 AM (Asia/Manila · UTC+8)" },
                { label: "DURATION", value: "30 minutes" },
                { label: "LOCATION", value: "Google Meet" },
                { label: "HOST",     value: "Marcus K." },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  className="flex items-start justify-between py-2.5"
                  style={{
                    borderBottom:
                      i < arr.length - 1 ? "1px solid #EAE8E2" : "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 10,
                      color: "#999",
                      letterSpacing: "0.08em",
                      paddingTop: 1,
                    }}
                  >
                    {row.label}
                  </span>
                  <span style={{ fontSize: 13, color: "#0F0F11", textAlign: "right", maxWidth: "62%" }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA button */}
          <div className="mb-7">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                display: "inline-block",
                background: "#E8593C",
                color: "white",
                textDecoration: "none",
                borderRadius: 8,
                padding: "12px 22px",
                fontFamily: "'DM Mono', monospace",
                fontSize: 12,
                letterSpacing: "0.05em",
              }}
            >
              JOIN GOOGLE MEET →
            </a>
          </div>

          {/* Reschedule note */}
          <p style={{ color: "#888", fontSize: 12, lineHeight: 1.75 }}>
            Need to reschedule?{" "}
            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "#E8593C" }}>
              Click here
            </a>{" "}
            to pick a new time, or{" "}
            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "#E8593C" }}>
              cancel
            </a>{" "}
            if you can no longer make it.
          </p>

          {/* Footer */}
          <div
            className="mt-6 pt-4 flex items-center justify-between"
            style={{ borderTop: "1px solid #EAE8E2" }}
          >
            <span style={{ fontSize: 11, color: "#BBB" }}>
              Powered by Schedulr · schedulr.io
            </span>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{ fontSize: 11, color: "#CCC", textDecoration: "none" }}
            >
              Unsubscribe
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function Reminders() {
  const [rules, setRules] = useState<ReminderRule[]>(INITIAL_RULES);
  const [previewId, setPreviewId] = useState("r1");
  const [saved, setSaved] = useState<string | null>(null);

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
    setSaved(id);
    setTimeout(() => setSaved(null), 1800);
  };

  return (
    <div className="min-h-[calc(100vh-48px)]" style={{ background: "#0F0F11" }}>
      {/* Page header */}
      <div
        className="px-6 md:px-8 pt-8 pb-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "1.75rem",
                fontWeight: 600,
                color: "#F4F2EE",
                lineHeight: 1.2,
              }}
            >
              Reminders
            </h1>
            <p className="text-sm mt-1" style={{ color: "#8A8882" }}>
              Automated messages sent to guests before and after their booking
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all flex-shrink-0"
            style={{ background: "#E8593C", color: "white" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#FF6B47")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#E8593C")
            }
          >
            <Plus size={14} strokeWidth={2} />
            Add reminder rule
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl">
          {/* ── Left: rule cards ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                color: "#4A4946",
                letterSpacing: "0.08em",
              }}
            >
              RULES — {rules.filter((r) => r.active).length} ACTIVE /{" "}
              {rules.length} TOTAL
            </div>

            {rules.map((rule) => {
              const isSelected = previewId === rule.id;
              const justSaved = saved === rule.id;
              return (
                <div
                  key={rule.id}
                  onClick={() => { if (rule.channel === "email") setPreviewId(rule.id); }}
                  className="p-4 rounded-xl transition-all"
                  style={{
                    background: isSelected
                      ? "rgba(232,89,60,0.06)"
                      : "#161618",
                    border: `1px solid ${
                      isSelected
                        ? "rgba(232,89,60,0.25)"
                        : "rgba(255,255,255,0.07)"
                    }`,
                    cursor: rule.channel === "email" ? "pointer" : "default",
                  }}
                >
                  {/* Top row */}
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="flex items-center justify-center rounded-lg flex-shrink-0"
                      style={{
                        width: 34,
                        height: 34,
                        background: rule.active
                          ? "rgba(232,89,60,0.1)"
                          : "rgba(255,255,255,0.04)",
                      }}
                    >
                      <Bell
                        size={14}
                        strokeWidth={1.5}
                        style={{ color: rule.active ? "#E8593C" : "#4A4946" }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm"
                        style={{
                          color: rule.active ? "#F4F2EE" : "#8A8882",
                        }}
                      >
                        {rule.trigger}
                      </div>
                      <div
                        className="text-xs mt-0.5"
                        style={{
                          color: "#4A4946",
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        {rule.triggerDetail}
                      </div>
                    </div>
                    {/* Toggle with saved feedback */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {justSaved && (
                        <span
                          className="flex items-center gap-1"
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 10,
                            color: "#2ECC8A",
                          }}
                        >
                          <Check size={9} strokeWidth={2} />
                          saved
                        </span>
                      )}
                      <Toggle
                        active={rule.active}
                        onChange={() => toggleRule(rule.id)}
                      />
                    </div>
                  </div>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between">
                    <ChannelBadge channel={rule.channel} />
                    <button
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                      style={{
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#8A8882",
                        background: "transparent",
                        fontFamily: "'DM Mono', monospace",
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "rgba(255,255,255,0.05)";
                        (e.currentTarget as HTMLElement).style.color =
                          "#F4F2EE";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "transparent";
                        (e.currentTarget as HTMLElement).style.color =
                          "#8A8882";
                      }}
                    >
                      <Pencil size={10} strokeWidth={1.5} />
                      Edit
                    </button>
                  </div>

                  {/* Preview hint for email rules */}
                  {rule.channel === "email" && isSelected && (
                    <div
                      className="mt-3 pt-3 flex items-center gap-1.5"
                      style={{
                        borderTop: "1px solid rgba(232,89,60,0.15)",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 10,
                        color: "#E8593C",
                      }}
                    >
                      <Mail size={9} strokeWidth={1.5} />
                      Previewing this rule →
                    </div>
                  )}
                  {rule.channel === "email" && !isSelected && (
                    <div
                      className="mt-3 pt-3 flex items-center gap-1.5"
                      style={{
                        borderTop: "1px solid rgba(255,255,255,0.05)",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 10,
                        color: "#4A4946",
                      }}
                    >
                      <Mail size={9} strokeWidth={1.5} />
                      Click to preview email
                    </div>
                  )}
                  {rule.channel === "sms" && (
                    <div
                      className="mt-3 pt-3 flex items-center gap-1.5"
                      style={{
                        borderTop: "1px solid rgba(255,255,255,0.05)",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 10,
                        color: "#4A4946",
                      }}
                    >
                      <MessageSquare size={9} strokeWidth={1.5} />
                      SMS preview unavailable
                    </div>
                  )}
                </div>
              );
            })}

            {/* SMS note */}
            <div
              className="px-4 py-3 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px dashed rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="flex items-center gap-2 mb-1"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: "#4A4946",
                }}
              >
                <MessageSquare size={11} strokeWidth={1.5} />
                SMS REQUIRES TWILIO
              </div>
              <p className="text-xs" style={{ color: "#4A4946", lineHeight: 1.6 }}>
                Connect Twilio in Integrations to activate SMS reminders.
              </p>
            </div>
          </div>

          {/* ── Right: email preview ── */}
          <div className="lg:col-span-3">
            <EmailPreview ruleId={previewId} />
          </div>
        </div>
      </div>
    </div>
  );
}
