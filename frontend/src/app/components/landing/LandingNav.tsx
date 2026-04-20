import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Zap, Menu, X } from "lucide-react";

interface NavItem {
  label: string;
  to: string;
  scrollId?: string; // if set, and we're on "/", scroll instead of navigate
}

const NAV_ITEMS: NavItem[] = [
  { label: "Features",     to: "/features",     scrollId: "features"     },
  { label: "Integrations", to: "/integrations"                           },
  { label: "Pricing",      to: "/pricing"                                },
  { label: "Blog",         to: "/blog"                                    },
];

export function LandingNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (to: string) => location.pathname === to;

  const handleNav = (item: NavItem) => {
    setOpen(false);
    if (item.scrollId && location.pathname === "/") {
      document.getElementById(item.scrollId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(item.to);
    }
  };

  return (
    <>
      <nav
        className="relative z-50 flex items-center px-6 py-4 md:px-12"
        style={{
          background: "#0F0F11",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 flex-1"
        >
          <div
            className="flex items-center justify-center rounded-lg"
            style={{ width: 32, height: 32, background: "#E8593C" }}
          >
            <Zap size={16} color="white" strokeWidth={1.5} />
          </div>
          <span
            className="text-lg tracking-tight"
            style={{ fontFamily: "'Fraunces', serif", color: "#F4F2EE" }}
          >
            Schedulr
          </span>
        </button>

        {/* Desktop center nav */}
        <div className="hidden md:flex items-center gap-7 flex-1 justify-center">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNav(item)}
              className="text-sm transition-colors"
              style={{
                color: isActive(item.to) ? "#F4F2EE" : "#8A8882",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#F4F2EE")}
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = isActive(item.to) ? "#F4F2EE" : "#8A8882")
              }
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Desktop right auth */}
        <div className="hidden md:flex items-center gap-3 flex-1 justify-end">
          <button
            onClick={() => navigate("/signin")}
            className="text-sm px-4 py-2 rounded-lg transition-colors"
            style={{ color: "#8A8882" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#F4F2EE")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#8A8882")}
          >
            Sign in
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="text-sm px-4 py-2 rounded-lg transition-all"
            style={{ background: "#E8593C", color: "white" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#FF6B47")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#E8593C")}
          >
            Start free
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setOpen((o) => !o)}
          style={{ color: "#8A8882" }}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div
          className="relative z-40 px-6 py-5 flex flex-col gap-3 md:hidden"
          style={{ background: "#161618", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNav(item)}
              className="text-sm text-left py-1"
              style={{ color: "#8A8882" }}
            >
              {item.label}
            </button>
          ))}
          <div
            className="my-1"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          />
          <button
            onClick={() => { setOpen(false); navigate("/signin"); }}
            className="text-sm text-left py-1"
            style={{ color: "#8A8882" }}
          >
            Sign in
          </button>
          <button
            onClick={() => { setOpen(false); navigate("/signup"); }}
            className="text-sm px-4 py-2.5 rounded-lg text-center transition-all"
            style={{ background: "#E8593C", color: "white" }}
          >
            Start free
          </button>
        </div>
      )}
    </>
  );
}
