import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import { LandingNav } from "../components/landing/LandingNav";
import { LandingFooter } from "../components/landing/LandingFooter";

interface BlogPost {
  id: string;
  category: string;
  categoryColor: string;
  title: string;
  excerpt: string;
  author: string;
  authorInitials: string;
  authorColor: string;
  date: string;
  readTime: string;
  gradient: string;
  featured?: boolean;
}

const POSTS: BlogPost[] = [
  {
    id: "1",
    category: "TIPS",
    categoryColor: "#4B9EFF",
    title: "How to reduce no-shows by 73% with automated reminders",
    excerpt:
      "The single highest-impact thing you can do for your booking rate is fix the no-show problem. Here's how Schedulr's reminder sequences work — and the exact timing that performs best.",
    author: "Priya M.",
    authorInitials: "PM",
    authorColor: "#2ECC8A",
    date: "Apr 18, 2026",
    readTime: "6 min read",
    gradient: "linear-gradient(135deg, rgba(75,158,255,0.08) 0%, rgba(46,204,138,0.04) 100%)",
    featured: true,
  },
  {
    id: "2",
    category: "PRODUCT UPDATE",
    categoryColor: "#E8593C",
    title: "Introducing team scheduling: round-robin, pooled availability, and more",
    excerpt:
      "Today we're shipping the most-requested feature in Schedulr's history. Team scheduling is here — with round-robin rotation, collective availability, and host-specific routing rules.",
    author: "Marcus K.",
    authorInitials: "MK",
    authorColor: "#E8593C",
    date: "Apr 12, 2026",
    readTime: "4 min read",
    gradient: "linear-gradient(135deg, rgba(232,89,60,0.08) 0%, rgba(240,164,41,0.04) 100%)",
  },
  {
    id: "3",
    category: "CASE STUDY",
    categoryColor: "#2ECC8A",
    title: "From 0 to 200 bookings/month: How Clarity Coaching scaled without burning out",
    excerpt:
      "Sara built Clarity Coaching from a one-person operation to a 5-coach team in under a year. The secret weapon? A scheduling system that sells while she sleeps.",
    author: "Sarah L.",
    authorInitials: "SL",
    authorColor: "#4B9EFF",
    date: "Apr 7, 2026",
    readTime: "8 min read",
    gradient: "linear-gradient(135deg, rgba(46,204,138,0.08) 0%, rgba(75,158,255,0.04) 100%)",
  },
  {
    id: "4",
    category: "TIPS",
    categoryColor: "#4B9EFF",
    title: "The psychology of the booking page: what converts and what doesn't",
    excerpt:
      "After analyzing 80,000 booking page sessions, we found the design decisions that separate a 40% conversion rate from 80%. It's not what you think.",
    author: "Priya M.",
    authorInitials: "PM",
    authorColor: "#2ECC8A",
    date: "Mar 29, 2026",
    readTime: "10 min read",
    gradient: "linear-gradient(135deg, rgba(168,85,247,0.07) 0%, rgba(75,158,255,0.04) 100%)",
  },
  {
    id: "5",
    category: "PRODUCT UPDATE",
    categoryColor: "#E8593C",
    title: "April 2026 changelog: payment improvements, timezone fixes, new embed options",
    excerpt:
      "A packed release this month — Stripe payouts are now instant, timezone detection is smarter, and the widget now supports dark mode with zero extra configuration.",
    author: "Marcus K.",
    authorInitials: "MK",
    authorColor: "#E8593C",
    date: "Apr 1, 2026",
    readTime: "3 min read",
    gradient: "linear-gradient(135deg, rgba(232,89,60,0.05) 0%, rgba(22,22,24,0) 100%)",
  },
  {
    id: "6",
    category: "ENGINEERING",
    categoryColor: "#F0A429",
    title: "Why we rebuilt the calendar engine from scratch",
    excerpt:
      "Schedulr's v1 calendar engine was built in a weekend and held us back for 18 months. Here's the full story of how — and why — we rebuilt it from the ground up.",
    author: "Jake R.",
    authorInitials: "JR",
    authorColor: "#F0A429",
    date: "Mar 20, 2026",
    readTime: "12 min read",
    gradient: "linear-gradient(135deg, rgba(240,164,41,0.08) 0%, rgba(22,22,24,0) 100%)",
  },
];

const CATEGORIES = ["All", "TIPS", "PRODUCT UPDATE", "CASE STUDY", "ENGINEERING"];

