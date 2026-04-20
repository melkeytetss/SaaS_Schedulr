import { useState, useRef, useEffect } from "react";
import {
  Camera, User, BookOpen, Bell, AlertTriangle,
  ExternalLink, Download, Trash2, ChevronDown,
  Check, Globe,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Section {
  id: string;
  label: string;
  icon: React.ElementType;
}

const SECTIONS: Section[] = [
  { id: "profile",       label: "Profile",        icon: User         },
  { id: "booking",       label: "Booking page",   icon: BookOpen     },
  { id: "notifications", label: "Notifications",  icon: Bell         },
  { id: "danger",        label: "Danger zone",    icon: AlertTriangle},
];

const TIMEZONES = [
  "Asia/Manila (UTC+8)",
  "America/New_York (UTC-5)",
  "America/Chicago (UTC-6)",
  "America/Los_Angeles (UTC-8)",
  "Europe/London (UTC+0)",
  "Europe/Berlin (UTC+1)",
  "Asia/Tokyo (UTC+9)",
  "Australia/Sydney (UTC+11)",
  "Pacific/Auckland (UTC+12)",
];

// ─── Shared input styles ──────────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block mb-1.5 text-xs"
      style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", letterSpacing: "0.07em" }}
    >
      {children}
    </label>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  prefix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  prefix?: string;
}) {
  return (
    <div>
      <FieldLabel>{label.toUpperCase()}</FieldLabel>
      <div
        className="flex items-center rounded-xl overflow-hidden transition-all"
        style={{ background: "#1A1A1D", border: "1px solid rgba(255,255,255,0.1)" }}
        onFocusCapture={(e) =>
          (e.currentTarget.style.borderColor = "rgba(232,89,60,0.4)")
        }
        onBlurCapture={(e) =>
          (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
        }
      >
        {prefix && (
          <span
            className="px-3 py-2.5 text-sm flex-shrink-0"
            style={{
              color: "#4A4946",
              borderRight: "1px solid rgba(255,255,255,0.08)",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent"
          style={{ color: "#F4F2EE", caretColor: "#E8593C" }}
        />
      </div>
    </div>
  );
}

function TextAreaInput({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <FieldLabel>{label.toUpperCase()}</FieldLabel>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-none transition-all"
        style={{
          background: "#1A1A1D",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#F4F2EE",
          caretColor: "#E8593C",
        }}
        onFocus={(e) =>
          ((e.currentTarget as HTMLElement).style.borderColor = "rgba(232,89,60,0.4)")
        }
        onBlur={(e) =>
          ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)")
        }
      />
    </div>
  );
}

// ─── Timezone dropdown ────────────────────────────────────────────────────────
function TimezoneDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
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
    <div>
      <FieldLabel>TIMEZONE</FieldLabel>
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
          style={{
            background: "#1A1A1D",
            border: `1px solid ${open ? "rgba(232,89,60,0.4)" : "rgba(255,255,255,0.1)"}`,
            color: "#F4F2EE",
          }}
        >
          <div className="flex items-center gap-2">
            <Globe size={13} strokeWidth={1.5} style={{ color: "#4A4946" }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12 }}>{value}</span>
          </div>
          <ChevronDown
            size={13}
            strokeWidth={1.5}
            style={{ color: "#4A4946", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
          />
        </button>
        {open && (
          <div
            className="absolute top-full left-0 right-0 mt-1 z-30 rounded-xl py-1 overflow-hidden"
            style={{
              background: "#1E1E21",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
              maxHeight: 220,
              overflowY: "auto",
            }}
          >
            {TIMEZONES.map((tz) => (
              <button
                key={tz}
                onClick={() => { onChange(tz); setOpen(false); }}
                className="w-full text-left px-4 py-2.5 flex items-center gap-2 transition-colors"
                style={{
                  background: tz === value ? "rgba(232,89,60,0.08)" : "transparent",
                  color: tz === value ? "#F4F2EE" : "#8A8882",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                }}
                onMouseEnter={(e) => {
                  if (tz !== value) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                }}
                onMouseLeave={(e) => {
                  if (tz !== value) (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                {tz === value && <Check size={10} strokeWidth={2} style={{ color: "#E8593C", flexShrink: 0 }} />}
                {tz !== value && <span style={{ width: 10, flexShrink: 0 }} />}
                {tz}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Toggle row ───────────────────────────────────────────────────────────────
function ToggleRow({
  label,
  description,
  active,
  onChange,
}: {
  label: string;
  description?: string;
  active: boolean;
  onChange: () => void;
}) {
  return (
    <div
      className="flex items-start justify-between gap-4 py-4"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div>
        <div className="text-sm" style={{ color: "#F4F2EE" }}>
          {label}
        </div>
        {description && (
          <div className="text-xs mt-0.5" style={{ color: "#4A4946" }}>
            {description}
          </div>
        )}
      </div>
      {/* Toggle */}
      <button
        onClick={onChange}
        className="relative flex-shrink-0 focus:outline-none mt-0.5"
        style={{
          width: 40,
          height: 22,
          borderRadius: 11,
          background: active ? "#E8593C" : "rgba(255,255,255,0.1)",
          boxShadow: active ? "0 0 10px rgba(232,89,60,0.3)" : "none",
          transition: "background 0.2s, box-shadow 0.2s",
        }}
        role="switch"
        aria-checked={active}
      >
        <div
          className="absolute top-1 rounded-full"
          style={{
            width: 14,
            height: 14,
            background: "white",
            left: active ? 22 : 4,
            transition: "left 0.15s",
          }}
        />
      </button>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function SectionBlock({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="pt-10 pb-10"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", scrollMarginTop: 80 }}
    >
      <div className="mb-6">
        <h2
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "1.15rem",
            fontWeight: 600,
            color: "#F4F2EE",
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm mt-1" style={{ color: "#8A8882" }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

// ─── Save button ──────────────────────────────────────────────────────────────
function SaveButton({ label = "Save changes" }: { label?: string }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    }, 700);
  };

  return (
    <button
      onClick={handleSave}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all mt-6"
      style={{
        background: saved
          ? "rgba(46,204,138,0.12)"
          : saving
          ? "rgba(232,89,60,0.7)"
          : "#E8593C",
        color: saved ? "#2ECC8A" : "white",
        border: saved ? "1px solid rgba(46,204,138,0.3)" : "none",
      }}
      onMouseEnter={(e) => {
        if (!saving && !saved) (e.currentTarget as HTMLElement).style.background = "#FF6B47";
      }}
      onMouseLeave={(e) => {
        if (!saving && !saved) (e.currentTarget as HTMLElement).style.background = "#E8593C";
      }}
    >
      {saved ? (
        <>
          <Check size={13} strokeWidth={2} />
          Saved
        </>
      ) : saving ? (
        "Saving…"
      ) : (
        label
      )}
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function Settings() {
  // Profile
  const [name,     setName]     = useState("Marcus Kowalski");
  const [email,    setEmail]    = useState("marcus@studiok.co");
  const [timezone, setTimezone] = useState("Asia/Manila (UTC+8)");

  // Booking page
  const [slug,      setSlug]      = useState("marcus-k");
  const [showPhoto, setShowPhoto] = useState(true);
  const [bio,       setBio]       = useState("Helping founders and freelancers build better client relationships. 10 years in strategy consulting, now independent.");

  // Notifications
  const [notifNew,     setNotifNew]     = useState(true);
  const [notifCancel,  setNotifCancel]  = useState(true);
  const [notifSummary, setNotifSummary] = useState(false);

  // Active section nav
  const [activeSection, setActiveSection] = useState("profile");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-[calc(100vh-48px)]" style={{ background: "#0F0F11" }}>
      {/* Page header */}
      <div
        className="px-6 md:px-8 pt-8 pb-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "1.75rem",
            fontWeight: 600,
            color: "#F4F2EE",
            lineHeight: 1.2,
          }}
        >
          Settings
        </h1>
        <p className="text-sm mt-1" style={{ color: "#8A8882" }}>
          Manage your profile, booking page, and preferences
        </p>
      </div>

      {/* Two-column body */}
      <div className="flex">
        {/* ── Left nav ── */}
        <aside
          className="hidden md:flex flex-col flex-shrink-0 pt-8 px-4 sticky top-[48px] h-[calc(100vh-48px)]"
          style={{ width: 196, borderRight: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            className="mb-3 px-2"
            style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#4A4946", letterSpacing: "0.08em" }}
          >
            ON THIS PAGE
          </div>
          {SECTIONS.map(({ id, label, icon: Icon }) => {
            const isActive = activeSection === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                className="flex items-center gap-2.5 px-2 py-2 rounded-lg mb-0.5 text-sm transition-colors"
                style={{
                  color: isActive ? "#F4F2EE" : "#8A8882",
                  background: isActive ? "rgba(232,89,60,0.07)" : "transparent",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                }}
              >
                <Icon
                  size={13}
                  strokeWidth={1.5}
                  style={{ color: isActive ? "#E8593C" : "#4A4946" }}
                />
                {label}
              </a>
            );
          })}
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 px-6 md:px-10 max-w-2xl">

          {/* ── Profile ── */}
          <SectionBlock
            id="profile"
            title="Profile"
            subtitle="Your public identity and account details"
          >
            {/* Avatar upload */}
            <div className="flex items-center gap-5 mb-7">
              <div className="relative group">
                <div
                  className="flex items-center justify-center rounded-full text-white"
                  style={{
                    width: 72,
                    height: 72,
                    background: "#E8593C",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 22,
                  }}
                >
                  MK
                </div>
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  style={{ background: "rgba(0,0,0,0.55)" }}
                >
                  <Camera size={16} strokeWidth={1.5} style={{ color: "white" }} />
                </div>
              </div>
              <div>
                <button
                  className="text-sm px-4 py-2 rounded-lg transition-all"
                  style={{
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#F4F2EE",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "transparent")
                  }
                >
                  Upload photo
                </button>
                <p className="text-xs mt-1.5" style={{ color: "#4A4946" }}>
                  JPG, PNG or GIF · Max 4 MB
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput label="Full name" value={name} onChange={setName} placeholder="Your name" />
              <TextInput label="Email address" value={email} onChange={setEmail} placeholder="you@example.com" type="email" />
            </div>
            <div className="mt-4">
              <TimezoneDropdown value={timezone} onChange={setTimezone} />
            </div>
            <SaveButton />
          </SectionBlock>

          {/* ── Booking page ── */}
          <SectionBlock
            id="booking"
            title="Booking page"
            subtitle="Customise what guests see when they book with you"
          >
            <div className="mb-4">
              <TextInput
                label="Your scheduling URL"
                value={slug}
                onChange={setSlug}
                placeholder="your-name"
                prefix="schedulr.io/"
              />
              <div className="flex items-center gap-1.5 mt-2">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-1 text-xs transition-colors"
                  style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "#E8593C")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "#4A4946")
                  }
                >
                  schedulr.io/{slug || "your-name"}
                  <ExternalLink size={10} strokeWidth={1.5} />
                </a>
              </div>
            </div>

            {/* Photo toggle */}
            <div
              className="flex items-start justify-between gap-4 py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div>
                <div className="text-sm" style={{ color: "#F4F2EE" }}>
                  Show profile photo on booking page
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#4A4946" }}>
                  Guests will see your avatar when they book
                </div>
              </div>
              <button
                onClick={() => setShowPhoto((v) => !v)}
                className="relative flex-shrink-0 focus:outline-none mt-0.5"
                style={{
                  width: 40,
                  height: 22,
                  borderRadius: 11,
                  background: showPhoto ? "#E8593C" : "rgba(255,255,255,0.1)",
                  boxShadow: showPhoto ? "0 0 10px rgba(232,89,60,0.3)" : "none",
                  transition: "background 0.2s",
                }}
                role="switch"
                aria-checked={showPhoto}
              >
                <div
                  className="absolute top-1 rounded-full"
                  style={{
                    width: 14,
                    height: 14,
                    background: "white",
                    left: showPhoto ? 22 : 4,
                    transition: "left 0.15s",
                  }}
                />
              </button>
            </div>

            <div className="mt-4">
              <TextAreaInput
                label="Bio"
                value={bio}
                onChange={setBio}
                placeholder="Tell visitors a bit about yourself…"
                rows={4}
              />
              <div
                className="flex justify-end mt-1.5"
                style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#4A4946" }}
              >
                {bio.length} / 280
              </div>
            </div>
            <SaveButton />
          </SectionBlock>

          {/* ── Notifications ── */}
          <SectionBlock
            id="notifications"
            title="Notifications"
            subtitle="Choose which emails Schedulr sends to you"
          >
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div
                className="px-5"
                style={{ background: "#161618" }}
              >
                <ToggleRow
                  label="Email on new booking"
                  description="Receive an email each time someone books a session"
                  active={notifNew}
                  onChange={() => setNotifNew((v) => !v)}
                />
                <ToggleRow
                  label="Email on cancellation"
                  description="Receive an email when a guest cancels their booking"
                  active={notifCancel}
                  onChange={() => setNotifCancel((v) => !v)}
                />
                <ToggleRow
                  label="Daily summary email"
                  description="A digest of your upcoming bookings sent every morning"
                  active={notifSummary}
                  onChange={() => setNotifSummary((v) => !v)}
                />
              </div>
            </div>
            <SaveButton label="Save preferences" />
          </SectionBlock>

          {/* ── Danger zone ── */}
          <SectionBlock
            id="danger"
            title="Danger zone"
          >
            <div
              className="rounded-xl p-5"
              style={{
                background: "#161618",
                border: "1px solid rgba(232,89,60,0.15)",
              }}
            >
              <div className="flex flex-col gap-3">
                {/* Export data */}
                <div
                  className="flex items-center justify-between gap-4 py-3"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <div>
                    <div className="text-sm" style={{ color: "#F4F2EE" }}>
                      Export my data
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "#4A4946" }}>
                      Download a CSV of all your bookings and event data
                    </div>
                  </div>
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all flex-shrink-0"
                    style={{
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "#8A8882",
                      background: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                      (e.currentTarget as HTMLElement).style.color = "#F4F2EE";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.color = "#8A8882";
                    }}
                  >
                    <Download size={13} strokeWidth={1.5} />
                    Export
                  </button>
                </div>

                {/* Delete account */}
                <div className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <div className="text-sm" style={{ color: "#F4F2EE" }}>
                      Delete account
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "#4A4946" }}>
                      Permanently delete your Schedulr account and all data.
                      This cannot be undone.
                    </div>
                  </div>
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all flex-shrink-0"
                    style={{
                      border: "1px solid rgba(232,89,60,0.3)",
                      color: "#E8593C",
                      background: "transparent",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = "rgba(232,89,60,0.07)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = "transparent")
                    }
                  >
                    <Trash2 size={13} strokeWidth={1.5} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </SectionBlock>

          {/* Footer pad */}
          <div className="h-16" />
        </main>
      </div>
    </div>
  );
}
