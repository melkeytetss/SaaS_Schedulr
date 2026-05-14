import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Webhook, Check } from "lucide-react";
import { LandingNav } from "../components/landing/LandingNav";
import { LandingFooter } from "../components/landing/LandingFooter";

interface Integration {
  id: string;
  name: string;
  description: string;
  initials: string;
  color: string;
  category: string;
  popular?: boolean;
}

const INTEGRATIONS: Integration[] = [
  { id: "gcal",       name: "Google Calendar",   description: "Two-way sync your Google Calendar availability.",      initials: "GC", color: "#4285F4", category: "Calendar",   popular: true },
  { id: "outlook",    name: "Outlook Calendar",  description: "Connect Microsoft Outlook and Office 365 calendars.",  initials: "OL", color: "#0078D4", category: "Calendar"              },
  { id: "apple",      name: "Apple iCal",        description: "Sync with iCloud Calendar and Apple Calendar app.",    initials: "iC", color: "#C0C0C0", category: "Calendar"              },
  { id: "gmeet",      name: "Google Meet",       description: "Auto-generate a Meet link for every new booking.",     initials: "GM", color: "#00AC47", category: "Video",     popular: true },
  { id: "zoom",       name: "Zoom",              description: "Create Zoom meetings automatically on confirmation.",   initials: "ZM", color: "#2D8CFF", category: "Video",     popular: true },
  { id: "msteams",    name: "Microsoft Teams",   description: "Generate Teams meeting links for your bookings.",      initials: "MT", color: "#5059C9", category: "Video"                 },
  { id: "stripe",     name: "Stripe",            description: "Collect payment or deposits before confirming.",       initials: "ST", color: "#635BFF", category: "Payments",  popular: true },
  { id: "paypal",     name: "PayPal",            description: "Accept PayPal and card payments at booking.",          initials: "PP", color: "#003087", category: "Payments"              },
  { id: "zapier",     name: "Zapier",            description: "Connect Schedulr to 5,000+ apps via Zapier.",          initials: "ZP", color: "#FF4A00", category: "Automation", popular: true },
  { id: "slack",      name: "Slack",             description: "Get notified in Slack when a new booking is made.",    initials: "SL", color: "#4A154B", category: "Notifications"         },
  { id: "notion",     name: "Notion",            description: "Log bookings as Notion database entries automatically.",initials: "NO", color: "#FFFFFF", category: "Productivity"         },
  { id: "hubspot",    name: "HubSpot CRM",       description: "Sync contacts and deals from your booking data.",      initials: "HS", color: "#FF7A59", category: "CRM"                  },
  { id: "mailchimp",  name: "Mailchimp",         description: "Add new clients to Mailchimp lists on booking.",       initials: "MC", color: "#FFE01B", category: "Email"                },
  { id: "webhooks",   name: "Webhooks",          description: "Send real-time event data to any endpoint you choose.",initials: "WH", color: "#E8593C", category: "Developer",  popular: true },
  { id: "linear",     name: "Linear",            description: "Create Linear issues from booking-related actions.",   initials: "LN", color: "#5E6AD2", category: "Productivity"         },
];

const CATEGORIES = ["All", "Calendar", "Video", "Payments", "Automation", "CRM", "Email", "Notifications", "Productivity", "Developer"];

