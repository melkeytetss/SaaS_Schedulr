import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { usePublicProfile } from "@/features/profile/useProfile";
import { usePublicEvents } from "@/features/events/useEvents";
import {
  Clock,
  Loader2,
  MapPin,
  Video,
  Phone,
  FileText,
  Globe,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Share2,
  Search,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

const LOCATION_LABELS: Record<string, { label: string; Icon: typeof Video }> = {
  google_meet: { label: "Google Meet", Icon: Video },
  zoom: { label: "Zoom", Icon: Video },
  phone: { label: "Phone call", Icon: Phone },
  in_person: { label: "In person", Icon: MapPin },
  custom: { label: "Custom", Icon: FileText },
};

function getInitials(name: string) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const { data: profile, isLoading: isProfileLoading } = usePublicProfile(username || "");
  const { data: events = [], isLoading: isEventsLoading } = usePublicEvents(username || "");

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Profile link copied!");
  };

  if (isProfileLoading || isEventsLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0F0F11", color: "#F4F2EE" }}
      >
        <Loader2 className="animate-spin" size={24} style={{ color: "#E8593C" }} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
        style={{ background: "#0F0F11", color: "#F4F2EE" }}
      >
        <h1 className="text-2xl mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
          User not found
        </h1>
        <p style={{ color: "#8A8882" }}>
          We couldn't find a scheduling page for "{username}".
        </p>
      </div>
    );
  }

  const displayName = profile.full_name || profile.username || "My Workspace";

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ background: "#0F0F11", color: "#F4F2EE" }}
    >
      {/* Share Button */}
      <button
        onClick={handleShare}
        className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors z-10"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#F4F2EE"
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
      >
        <Share2 size={14} />
        Share
      </button>

      {/* Container */}
      <div className="flex-1 w-full max-w-2xl mx-auto px-6 py-12 flex flex-col items-center">
        
        {/* Header / Profile Info */}
        <div className="flex flex-col items-center text-center mb-10">
          <div
            className="rounded-full overflow-hidden mb-5 flex items-center justify-center"
            style={{
              width: 80,
              height: 80,
              background: "rgba(232,89,60,0.15)",
              color: "#E8593C",
              border: "1px solid rgba(232,89,60,0.3)",
              boxShadow: "0 8px 32px rgba(232,89,60,0.15)",
              fontFamily: "'DM Mono', monospace",
              fontSize: "1.5rem"
            }}
          >
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              getInitials(displayName)
            )}
          </div>
          <h1
            className="text-3xl mb-3"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
          >
            {displayName}
          </h1>
          <p
            className="max-w-md text-sm leading-relaxed mb-4"
            style={{ color: "#8A8882" }}
          >
            {profile.bio || "Welcome to my scheduling page. Please select an event below to book a time with me."}
          </p>

          {/* Social Links */}
          {(profile.website || profile.twitter_handle || profile.linkedin_handle || profile.instagram_handle || profile.facebook_handle) && (
            <div className="flex items-center gap-3">
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)", color: "#8A8882" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#F4F2EE")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#8A8882")}
                >
                  <Globe size={16} />
                </a>
              )}
              {profile.twitter_handle && (
                <a
                  href={`https://twitter.com/${profile.twitter_handle.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)", color: "#8A8882" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#F4F2EE")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#8A8882")}
                >
                  <Twitter size={16} />
                </a>
              )}
              {profile.linkedin_handle && (
                <a
                  href={`https://linkedin.com/in/${profile.linkedin_handle}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)", color: "#8A8882" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#F4F2EE")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#8A8882")}
                >
                  <Linkedin size={16} />
                </a>
              )}
              {profile.instagram_handle && (
                <a
                  href={`https://instagram.com/${profile.instagram_handle.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)", color: "#8A8882" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#F4F2EE")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#8A8882")}
                >
                  <Instagram size={16} />
                </a>
              )}
              {profile.facebook_handle && (
                <a
                  href={`https://facebook.com/${profile.facebook_handle.replace("/", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)", color: "#8A8882" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#F4F2EE")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#8A8882")}
                >
                  <Facebook size={16} />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Search Bar */}
        {events.length > 0 && (
          <div className="w-full mb-6 relative">
            <Search 
              size={16} 
              className="absolute left-3 top-1/2 -translate-y-1/2" 
              style={{ color: "#8A8882" }} 
            />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background: "#1A1A1D",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#F4F2EE",
                caretColor: "#E8593C"
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(232,89,60,0.4)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>
        )}

        {/* Event List */}
        <div className="w-full flex flex-col gap-4">
          {events.length === 0 ? (
            <div
              className="text-center p-12 rounded-2xl"
              style={{
                background: "#161618",
                border: "1px solid rgba(255,255,255,0.05)",
                color: "#8A8882"
              }}
            >
              No active event types available to book.
            </div>
          ) : filteredEvents.length === 0 ? (
            <div
              className="text-center p-12 rounded-2xl"
              style={{
                background: "#161618",
                border: "1px solid rgba(255,255,255,0.05)",
                color: "#8A8882"
              }}
            >
              No events match your search.
            </div>
          ) : (
            paginatedEvents.map((event) => {
              const locationMeta = LOCATION_LABELS[event.location_kind] ?? LOCATION_LABELS.google_meet;
              const LocationIcon = locationMeta.Icon;
              return (
              <button
                key={event.id}
                onClick={() => navigate(`/${username}/${event.slug}`)}
                className="w-full flex items-start text-left p-6 rounded-2xl transition-all group relative overflow-hidden"
                style={{
                  background: "#161618",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#161618";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {/* Accent line */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 opacity-70 group-hover:opacity-100 transition-opacity"
                  style={{ background: event.color || "#E8593C" }}
                />

                <div className="flex-1 pl-2">
                  <div className="flex items-center justify-between mb-2">
                    <h2
                      className="text-lg font-medium"
                      style={{ color: "#F4F2EE" }}
                    >
                      {event.title}
                    </h2>
                    <div 
                      className="text-xs px-2 py-1 rounded font-medium"
                      style={{ 
                        background: "rgba(232,89,60,0.1)", 
                        color: "#E8593C",
                        fontFamily: "'DM Mono', monospace"
                      }}
                    >
                      Available tomorrow
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs mb-3 font-medium tracking-wide">
                    <div
                      className="flex items-center gap-1.5"
                      style={{ color: event.color || "#8A8882", fontFamily: "'DM Mono', monospace" }}
                    >
                      <Clock size={12} strokeWidth={2} />
                      {event.duration_min} MIN
                    </div>
                    <div
                      className="flex items-center gap-1.5"
                      style={{ color: "#8A8882" }}
                    >
                      <LocationIcon size={12} strokeWidth={2} />
                      {locationMeta.label}
                    </div>
                  </div>

                  {event.description && (
                    <p
                      className="text-sm line-clamp-2"
                      style={{ color: "#8A8882", lineHeight: 1.6 }}
                    >
                      {event.description}
                    </p>
                  )}
                </div>
              </button>
            );
          })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="w-full flex items-center justify-between mt-8 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors"
              style={{
                background: page === 1 ? "transparent" : "rgba(255,255,255,0.04)",
                color: page === 1 ? "#4A4946" : "#F4F2EE",
                cursor: page === 1 ? "not-allowed" : "pointer"
              }}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <span className="text-sm" style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace" }}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors"
              style={{
                background: page === totalPages ? "transparent" : "rgba(255,255,255,0.04)",
                color: page === totalPages ? "#4A4946" : "#F4F2EE",
                cursor: page === totalPages ? "not-allowed" : "pointer"
              }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}

      </div>

      {/* Footer Branding */}
      <footer className="py-8 text-center" style={{ color: "#4A4946" }}>
        <a 
          href="/" 
          className="text-xs hover:text-white transition-colors"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          POWERED BY SCHEDULR
        </a>
      </footer>
    </div>
  );
}
