import { useState } from "react";
import { Check, ExternalLink, RefreshCw } from "lucide-react";

const INTEGRATIONS = [
  {
    id: "gcal",
    name: "Google Calendar",
    desc: "Two-way sync with your Google calendar.",
    connected: true,
    category: "calendar",
    color: "#4B9EFF",
    abbr: "GC",
  },
  {
    id: "outlook",
    name: "Outlook Calendar",
    desc: "Sync with Microsoft Outlook and Exchange.",
    connected: true,
    category: "calendar",
    color: "#0078D4",
    abbr: "OL",
  },
  {
    id: "gmeet",
    name: "Google Meet",
    desc: "Auto-generate Meet links for every booking.",
    connected: true,
    category: "video",
    color: "#2ECC8A",
    abbr: "GM",
  },
  {
    id: "stripe",
    name: "Stripe",
    desc: "Collect payments and deposits at booking.",
    connected: true,
    category: "payments",
    color: "#635BFF",
    abbr: "ST",
  },
  {
    id: "zoom",
    name: "Zoom",
    desc: "Create Zoom meetings automatically.",
    connected: false,
    category: "video",
    color: "#2D8CFF",
    abbr: "ZM",
  },
  {
    id: "ical",
    name: "Apple iCal",
    desc: "Subscribe to your calendar via iCal URL.",
    connected: false,
    category: "calendar",
    color: "#8A8882",
    abbr: "iC",
  },
  {
    id: "paypal",
    name: "PayPal",
    desc: "Accept PayPal payments at checkout.",
    connected: false,
    category: "payments",
    color: "#003087",
    abbr: "PP",
  },
  {
    id: "zapier",
    name: "Zapier",
    desc: "Automate anything with 5,000+ app connections.",
    connected: false,
    category: "automation",
    color: "#FF4A00",
    abbr: "ZP",
  },
  {
    id: "slack",
    name: "Slack",
    desc: "Get notified in Slack when someone books.",
    connected: false,
    category: "notifications",
    color: "#4A154B",
    abbr: "SL",
  },
  {
    id: "notion",
    name: "Notion",
    desc: "Log every booking to a Notion database.",
    connected: false,
    category: "productivity",
    color: "#F4F2EE",
    abbr: "NT",
  },
  {
    id: "hubspot",
    name: "HubSpot CRM",
    desc: "Create CRM contacts from every new booking.",
    connected: false,
    category: "crm",
    color: "#FF7A59",
    abbr: "HS",
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    desc: "Add guests to your email lists automatically.",
    connected: false,
    category: "email",
    color: "#FFE01B",
    abbr: "MC",
  },
  {
    id: "webhooks",
    name: "Webhooks",
    desc: "Send booking events to any custom endpoint.",
    connected: false,
    category: "developer",
    color: "#E8593C",
    abbr: "WH",
  },
];

export function Integrations() {
  const [integrations, setIntegrations] = useState(INTEGRATIONS);

  const toggle = (id: string) => {
    setIntegrations(prev =>
      prev.map(i => (i.id === id ? { ...i, connected: !i.connected } : i))
    );
  };

  const connected = integrations.filter(i => i.connected);
  const notConnected = integrations.filter(i => !i.connected);

  return (
    <div className="min-h-[calc(100vh-48px)] p-6 md:p-8" style={{ background: "#0F0F11" }}>
      {/* Header */}
      <div className="mb-8">
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "2rem",
            fontWeight: 600,
            color: "#F4F2EE",
            lineHeight: 1.2,
            marginBottom: 8,
          }}
        >
          Connect your tools
        </h1>
        <p className="text-sm" style={{ color: "#8A8882" }}>
          {connected.length} of {integrations.length} integrations connected
        </p>
      </div>

      {/* Connected section */}
      {connected.length > 0 && (
        <div className="mb-10">
          <div
            className="flex items-center gap-2 mb-4 text-xs"
            style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#2ECC8A" }} />
            CONNECTED ({connected.length})
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connected.map(int => (
              <IntegrationCard key={int.id} integration={int} onToggle={() => toggle(int.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Not connected */}
      <div>
        <div
          className="text-xs mb-4"
          style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
        >
          AVAILABLE ({notConnected.length})
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notConnected.map(int => (
            <IntegrationCard key={int.id} integration={int} onToggle={() => toggle(int.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function IntegrationCard({
  integration,
  onToggle,
}: {
  integration: (typeof INTEGRATIONS)[0];
  onToggle: () => void;
}) {
  const { name, desc, connected, color, abbr } = integration;

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4 transition-all"
      style={{
        background: "#161618",
        border: connected
          ? `1px solid rgba(46,204,138,0.2)`
          : "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Logo */}
      <div className="flex items-start justify-between">
        <div
          className="flex items-center justify-center rounded-xl text-sm font-medium"
          style={{
            width: 48,
            height: 48,
            background: connected ? color + "22" : "#1E1E21",
            color: connected ? color : "#8A8882",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.8rem",
            border: connected ? `1px solid ${color}33` : "1px solid rgba(255,255,255,0.07)",
            transition: "all 0.2s",
          }}
        >
          {abbr}
        </div>
        {connected && (
          <div
            className="flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(46,204,138,0.1)",
              color: "#2ECC8A",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            <Check size={10} strokeWidth={2.5} />
            Connected
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <div className="text-sm mb-1" style={{ color: "#F4F2EE" }}>{name}</div>
        <div className="text-xs" style={{ color: "#8A8882", lineHeight: 1.5 }}>{desc}</div>
      </div>

      {/* Action */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm transition-all"
        style={
          connected
            ? {
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#8A8882",
                background: "transparent",
              }
            : {
                background: "#E8593C",
                color: "white",
              }
        }
        onMouseEnter={(e) => {
          if (!connected) (e.currentTarget as HTMLElement).style.background = "#FF6B47";
        }}
        onMouseLeave={(e) => {
          if (!connected) (e.currentTarget as HTMLElement).style.background = "#E8593C";
        }}
      >
        {connected ? (
          <>
            <RefreshCw size={13} strokeWidth={1.5} />
            Manage
          </>
        ) : (
          <>
            <ExternalLink size={13} strokeWidth={1.5} />
            Connect
          </>
        )}
      </button>
    </div>
  );
}
