import { Outlet, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard, Users, CreditCard, Activity,
  Mail, Settings, Shield, LogOut,
} from "lucide-react";

const NAV = [
  { icon: LayoutDashboard, label: "Overview",       hash: "overview"       },
  { icon: Users,           label: "Tenants",         hash: "tenants"        },
  { icon: CreditCard,      label: "Subscriptions",   hash: "subscriptions"  },
  { icon: Activity,        label: "Usage",           hash: "usage"          },
  { icon: Mail,            label: "Email Logs",      hash: "emails"         },
  { icon: Settings,        label: "System Settings", hash: "settings"       },
];

export function AdminShell() {
  const location = useLocation();
  const navigate = useNavigate();

  // Derive active hash — default to "overview" if none set
  const rawHash = location.hash.replace("#", "") || "overview";
  const activeHash = NAV.some((n) => n.hash === rawHash) ? rawHash : "overview";

  const goTo = (hash: string) => navigate(`/admin#${hash}`);

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ background: "#0F0F11", color: "#F4F2EE" }}
    >
      {/* ── Sidebar ── */}
      <aside
        className="flex flex-col flex-shrink-0 h-full"
        style={{
          width: 220,
          background: "#161618",
          borderRight: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Brand */}
        <div
          className="flex items-center gap-3 px-4 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div
            className="flex items-center justify-center rounded-lg"
            style={{ width: 32, height: 32, background: "#E8593C" }}
          >
            <Shield size={16} color="white" strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-sm" style={{ color: "#F4F2EE" }}>Admin Console</div>
            <div
              className="text-xs"
              style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
            >
              schedulr.io
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto">
          {NAV.map(({ icon: Icon, label, hash }) => {
            const isActive = activeHash === hash;
            return (
              <button
                key={hash}
                onClick={() => goTo(hash)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 text-sm text-left transition-colors relative"
                style={{
                  background: isActive ? "rgba(232,89,60,0.08)" : "transparent",
                  color: isActive ? "#F4F2EE" : "#8A8882",
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                {isActive && (
                  <div
                    className="absolute left-0 top-1 bottom-1 rounded-full"
                    style={{ width: 3, background: "#E8593C" }}
                  />
                )}
                <Icon
                  size={15}
                  strokeWidth={1.5}
                  style={{ color: isActive ? "#E8593C" : "#8A8882", flexShrink: 0 }}
                />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Admin badge */}
        <div
          className="px-4 py-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div
            className="text-xs"
            style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
          >
            SUPER ADMIN
          </div>
          <div className="text-xs mt-0.5" style={{ color: "#4A4946" }}>
            ops@schedulr.io
          </div>
        </div>

        {/* Divider + Log out */}
        <div
          className="px-2 pb-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-all mt-1"
            style={{ color: "#9B3B3A", background: "transparent" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(226,75,74,0.07)";
              (e.currentTarget as HTMLElement).style.color = "#E24B4A";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "#9B3B3A";
            }}
          >
            <LogOut size={16} strokeWidth={1.5} style={{ flexShrink: 0 }} />
            Log out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto h-full">
        <Outlet />
      </main>
    </div>
  );
}
