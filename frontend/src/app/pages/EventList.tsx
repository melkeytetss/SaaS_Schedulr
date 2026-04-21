import { useNavigate } from "react-router";
import { Plus, Clock, Copy, ExternalLink, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useEvents, useCreateEvent } from "@/features/events/useEvents";
import { useMyProfile } from "@/features/profile/useProfile";

export function EventList() {
  const navigate = useNavigate();
  const { data: events = [], isLoading } = useEvents();
  const { data: profile } = useMyProfile();
  const createEvent = useCreateEvent();

  const handleCreate = async () => {
    if (!profile) {
      toast.error("Profile not loaded yet");
      return;
    }
    const baseSlug = "new-event";
    const existingSlugs = new Set(events.map((e) => e.slug));
    let slug = baseSlug;
    let n = 1;
    while (existingSlugs.has(slug)) {
      n++;
      slug = `${baseSlug}-${n}`;
    }
    try {
      const created = await createEvent.mutateAsync({
        owner_id: profile.id,
        title: "Untitled event type",
        slug,
        duration_min: 30,
        color: "#E8593C",
        location_kind: "google_meet",
      });
      navigate(`/app/events/${created.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create event");
    }
  };

  const copyLink = (slug: string) => {
    if (!profile?.username) {
      toast.error("Set a username in Settings first");
      return;
    }
    const url = `${window.location.origin}/${profile.username}/${slug}`;
    void navigator.clipboard.writeText(url);
    toast.success("Link copied");
  };

  return (
    <div className="min-h-[calc(100vh-48px)] p-6 md:p-8" style={{ background: "#0F0F11" }}>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "2rem",
              fontWeight: 600,
              color: "#F4F2EE",
              lineHeight: 1.2,
            }}
          >
            Event types
          </h1>
          <p className="text-sm mt-1" style={{ color: "#8A8882" }}>
            Define the meetings people can book with you.
          </p>
        </div>
        <button
          onClick={handleCreate}
          disabled={createEvent.isPending}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
          style={{
            background: "#E8593C",
            color: "white",
            cursor: createEvent.isPending ? "not-allowed" : "pointer",
            opacity: createEvent.isPending ? 0.6 : 1,
          }}
        >
          <Plus size={14} strokeWidth={2} />
          {createEvent.isPending ? "Creating…" : "Create event type"}
        </button>
      </div>

      {isLoading && (
        <div className="text-sm" style={{ color: "#4A4946" }}>
          Loading…
        </div>
      )}

      {!isLoading && events.length === 0 && (
        <div
          className="rounded-xl p-10 text-center"
          style={{ background: "#161618", border: "1px dashed rgba(255,255,255,0.1)" }}
        >
          <div
            className="mb-2"
            style={{ fontFamily: "'Fraunces', serif", fontSize: "1.2rem", color: "#F4F2EE" }}
          >
            No event types yet
          </div>
          <p className="text-sm mb-5" style={{ color: "#8A8882" }}>
            Create your first event type to start taking bookings.
          </p>
          <button
            onClick={handleCreate}
            disabled={createEvent.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
            style={{ background: "#E8593C", color: "white" }}
          >
            <Plus size={14} strokeWidth={2} />
            Create event type
          </button>
        </div>
      )}

      {!isLoading && events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {events.map((e) => (
            <div
              key={e.id}
              className="rounded-xl p-5 flex flex-col transition-all"
              style={{
                background: "#161618",
                border: "1px solid rgba(255,255,255,0.07)",
                borderTop: `3px solid ${e.color}`,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0 flex-1">
                  <div
                    className="text-base mb-1 truncate"
                    style={{
                      fontFamily: "'Fraunces', serif",
                      color: "#F4F2EE",
                      fontSize: "1.05rem",
                      fontWeight: 600,
                    }}
                  >
                    {e.title}
                  </div>
                  <div
                    className="flex items-center gap-1.5 text-xs"
                    style={{ color: "#8A8882", fontFamily: "'DM Mono', monospace" }}
                  >
                    <Clock size={11} strokeWidth={1.5} />
                    {e.duration_min} min
                    <span style={{ color: "#4A4946" }}>·</span>
                    {e.location_kind}
                  </div>
                </div>
                <span
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{
                    background: e.is_active ? "rgba(46,204,138,0.1)" : "rgba(255,255,255,0.04)",
                    color: e.is_active ? "#2ECC8A" : "#4A4946",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {e.is_active ? "active" : "draft"}
                </span>
              </div>

              {e.description && (
                <p
                  className="text-xs mb-4 line-clamp-2"
                  style={{ color: "#8A8882", lineHeight: 1.5 }}
                >
                  {e.description}
                </p>
              )}

              <div
                className="text-xs mb-4 truncate"
                style={{ color: "#4A4946", fontFamily: "'DM Mono', monospace" }}
              >
                /{profile?.username ?? "…"}/{e.slug}
              </div>

              <div className="flex items-center gap-2 mt-auto">
                <button
                  onClick={() => navigate(`/app/events/${e.id}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all flex-1"
                  style={{
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#F4F2EE",
                    background: "transparent",
                    justifyContent: "center",
                  }}
                >
                  <Pencil size={12} strokeWidth={1.5} />
                  Edit
                </button>
                <button
                  onClick={() => copyLink(e.slug)}
                  className="flex items-center justify-center p-1.5 rounded-lg transition-all"
                  style={{
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#8A8882",
                    background: "transparent",
                    width: 30,
                    height: 30,
                  }}
                  title="Copy link"
                >
                  <Copy size={12} strokeWidth={1.5} />
                </button>
                {profile?.username && e.is_active && (
                  <a
                    href={`/${profile.username}/${e.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center p-1.5 rounded-lg transition-all"
                    style={{
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "#8A8882",
                      background: "transparent",
                      width: 30,
                      height: 30,
                    }}
                    title="Open booking page"
                  >
                    <ExternalLink size={12} strokeWidth={1.5} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