export function PublicIntegrations() {
  const navigate = useNavigate();
  const [connected, setConnected] = useState<Set<string>>(new Set(["gcal", "gmeet"]));
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = INTEGRATIONS.filter((i) => {
    if (activeCategory !== "All" && i.category !== activeCategory) return false;
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggle = (id: string) => {
    setConnected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "#0F0F11", color: "#F4F2EE", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Ambient */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse at 70% 10%, rgba(232,89,60,0.05) 0%, transparent 55%)",
        }}
      />

      <LandingNav />

      {/* Hero */}
      <section
        className="relative z-10 px-6 md:px-12 py-20 md:py-28 text-center"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-6"
          style={{ background: "rgba(232,89,60,0.1)", color: "#E8593C", border: "1px solid rgba(232,89,60,0.2)", fontFamily: "'DM Mono', monospace" }}
        >
          INTEGRATIONS
        </div>
        <h1
          className="mx-auto mb-4"
          style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2.4rem, 5vw, 4rem)", fontWeight: 700, color: "#F4F2EE", lineHeight: 1.1, maxWidth: 680 }}
        >
          Connect the tools you already use.
        </h1>
        <p
          className="text-lg mx-auto mb-10"
          style={{ color: "#8A8882", maxWidth: 520, lineHeight: 1.6 }}
        >
          Schedulr plugs into your entire workflow — no manual data entry, ever.
        </p>

        {/* Search */}
        <div
          className="flex items-center gap-2 mx-auto rounded-xl px-4 py-3 max-w-md"
          style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="5.5" cy="5.5" r="4" stroke="#4A4946" strokeWidth="1.5" />
            <path d="M9 9l3 3" stroke="#4A4946" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search integrations…"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "#F4F2EE" }}
          />
        </div>
      </section>

      {/* Category filters */}
      <div
        className="relative z-10 px-6 md:px-12 py-4 flex items-center gap-2 overflow-x-auto"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="flex-shrink-0 px-3 py-1.5 rounded-lg text-sm transition-all"
            style={{
              background: activeCategory === cat ? "rgba(232,89,60,0.1)" : "rgba(255,255,255,0.03)",
              color: activeCategory === cat ? "#F4F2EE" : "#8A8882",
              border: `1px solid ${activeCategory === cat ? "rgba(232,89,60,0.25)" : "rgba(255,255,255,0.07)"}`,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Integration grid */}
      <section className="relative z-10 px-6 md:px-12 py-12 max-w-[1400px] mx-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
              No integrations found for "{search}"
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((integration) => {
              const isConnected = connected.has(integration.id);
              return (
                <div
                  key={integration.id}
                  className="relative rounded-2xl p-6 transition-all"
                  style={{
                    background: isConnected ? "rgba(46,204,138,0.04)" : "#161618",
                    border: `1px solid ${isConnected ? "rgba(46,204,138,0.2)" : "rgba(255,255,255,0.07)"}`,
                  }}
                  onMouseEnter={(e) => {
                    if (!isConnected) {
                      (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.14)";
                      (e.currentTarget as HTMLElement).style.background = "#1E1E21";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isConnected) {
                      (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.07)";
                      (e.currentTarget as HTMLElement).style.background = "#161618";
                    }
                  }}
                >
                  {integration.popular && !isConnected && (
                    <div
                      className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded"
                      style={{ background: "rgba(232,89,60,0.1)", color: "#E8593C", fontFamily: "'DM Mono', monospace", fontSize: 9 }}
                    >
                      POPULAR
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className="flex items-center justify-center rounded-xl text-sm mb-4 flex-shrink-0"
                    style={{
                      width: 48,
                      height: 48,
                      background: isConnected ? (integration.color + "18") : "rgba(255,255,255,0.04)",
                      color: isConnected ? integration.color : "#4A4946",
                      fontFamily: "'DM Mono', monospace",
                      border: `1px solid ${isConnected ? integration.color + "33" : "rgba(255,255,255,0.08)"}`,
                      filter: isConnected ? "none" : "grayscale(100%)",
                    }}
                  >
                    {integration.initials}
                  </div>

                  {/* Name + category */}
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <div className="text-sm" style={{ color: "#F4F2EE" }}>
                        {integration.name}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
                        {integration.category}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm mb-5" style={{ color: "#8A8882", lineHeight: 1.5 }}>
                    {integration.description}
                  </p>

                  {/* Button */}
                  <button
                    onClick={() => toggle(integration.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all"
                    style={
                      isConnected
                        ? { background: "rgba(46,204,138,0.1)", color: "#2ECC8A", border: "1px solid rgba(46,204,138,0.2)" }
                        : { background: "#E8593C", color: "white" }
                    }
                    onMouseEnter={(e) => {
                      if (!isConnected) (e.currentTarget as HTMLElement).style.background = "#FF6B47";
                    }}
                    onMouseLeave={(e) => {
                      if (!isConnected) (e.currentTarget as HTMLElement).style.background = "#E8593C";
                    }}
                  >
                    {isConnected ? (
                      <>
                        <Check size={13} strokeWidth={2} />
                        Connected
                      </>
                    ) : (
                      "Connect"
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA banner */}
      <section className="relative z-10 px-6 md:px-12 py-12 max-w-[1400px] mx-auto">
        <div
          className="rounded-2xl px-8 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ background: "#1E1E21", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div>
            <h2
              className="mb-2"
              style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 600, color: "#F4F2EE" }}
            >
              Don't see your tool?
            </h2>
            <p className="text-sm" style={{ color: "#8A8882" }}>
              Use Webhooks or Zapier to connect anything — all 5,000+ Zapier apps, any REST API.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => navigate("/signup")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all"
              style={{ background: "#E8593C", color: "white" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#FF6B47")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#E8593C")}
            >
              <Webhook size={14} strokeWidth={1.5} />
              Explore Webhooks
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-5 py-2.5 rounded-xl text-sm transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.14)", color: "#F4F2EE", background: "transparent" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              Browse Zapier →
            </button>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
