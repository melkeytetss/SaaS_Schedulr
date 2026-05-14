import { Outlet, NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard, CalendarDays, CalendarCheck, Clock,
  Plug2, Bell, BarChart2, Settings, ChevronDown,
  Zap, LogOut, X
} from "lucide-react";
import { useState } from "react";
import { useMyProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";

function getInitials(name: string) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function LogoutModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(15,15,17,0.8)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl flex flex-col overflow-hidden"
        style={{
          background: "#161618",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-5 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "1.2rem",
              fontWeight: 600,
              color: "#F4F2EE",
            }}
          >
            Confirm Logout
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg transition-colors"
            style={{
              width: 32,
              height: 32,
              background: "rgba(255,255,255,0.06)",
              color: "#8A8882",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.06)")
            }
          >
            <X size={14} strokeWidth={1.5} />
          </button>
        </div>

        <div className="px-6 py-6 text-sm" style={{ color: "#8A8882" }}>
          Are you sure you want to log out of your account?
        </div>

        <div
          className="px-6 py-4 flex gap-3"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all"
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#F4F2EE",
              background: "transparent",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all"
            style={{ background: "#E8593C", color: "white" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#FF6B47")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "#E8593C")
            }
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

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
  const { data: profile } = useMyProfile();
  const { signOut } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const displayName = profile?.full_name || profile?.username || "My Workspace";
  const workspaceInitial = displayName.charAt(0).toUpperCase();
  const userInitials = getInitials(displayName);

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
            className="flex items-center justify-center rounded-lg text-white text-sm font-medium flex-shrink-0 overflow-hidden"
            style={{ width: 32, height: 32, background: "#E8593C", fontFamily: "'DM Mono', monospace" }}
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Workspace Avatar" className="w-full h-full object-cover" />
            ) : (
              workspaceInitial
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm truncate" style={{ color: "#F4F2EE" }}>{displayName}</div>
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
            onClick={() => setShowLogoutModal(true)}
          >
            <div
              className="flex items-center justify-center rounded-full text-xs flex-shrink-0 overflow-hidden"
              style={{ width: 28, height: 28, background: "#1E1E21", color: "#F4F2EE", fontFamily: "'DM Mono', monospace" }}
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                userInitials
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm truncate" style={{ color: "#F4F2EE" }}>{displayName}</div>
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
            onClick={() => navigate(`/${profile?.username || ""}`)}
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

      {showLogoutModal && (
        <LogoutModal
          onClose={() => setShowLogoutModal(false)}
          onConfirm={() => {
            setShowLogoutModal(false);
            signOut();
          }}
        />
      )}
    </div>
  );
}
