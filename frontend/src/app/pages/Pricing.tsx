import { useState } from "react";
import { useNavigate } from "react-router";
import { Check, ChevronDown, ChevronUp, Zap, ArrowLeft } from "lucide-react";

const PLANS = [
  {
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    desc: "For individuals getting started.",
    features: [
      "3 event types",
      "Booking widget embed",
      "Email reminders",
      "1 calendar connection",
      "Schedulr branding on booking page",
      "Basic analytics",
    ],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    monthlyPrice: 12,
    yearlyPrice: 10,
    desc: "For professionals who mean business.",
    badge: "Most popular",
    features: [
      "Everything in Free",
      "Unlimited event types",
      "Custom domain",
      "Remove Schedulr branding",
      "Payment collection (Stripe)",
      "Priority email support",
      "Advanced analytics",
      "Redirect after booking",
    ],
    cta: "Start Pro",
    highlight: true,
  },
  {
    name: "Team",
    monthlyPrice: 49,
    yearlyPrice: 40,
    desc: "For teams that move together.",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Round-robin scheduling",
      "Collective event types",
      "Admin panel",
      "White-label (incl. emails)",
      "API access",
      "Dedicated support",
    ],
    cta: "Start Team",
    highlight: false,
  },
];

const FAQS = [
  {
    q: "Can I change plans at any time?",
    a: "Yes. You can upgrade or downgrade at any time. If you upgrade, you'll be prorated immediately. If you downgrade, the change takes effect at the end of your billing period.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards via Stripe. Annual plans can also be paid by invoice for Team tier.",
  },
  {
    q: "Is there a free trial for Pro?",
    a: "Every account starts on a Free plan with no trial limits. You can upgrade to Pro at any time without needing to enter a credit card first.",
  },
  {
    q: "What does 'white-label' mean exactly?",
    a: "On the Team plan, all Schedulr branding is removed — including from booking pages, confirmation emails, and reminder notifications. Your guests will only ever see your brand.",
  },
  {
    q: "Can I connect multiple calendars?",
    a: "Free plans support 1 calendar connection. Pro and Team plans support unlimited calendar connections across Google, Outlook, and Apple.",
  },
  {
    q: "What happens when I hit the 3 event type limit on Free?",
    a: "You can still receive bookings on existing event types, but you won't be able to create new ones until you upgrade or archive existing ones.",
  },
];

