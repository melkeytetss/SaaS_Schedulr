import { supabase } from "@/lib/supabase";

export interface AnalyticsSummary {
  totalBookings: number;
  upcomingBookings: number;
  cancelledBookings: number;
  conversionRate: number; // booking_created / booking_page_view
}

export const analyticsService = {
  async summary(ownerId: string): Promise<AnalyticsSummary> {
    const [totalRes, upcomingRes, cancelledRes, viewsRes, createdRes] = await Promise.all([
      supabase.from("bookings").select("id", { count: "exact", head: true }).eq("owner_id", ownerId),
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("owner_id", ownerId)
        .gte("starts_at", new Date().toISOString()),
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("owner_id", ownerId)
        .eq("status", "cancelled"),
      supabase
        .from("analytics_events")
        .select("id", { count: "exact", head: true })
        .eq("owner_id", ownerId)
        .eq("event_type", "booking_page_view"),
      supabase
        .from("analytics_events")
        .select("id", { count: "exact", head: true })
        .eq("owner_id", ownerId)
        .eq("event_type", "booking_created"),
    ]);

    const views = viewsRes.count ?? 0;
    const created = createdRes.count ?? 0;

    return {
      totalBookings: totalRes.count ?? 0,
      upcomingBookings: upcomingRes.count ?? 0,
      cancelledBookings: cancelledRes.count ?? 0,
      conversionRate: views > 0 ? created / views : 0,
    };
  },

  async logEvent(eventType: string, ownerId: string | null, metadata?: Record<string, unknown>) {
    await supabase.from("analytics_events").insert({
      event_type: eventType,
      owner_id: ownerId,
      metadata: metadata ?? null,
    });
  },
};