export function BlogPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);

  const filtered = POSTS.filter(
    (p) => activeCategory === "All" || p.category === activeCategory
  );
  const visible = filtered.slice(0, visibleCount);

  return (
    <div
      className="min-h-screen"
      style={{ background: "#0F0F11", color: "#F4F2EE", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Ambient */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse at 30% 10%, rgba(232,89,60,0.05) 0%, transparent 55%)",
        }}
      />

      <LandingNav />

      {/* Hero */}
      <section
        className="relative z-10 px-6 md:px-12 py-20 md:py-28"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-6"
            style={{ background: "rgba(232,89,60,0.1)", color: "#E8593C", border: "1px solid rgba(232,89,60,0.2)", fontFamily: "'DM Mono', monospace" }}
          >
            BLOG
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1
                className="mb-4"
                style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2.4rem, 5vw, 4rem)", fontWeight: 700, color: "#F4F2EE", lineHeight: 1.1 }}
              >
                The Schedulr Blog
              </h1>
              <p className="text-lg" style={{ color: "#8A8882", maxWidth: 500, lineHeight: 1.6 }}>
                Scheduling tips, product updates, and stories from the community.
              </p>
            </div>
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-3 py-1.5 rounded-lg text-xs transition-all flex-shrink-0"
                  style={{
                    background: activeCategory === cat ? "rgba(232,89,60,0.1)" : "rgba(255,255,255,0.03)",
                    color: activeCategory === cat ? "#F4F2EE" : "#8A8882",
                    border: `1px solid ${activeCategory === cat ? "rgba(232,89,60,0.25)" : "rgba(255,255,255,0.07)"}`,
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured post (first card, full width) */}
      {activeCategory === "All" && visible[0] && (
        <section className="relative z-10 px-6 md:px-12 pt-12 max-w-[1400px] mx-auto">
          <div
            className="rounded-2xl overflow-hidden cursor-pointer transition-all group"
            style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}
            onClick={() => navigate("/blog")}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.14)"}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.07)"}
          >
            {/* Placeholder image — 16:9 wide */}
            <div
              className="w-full"
              style={{
                height: "clamp(180px, 30vw, 340px)",
                background: visible[0].gradient,
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Decorative pattern */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(232,89,60,0.06) 0%, transparent 40%)`,
                }}
              />
              <div
                className="absolute bottom-4 left-6 px-2 py-1 rounded text-xs"
                style={{ background: "rgba(0,0,0,0.4)", color: "#8A8882", fontFamily: "'DM Mono', monospace", backdropFilter: "blur(4px)" }}
              >
                FEATURED POST
              </div>
            </div>
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="text-xs px-2 py-0.5 rounded"
                  style={{ background: visible[0].categoryColor + "18", color: visible[0].categoryColor, fontFamily: "'DM Mono', monospace" }}
                >
                  {visible[0].category}
                </span>
                <span style={{ fontSize: 11, color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>{visible[0].readTime}</span>
              </div>
              <h2
                className="mb-3"
                style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 600, color: "#F4F2EE", lineHeight: 1.2 }}
              >
                {visible[0].title}
              </h2>
              <p className="text-base mb-5" style={{ color: "#8A8882", lineHeight: 1.6, maxWidth: 600 }}>
                {visible[0].excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center rounded-full text-xs"
                    style={{ width: 28, height: 28, background: visible[0].authorColor + "22", color: visible[0].authorColor, fontFamily: "'DM Mono', monospace" }}
                  >
                    {visible[0].authorInitials}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#F4F2EE" }}>{visible[0].author}</div>
                    <div style={{ fontSize: 10, color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>{visible[0].date}</div>
                  </div>
                </div>
                <div
                  className="flex items-center gap-1.5 text-sm transition-colors"
                  style={{ color: "#E8593C" }}
                >
                  Read article
                  <ArrowRight size={14} strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Grid of remaining posts */}
      <section className="relative z-10 px-6 md:px-12 py-12 max-w-[1400px] mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(activeCategory === "All" ? visible.slice(1) : visible).map((post) => (
            <article
              key={post.id}
              className="rounded-2xl overflow-hidden cursor-pointer transition-all flex flex-col"
              style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}
              onClick={() => navigate("/blog")}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.14)";
                (e.currentTarget as HTMLElement).style.background = "#1E1E21";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLElement).style.background = "#161618";
              }}
            >
              {/* Placeholder image 16:9 */}
              <div
                style={{
                  paddingTop: "56.25%",
                  position: "relative",
                  background: post.gradient,
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `radial-gradient(circle at 70% 30%, rgba(255,255,255,0.025) 0%, transparent 60%)`,
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                {/* Category + read time */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ background: post.categoryColor + "18", color: post.categoryColor, fontFamily: "'DM Mono', monospace", fontSize: 10 }}
                  >
                    {post.category}
                  </span>
                  <span style={{ fontSize: 10, color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>
                    {post.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="mb-2 flex-1"
                  style={{ fontFamily: "'Fraunces', serif", fontSize: "1rem", fontWeight: 600, color: "#F4F2EE", lineHeight: 1.25 }}
                >
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p
                  className="text-sm mb-5"
                  style={{ color: "#8A8882", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}
                >
                  {post.excerpt}
                </p>

                {/* Author + date */}
                <div className="flex items-center gap-2.5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div
                    className="flex items-center justify-center rounded-full text-xs flex-shrink-0"
                    style={{ width: 26, height: 26, background: post.authorColor + "22", color: post.authorColor, fontFamily: "'DM Mono', monospace" }}
                  >
                    {post.authorInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: 11, color: "#F4F2EE" }}>{post.author}</div>
                    <div style={{ fontSize: 10, color: "#4A4946", fontFamily: "'DM Mono', monospace" }}>{post.date}</div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load more */}
        {visibleCount < filtered.length && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setVisibleCount((c) => c + 3)}
              className="px-8 py-3 rounded-xl text-sm transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.14)", color: "#F4F2EE", background: "transparent" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              Load more articles
            </button>
          </div>
        )}

        {/* Newsletter teaser */}
        <div
          className="rounded-2xl px-8 py-10 mt-16 text-center"
          style={{ background: "#161618", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="text-xs mb-3" style={{ color: "#E8593C", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em" }}>
            NEWSLETTER
          </div>
          <h2
            className="mb-3"
            style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 600, color: "#F4F2EE" }}
          >
            Get new posts in your inbox.
          </h2>
          <p className="text-sm mb-6" style={{ color: "#8A8882" }}>
            Tips, product updates, and case studies — about twice a month.
          </p>
          <div className="flex gap-3 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: "#1E1E21", border: "1px solid rgba(255,255,255,0.1)", color: "#F4F2EE" }}
              onFocus={(e) => (e.currentTarget.style.border = "1px solid rgba(232,89,60,0.4)")}
              onBlur={(e) => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)")}
            />
            <button
              className="px-5 py-2.5 rounded-xl text-sm transition-all flex-shrink-0"
              style={{ background: "#E8593C", color: "white" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#FF6B47")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#E8593C")}
            >
              Subscribe →
            </button>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
