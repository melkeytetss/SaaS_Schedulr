import { Outlet, NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard, CalendarDays, CalendarCheck, Clock,
  Plug2, Bell, BarChart2, Settings, ChevronDown,
  Zap, LogOut
} from "lucide-react";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard",   to: "/app/dashboard"    },
  { icon: CalendarDays,    label: "Event Types", to: "/app/events"       },
  { icon: CalendarCheck,   label: "Bookings",    to: "/app/bookings"     },
  { icon: Clock,           label: "Availability",to: "/app/availability" },
  { icon: Plug2,           label: "Integrations",to: "/app/integrations" },
  { icon: Bell,            label: "Reminders",   to: "/app/reminders"    },
  { icon: BarChart2,       label: "Analytics",   to: "/app/analytics"    },
  { icon: Settings,        label: "Settings",    to: "/app/settings"     },
];

export function AppShell() {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: "#0F0F11", color: "#F4F2EE" }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col flex-shrink-0 h-full"
        style={{
          width: 220,
          background: "#161618",
          borderRight: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Workspace */}
        <div
          className="flex items-center gap-3 px-4 py-4 cursor-pointer group"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div
            className="flex items-center justify-center rounded-lg text-white text-sm font-medium"
            style={{ width: 32, height: 32, background: "#E8593C", fontFamily: "'DM Mono', monospace" }}
          >
            M
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm truncate" style={{ color: "#F4F2EE" }}>Marcus Studio</div>
            <div className="text-xs truncate" style={{ color: "#4A4946" }}>Pro plan</div>
          </div>
          <ChevronDown size={14} style={{ color: "#4A4946" }} />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto">
          {NAV.map(({ icon: Icon, label, to }) => (
            <NavLink key={to} to={to} end={to === "/app/dashboard"}>
              {({ isActive }) => (
                <div
                  className="flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 cursor-pointer transition-colors relative group"
                  style={{
                    background: isActive ? "rgba(232,89,60,0.08)" : "transparent",
                    color: isActive ? "#F4F2EE" : "#8A8882",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {isActive && (
                    <div
                      className="absolute left-0 top-1 bottom-1 rounded-full"
                      style={{ width: 3, background: "#E8593C" }}
                    />
                  )}
                  <Icon size={16} strokeWidth={1.5} style={{ color: isActive ? "#E8593C" : "#8A8882" }} />
                  <span className="text-sm">{label}</span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-2 pb-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-2 px-3 pt-3 mb-2">
            <div
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
              style={{ background: "rgba(232,89,60,0.15)", color: "#E8593C", fontFamily: "'DM Mono', monospace" }}
            >
              PRO
            </div>
            <span className="text-xs" style={{ color: "#4A4946" }}>Active</span>
          </div>
          <div
            className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer"
            style={{ color: "#8A8882" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div
              className="flex items-center justify-center rounded-full text-xs"
              style={{ width: 28, height: 28, background: "#1E1E21", color: "#F4F2EE", fontFamily: "'DM Mono', monospace" }}
            >
              MK
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm truncate" style={{ color: "#F4F2EE" }}>Marcus K.</div>
            </div>
            <LogOut size={14} strokeWidth={1.5} />
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto h-full">
        <div
          className="fixed top-0 right-0 z-10 flex items-center gap-4 px-6 py-3"
          style={{
            left: 220,
            background: "rgba(15,15,17,0.8)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="flex-1" />
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: "#8A8882", background: "rgba(255,255,255,0.04)" }}
          >
            <Zap size={14} strokeWidth={1.5} style={{ color: "#E8593C" }} />
            View booking page
          </button>
        </div>
        <div className="pt-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}