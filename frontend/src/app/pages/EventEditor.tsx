import { useState } from "react";
import {
  Video, Phone, MapPin, FileText, GripVertical, Plus,
  ChevronLeft, ChevronRight, Save, Globe, Trash2, Check
} from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DURATIONS = ["15 min", "30 min", "45 min", "60 min", "Custom"];
const COLORS = ["#E8593C", "#4B9EFF", "#2ECC8A", "#F0A429", "#A855F7", "#EC4899", "#F4F2EE", "#8A8882"];

const LOCATIONS = [
  { id: "meet", icon: Video, label: "Google Meet", desc: "Auto-generate link" },
  { id: "zoom", icon: Video, label: "Zoom", desc: "Your Zoom account" },
  { id: "phone", icon: Phone, label: "Phone call", desc: "They call you" },
  { id: "inperson", icon: MapPin, label: "In person", desc: "Physical location" },
  { id: "custom", icon: FileText, label: "Custom", desc: "Add custom text" },
];

function MiniCalendar({ accentColor }: { accentColor: string }) {
  const [selected, setSelected] = useState<number | null>(21);
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const available = [1,2,4,5,7,8,9,11,12,14,15,16,18,19,21,22,23,25,26,28,29,30];

  return (
    <div>
      <div
        className="flex items-center justify-between mb-3 text-xs"
        style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace" }}
      >
        <button style={{ color: "#4A4946" }}><ChevronLeft size={14} /></button>
        <span>April 2026</span>
        <button style={{ color: "#4A4946" }}><ChevronRight size={14} /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {["M","T","W","T","F","S","S"].map((d,i) => (
          <div key={i} className="text-xs" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>{d}</div>
        ))}
      </div>
      {/* Empty cells for offset */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {[null, null, null, null].map((_, i) => <div key={`e${i}`} />)}
        {days.map(d => {
          const isAvail = available.includes(d);
          const isSel = selected === d;
          return (
            <button
              key={d}
              onClick={() => isAvail && setSelected(d)}
              className="w-full aspect-square rounded-lg text-xs flex items-center justify-center transition-all"
              style={{
                background: isSel ? accentColor : isAvail ? "rgba(255,255,255,0.04)" : "transparent",
                color: isSel ? "white" : isAvail ? "#F4F2EE" : "#4A4946",
                cursor: isAvail ? "pointer" : "default",
              }}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TimeSlots({ accentColor }: { accentColor: string }) {
  const [selected, setSelected] = useState<string | null>("10:00");
  const slots = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30"];
  return (
    <div className="grid grid-cols-2 gap-1.5 mt-4">
      {slots.map(t => (
        <button
          key={t}
          onClick={() => setSelected(t)}
          className="py-2 rounded-lg text-xs transition-all"
          style={{
            background: selected === t ? accentColor : "transparent",
            color: selected === t ? "white" : "#F4F2EE",
            border: `1px solid ${selected === t ? accentColor : "rgba(255,255,255,0.12)"}`,
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export function EventEditor() {
  const [eventName, setEventName] = useState("30-min Discovery Call");
  const [description, setDescription] = useState("Let's get to know each other. We'll cover your goals, challenges, and whether we're a good fit.");
  const [duration, setDuration] = useState("30 min");
  const [accentColor, setAccentColor] = useState("#E8593C");
  const [activeDays, setActiveDays] = useState([true, true, true, true, true, false, false]);
  const [location, setLocation] = useState("meet");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [requireConfirm, setRequireConfirm] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [questions, setQuestions] = useState([
    { id: 1, label: "Name", type: "text", required: true },
    { id: 2, label: "Email", type: "text", required: true },
    { id: 3, label: "What are your main goals?", type: "textarea", required: false },
  ]);

  const toggleDay = (i: number) => {
    setActiveDays(prev => prev.map((d, idx) => idx === i ? !d : d));
  };

  return (
    <div className="h-[calc(100vh-48px)] flex flex-col" style={{ background: "#0F0F11" }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-6 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "#161618" }}
      >
        <div className="text-sm" style={{ color: "#8A8882" }}>
          Event Type Editor
        </div>
        <div
          className="text-xs"
          style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
        >
          schedulr.io/marcus/discovery-call
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Form editor */}
        <div
          className="flex flex-col overflow-y-auto"
          style={{
            width: "50%",
            borderRight: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="p-6 flex-1">
            {/* Basic info */}
            <Section title="Basic Info">
              {/* Event name - inline edit style */}
              <div className="mb-4">
                <label className="text-xs mb-1.5 block" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
                  EVENT NAME
                </label>
                <input
                  value={eventName}
                  onChange={e => setEventName(e.target.value)}
                  className="w-full bg-transparent outline-none text-base border-b pb-1 transition-all"
                  style={{
                    color: "#F4F2EE",
                    borderColor: "rgba(255,255,255,0.14)",
                    fontFamily: "'Fraunces', serif",
                    fontSize: "1.1rem",
                  }}
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="text-xs mb-1.5 block" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
                  DESCRIPTION
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
                  style={{
                    background: "#1E1E21",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#F4F2EE",
                  }}
                />
              </div>

              {/* Duration */}
              <div className="mb-4">
                <label className="text-xs mb-1.5 block" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
                  DURATION
                </label>
                <div className="flex gap-1">
                  {DURATIONS.map(d => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className="px-3 py-1.5 rounded-lg text-sm transition-all"
                      style={{
                        background: duration === d ? accentColor : "#1E1E21",
                        color: duration === d ? "white" : "#8A8882",
                        border: `1px solid ${duration === d ? accentColor : "rgba(255,255,255,0.1)"}`,
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
                  ACCENT COLOR
                </label>
                <div className="flex gap-2">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setAccentColor(c)}
                      className="w-7 h-7 rounded-lg transition-all flex items-center justify-center"
                      style={{
                        background: c,
                        boxShadow: accentColor === c ? `0 0 0 2px #0F0F11, 0 0 0 4px ${c}` : "none",
                      }}
                    >
                      {accentColor === c && <Check size={12} color="white" strokeWidth={2.5} />}
                    </button>
                  ))}
                </div>
              </div>
            </Section>

            {/* Availability */}
            <Section title="Availability">
              {/* Day toggles */}
              <div className="flex gap-1.5 mb-4 flex-wrap">
                {DAYS.map((day, i) => (
                  <button
                    key={day}
                    onClick={() => toggleDay(i)}
                    className="px-3 py-1.5 rounded-full text-sm transition-all"
                    style={{
                      background: activeDays[i] ? accentColor : "#1E1E21",
                      color: activeDays[i] ? "white" : "#8A8882",
                      border: `1px solid ${activeDays[i] ? accentColor : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {/* Time range */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <input
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-20 px-2 py-1.5 rounded-lg text-sm text-center outline-none"
                    style={{
                      background: "#1E1E21",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#F4F2EE",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  />
                  <span style={{ color: "#4A4946" }}>→</span>
                  <input
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-20 px-2 py-1.5 rounded-lg text-sm text-center outline-none"
                    style={{
                      background: "#1E1E21",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#F4F2EE",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  />
                </div>
              </div>

              {/* Buffer time */}
              <div className="flex items-center gap-4 text-sm" style={{ color: "#8A8882" }}>
                <span>Buffer:</span>
                <div className="flex items-center gap-2">
                  <button
                    className="w-6 h-6 rounded flex items-center justify-center text-xs"
                    style={{ background: "#1E1E21", color: "#F4F2EE" }}
                  >−</button>
                  <span className="text-sm" style={{ color: "#F4F2EE", fontFamily: "'DM Mono', monospace", minWidth: 60, textAlign: "center" }}>
                    15 min before
                  </span>
                  <button
                    className="w-6 h-6 rounded flex items-center justify-center text-xs"
                    style={{ background: "#1E1E21", color: "#F4F2EE" }}
                  >+</button>
                </div>
              </div>
            </Section>

            {/* Location */}
            <Section title="Location">
              <div className="flex flex-col gap-2">
                {LOCATIONS.map(({ id, icon: Icon, label, desc }) => (
                  <button
                    key={id}
                    onClick={() => setLocation(id)}
                    className="flex items-center gap-3 p-3 rounded-lg text-left transition-all"
                    style={{
                      background: location === id ? "rgba(232,89,60,0.08)" : "#1E1E21",
                      border: `1px solid ${location === id ? "rgba(232,89,60,0.3)" : "rgba(255,255,255,0.07)"}`,
                    }}
                  >
                    <Icon
                      size={16}
                      strokeWidth={1.5}
                      style={{ color: location === id ? accentColor : "#8A8882", flexShrink: 0 }}
                    />
                    <div>
                      <div className="text-sm" style={{ color: "#F4F2EE" }}>{label}</div>
                      <div className="text-xs" style={{ color: "#8A8882" }}>{desc}</div>
                    </div>
                    {location === id && (
                      <div className="ml-auto">
                        <Check size={14} style={{ color: accentColor }} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </Section>

            {/* Booking page settings */}
            <Section title="Booking Page Settings">
              <div className="mb-4">
                <label className="text-xs mb-1.5 block" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
                  URL SLUG
                </label>
                <div
                  className="flex items-center rounded-lg overflow-hidden"
                  style={{ border: "1px solid rgba(255,255,255,0.1)", background: "#1E1E21" }}
                >
                  <span
                    className="px-3 py-2 text-sm border-r"
                    style={{
                      color: "#4A4946",
                      borderColor: "rgba(255,255,255,0.1)",
                      fontFamily: "'DM Mono', monospace",
                      whiteSpace: "nowrap",
                    }}
                  >
                    schedulr.io/marcus/
                  </span>
                  <input
                    defaultValue="discovery-call"
                    className="flex-1 px-3 py-2 bg-transparent outline-none text-sm"
                    style={{ color: "#F4F2EE", fontFamily: "'DM Mono', monospace" }}
                  />
                </div>
              </div>

              <ToggleRow
                label="Require confirmation before confirmed"
                value={requireConfirm}
                onChange={() => setRequireConfirm(!requireConfirm)}
                accentColor={accentColor}
              />
              <ToggleRow
                label="Redirect after booking"
                value={redirect}
                onChange={() => setRedirect(!redirect)}
                accentColor={accentColor}
              />
            </Section>

            {/* Questions */}
            <Section title="Guest Questions">
              <div className="flex flex-col gap-2 mb-3">
                {questions.map((q, i) => (
                  <div
                    key={q.id}
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{
                      background: "#1E1E21",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <GripVertical size={14} style={{ color: "#4A4946" }} className="cursor-grab" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm" style={{ color: "#F4F2EE" }}>{q.label}</div>
                      <div
                        className="text-xs"
                        style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace" }}
                      >
                        {q.type} · {q.required ? "required" : "optional"}
                      </div>
                    </div>
                    <button
                      onClick={() => setQuestions(prev => prev.filter(x => x.id !== q.id))}
                      style={{ color: "#4A4946" }}
                    >
                      <Trash2 size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() =>
                  setQuestions(prev => [
                    ...prev,
                    { id: Date.now(), label: "New question", type: "text", required: false },
                  ])
                }
                className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-all"
                style={{
                  border: "1px dashed rgba(255,255,255,0.12)",
                  color: "#8A8882",
                  background: "transparent",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <Plus size={14} strokeWidth={1.5} />
                Add question
              </button>
            </Section>
          </div>

          {/* Sticky bottom bar */}
          <div
            className="flex items-center justify-end gap-3 px-6 py-4 flex-shrink-0"
            style={{
              background: "#161618",
              borderTop: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <button
              className="px-5 py-2 rounded-lg text-sm transition-all"
              style={{
                border: "1px solid rgba(255,255,255,0.14)",
                color: "#F4F2EE",
                background: "transparent",
              }}
            >
              Save draft
            </button>
            <button
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm transition-all"
              style={{ background: accentColor, color: "white" }}
            >
              <Globe size={14} strokeWidth={1.5} />
              Publish
            </button>
          </div>
        </div>

        {/* RIGHT: Live preview */}
        <div
          className="flex-1 overflow-y-auto flex items-start justify-center p-8"
          style={{ background: "#0F0F11" }}
        >
          <div className="w-full max-w-xs">
            {/* Phone frame */}
            <div
              className="text-xs text-center mb-4"
              style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
            >
              LIVE PREVIEW
            </div>
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "#161618",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              }}
            >
              {/* Header */}
              <div
                className="px-5 pt-6 pb-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-3 text-white text-sm"
                  style={{ background: accentColor, fontFamily: "'DM Mono', monospace" }}
                >
                  MK
                </div>
                <div
                  className="text-center text-sm mb-1"
                  style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace" }}
                >
                  Marcus K.
                </div>
                <div
                  className="text-center"
                  style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", color: "#F4F2EE", fontWeight: 600 }}
                >
                  {eventName || "Discovery Call"}
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "#1E1E21", color: "#8A8882", fontFamily: "'DM Mono', monospace" }}
                  >
                    {duration}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "#1E1E21", color: "#8A8882", fontFamily: "'DM Mono', monospace" }}
                  >
                    Google Meet
                  </span>
                </div>
                {description && (
                  <p
                    className="text-xs text-center mt-3"
                    style={{ color: "#8A8882", lineHeight: 1.5 }}
                  >
                    {description.slice(0, 80)}{description.length > 80 && "..."}
                  </p>
                )}
              </div>

              {/* Calendar */}
              <div className="px-4 py-4">
                <MiniCalendar accentColor={accentColor} />
                <TimeSlots accentColor={accentColor} />
              </div>

              {/* Timezone */}
              <div
                className="px-4 py-3 text-xs"
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                  color: "#4A4946",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                Asia/Manila (UTC+8) ▾
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <div
        className="text-xs mb-4"
        style={{
          color: "#4A4946",
          fontFamily: "'DM Mono', monospace",
          letterSpacing: "0.08em",
        }}
      >
        {title.toUpperCase()}
      </div>
      <div
        className="p-4 rounded-xl"
        style={{
          background: "#161618",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
  accentColor,
}: {
  label: string;
  value: boolean;
  onChange: () => void;
  accentColor: string;
}) {
  return (
    <div className="flex items-center justify-between py-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <span className="text-sm" style={{ color: "#F4F2EE" }}>{label}</span>
      <button
        onClick={onChange}
        className="relative flex-shrink-0"
        style={{ width: 40, height: 22 }}
      >
        <div
          className="absolute inset-0 rounded-full transition-colors"
          style={{ background: value ? accentColor : "rgba(255,255,255,0.12)" }}
        />
        <div
          className="absolute top-1 rounded-full transition-all"
          style={{
            width: 14,
            height: 14,
            background: "white",
            left: value ? 22 : 4,
          }}
        />
      </button>
    </div>
  );
}
