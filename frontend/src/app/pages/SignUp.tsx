import { useState } from "react";
import { useNavigate } from "react-router";
import { Zap, Eye, EyeOff, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/useAuth";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C17.657 13.956 17.64 11.649 17.64 9.2z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function getStrength(pw: string): number {
  if (pw.length === 0) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["", "#E8593C", "#F0A429", "#4B9EFF", "#2ECC8A"];

export function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = getStrength(password);

  const handleCreate = async () => {
    if (!name || !email || !password) return;
    setLoading(true);
    try {
      await signUp(email, password, name);
      toast.success("Account created. Welcome to Schedulr!");
      navigate("/app/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign up failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: "#1E1E21",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#F4F2EE",
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    (e.currentTarget as HTMLElement).style.border = "1px solid rgba(232,89,60,0.5)";
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.1)";
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{
        background: "#0F0F11",
        color: "#F4F2EE",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Radial glow */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 z-0"
        style={{
          width: "80vw",
          height: "50vh",
          background: "radial-gradient(ellipse at 50% 0%, rgba(232,89,60,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 mx-auto mb-10 w-fit"
        >
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 38, height: 38, background: "#E8593C" }}
          >
            <Zap size={18} color="white" strokeWidth={1.5} />
          </div>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.3rem", color: "#F4F2EE" }}>
            Schedulr
          </span>
        </button>

        {/* Card */}
        <div
          className="w-full"
          style={{
            background: "#161618",
            border: "0.5px solid rgba(255,255,255,0.12)",
            borderRadius: 16,
            padding: 40,
            boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
          }}
        >
          <h1
            className="mb-1.5"
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "1.75rem",
              fontWeight: 600,
              color: "#F4F2EE",
              lineHeight: 1.2,
            }}
          >
            Create your account
          </h1>
          <p className="mb-8 text-sm" style={{ color: "#8A8882", lineHeight: 1.5 }}>
            Free forever. No credit card required.
          </p>

          {/* Full name */}
          <div className="mb-4">
            <label
              className="block text-xs mb-1.5"
              style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em" }}
            >
              FULL NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Marcus Kim"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          {/* Work email */}
          <div className="mb-4">
            <label
              className="block text-xs mb-1.5"
              style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em" }}
            >
              WORK EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          {/* Password + strength */}
          <div className="mb-6">
            <label
              className="block text-xs mb-1.5"
              style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em" }}
            >
              PASSWORD
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "#4A4946" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#8A8882")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#4A4946")}
              >
                {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
              </button>
            </div>

            {/* Strength indicator */}
            {password.length > 0 && (
              <div className="mt-2.5">
                <div className="flex gap-1 mb-1.5">
                  {[1, 2, 3, 4].map((seg) => (
                    <div
                      key={seg}
                      className="h-1 flex-1 rounded-full transition-all"
                      style={{
                        background: seg <= strength ? STRENGTH_COLORS[strength] : "rgba(255,255,255,0.08)",
                      }}
                    />
                  ))}
                </div>
                <div
                  className="text-xs"
                  style={{
                    color: STRENGTH_COLORS[strength],
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11,
                  }}
                >
                  {STRENGTH_LABELS[strength]}
                </div>
              </div>
            )}
          </div>

          {/* Create account */}
          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-medium transition-all mb-5"
            style={{
              background: loading ? "rgba(232,89,60,0.6)" : "#E8593C",
              color: "white",
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.background = "#FF6B47"; }}
            onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.background = "#E8593C"; }}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
            <span className="text-xs" style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
          </div>

          {/* Google */}
          <button
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm transition-all mb-6"
            style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#F4F2EE", background: "transparent" }}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "transparent"}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Sign in link */}
          <p className="text-center text-sm" style={{ color: "#4A4946" }}>
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="transition-colors"
              style={{ color: "#E8593C" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#FF6B47")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#E8593C")}
            >
              Sign in →
            </button>
          </p>
        </div>

        {/* Trust row */}
        <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
          {["✓ Free plan forever", "✓ No credit card", "✓ Cancel anytime"].map((item) => (
            <span
              key={item}
              className="text-xs"
              style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