export function Pricing() {
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div
      className="min-h-screen"
      style={{ background: "#0F0F11", color: "#F4F2EE", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Nav */}
      <nav
        className="flex items-center px-6 md:px-12 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm"
          style={{ color: "#8A8882" }}
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          Back
        </button>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{ width: 28, height: 28, background: "#E8593C" }}
            >
              <Zap size={14} color="white" strokeWidth={1.5} />
            </div>
            <span
              style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", color: "#F4F2EE" }}
            >
              Schedulr
            </span>
          </div>
        </div>
        <button
          onClick={() => navigate("/app/dashboard")}
          className="text-sm px-4 py-1.5 rounded-lg"
          style={{ background: "#E8593C", color: "white" }}
        >
          Get started
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 700,
              color: "#F4F2EE",
              lineHeight: 1.0,
              marginBottom: 16,
            }}
          >
            Simple pricing.
            <br />
            <span style={{ color: "#E8593C", fontStyle: "italic" }}>No surprises.</span>
          </h1>
          <p className="text-base mb-8" style={{ color: "#8A8882" }}>
            Start free. Scale when you're ready.
          </p>

          {/* Toggle */}
          <div
            className="inline-flex items-center rounded-xl p-1 gap-1"
            style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <button
              onClick={() => setAnnual(false)}
              className="px-4 py-2 rounded-lg text-sm transition-all"
              style={{
                background: !annual ? "#1E1E21" : "transparent",
                color: !annual ? "#F4F2EE" : "#8A8882",
                border: !annual ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className="px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2"
              style={{
                background: annual ? "#1E1E21" : "transparent",
                color: annual ? "#F4F2EE" : "#8A8882",
                border: annual ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
              }}
            >
              Annual
              <span
                className="text-xs px-1.5 py-0.5 rounded"
                style={{
                  background: "rgba(232,89,60,0.15)",
                  color: "#E8593C",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                2 months free
              </span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-20">
          {PLANS.map((plan) => {
            const price = annual ? plan.yearlyPrice : plan.monthlyPrice;
            const originalPrice = plan.monthlyPrice;

            return (
              <div
                key={plan.name}
                className="rounded-2xl p-6 flex flex-col relative"
                style={{
                  background: plan.highlight ? "rgba(232,89,60,0.05)" : "#161618",
                  border: plan.highlight
                    ? "1px solid rgba(232,89,60,0.35)"
                    : "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {plan.badge && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full"
                    style={{
                      background: "#E8593C",
                      color: "white",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {plan.badge}
                  </div>
                )}

                <div className="mb-5">
                  <div className="text-sm mb-1" style={{ color: "#F4F2EE" }}>
                    {plan.name}
                  </div>
                  <div className="text-xs mb-4" style={{ color: "#8A8882" }}>
                    {plan.desc}
                  </div>
                  <div className="flex items-end gap-2">
                    {annual && originalPrice > 0 && (
                      <span
                        className="text-sm line-through"
                        style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
                      >
                        ${originalPrice}
                      </span>
                    )}
                    <span
                      style={{
                        fontFamily: "'Fraunces', serif",
                        fontSize: "2.5rem",
                        fontWeight: 700,
                        color: "#F4F2EE",
                        lineHeight: 1,
                      }}
                    >
                      ${price}
                    </span>
                    {price > 0 && (
                      <span
                        className="text-sm mb-1"
                        style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace" }}
                      >
                        /mo
                      </span>
                    )}
                  </div>
                  {annual && price > 0 && (
                    <div
                      className="text-xs mt-1"
                      style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
                    >
                      billed ${price * 12}/year
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate("/app/dashboard")}
                  className="w-full py-3 rounded-xl text-sm font-medium mb-6 transition-all"
                  style={
                    plan.highlight
                      ? { background: "#E8593C", color: "white" }
                      : {
                          border: "1px solid rgba(255,255,255,0.14)",
                          color: "#F4F2EE",
                          background: "transparent",
                        }
                  }
                  onMouseEnter={(e) => {
                    if (plan.highlight)
                      (e.currentTarget as HTMLElement).style.background = "#FF6B47";
                    else
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(255,255,255,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    if (plan.highlight)
                      (e.currentTarget as HTMLElement).style.background = "#E8593C";
                    else
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {plan.cta}
                </button>

                <div className="flex flex-col gap-3 flex-1">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5">
                      <Check
                        size={14}
                        strokeWidth={2}
                        className="flex-shrink-0 mt-0.5"
                        style={{
                          color: plan.highlight ? "#E8593C" : "#2ECC8A",
                        }}
                      />
                      <span className="text-sm" style={{ color: "#8A8882" }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-center mb-8"
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "1.75rem",
              fontWeight: 600,
              color: "#F4F2EE",
            }}
          >
            Frequently asked questions
          </h2>

          <div className="flex flex-col gap-2">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden"
                style={{
                  background: "#161618",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm pr-4" style={{ color: "#F4F2EE" }}>
                    {faq.q}
                  </span>
                  {openFaq === i ? (
                    <ChevronUp
                      size={16}
                      strokeWidth={1.5}
                      className="flex-shrink-0"
                      style={{ color: "#E8593C" }}
                    />
                  ) : (
                    <ChevronDown
                      size={16}
                      strokeWidth={1.5}
                      className="flex-shrink-0"
                      style={{ color: "#4A4946" }}
                    />
                  )}
                </button>
                {openFaq === i && (
                  <div
                    className="px-5 pb-4 text-sm"
                    style={{ color: "#8A8882", lineHeight: 1.7 }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="px-6 md:px-12 py-6 text-center"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <p
          className="text-xs"
          style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
        >
          © 2026 Schedulr, Inc. · All prices in USD.
        </p>
      </footer>
    </div>
  );
}
