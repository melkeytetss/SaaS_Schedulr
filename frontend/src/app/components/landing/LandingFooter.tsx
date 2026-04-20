import { useNavigate } from "react-router";
import { Zap } from "lucide-react";

const FOOTER_COLS = [
  {
    heading: "Product",
    links: [
      { label: "Features",      to: "/features"      },
      { label: "Pricing",       to: "/pricing"       },
      { label: "Integrations",  to: "/integrations"  },
      { label: "Changelog",     to: "#"              },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About",   to: "#" },
      { label: "Blog",    to: "/blog" },
      { label: "Careers", to: "#" },
      { label: "Press",   to: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy",  to: "#" },
      { label: "Terms",    to: "#" },
      { label: "Security", to: "#" },
      { label: "Cookies",  to: "#" },
    ],
  },
];

export function LandingFooter() {
  const navigate = useNavigate();
  return (
    <footer
      className="relative z-10 px-6 md:px-12 py-10"
      style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "#0F0F11" }}
    >
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div
              className="flex items-center justify-center rounded"
              style={{ width: 24, height: 24, background: "#E8593C" }}
            >
              <Zap size={12} color="white" strokeWidth={1.5} />
            </div>
            <span className="text-sm" style={{ fontFamily: "'Fraunces', serif", color: "#F4F2EE" }}>
              Schedulr
            </span>
          </div>
          <p className="text-xs" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
            For professionals who care how things look.
          </p>
        </div>

        <div className="flex flex-wrap gap-8">
          {FOOTER_COLS.map((col) => (
            <div key={col.heading}>
              <div className="text-xs mb-3" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
                {col.heading}
              </div>
              {col.links.map((link) => (
                <div key={link.label} className="mb-2">
                  <button
                    onClick={() => link.to !== "#" && navigate(link.to)}
                    className="text-xs transition-colors hover:text-white text-left"
                    style={{ color: "#8A8882" }}
                  >
                    {link.label}
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div
        className="max-w-[1400px] mx-auto mt-10 pt-6 flex items-center justify-between"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <p className="text-xs" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
          © 2026 Schedulr, Inc.
        </p>
        <p className="text-xs" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
          Made for the serious ones.
        </p>
      </div>
    </footer>
  );
}
