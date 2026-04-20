import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];
export type BookingStatus = Booking["status"];

export const bookingsService = {
  async listForOwner(ownerId: string, opts: { upcomingOnly?: boolean } = {}) {
    let q = supabase
      .from("bookings")
      .select("*, event_types(title, color, duration_min)")
      .eq("owner_id", ownerId)
      .order("starts_at", { ascending: true });

    if (opts.upcomingOnly) q = q.gte("starts_at", new Date().toISOString());

    const { data, error } = await q;
    if (error) throw error;
    return data;
  },

  async create(input: BookingInsert) {
    const { data, error } = await supabase
      .from("bookings")
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: BookingStatus) {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) throw error;
  },

  async remove(id: string) {
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) throw error;
  },
};
