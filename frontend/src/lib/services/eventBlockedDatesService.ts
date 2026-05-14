import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

export type EventBlockedDate =
  Database["public"]["Tables"]["event_blocked_dates"]["Row"];

export const eventBlockedDatesService = {
  async listForEvent(eventTypeId: string) {
    const { data, error } = await supabase
      .from("event_blocked_dates")
      .select("*")
      .eq("event_type_id", eventTypeId)
      .order("date");
    if (error) throw error;
    return data;
  },

  async replaceForEvent(eventTypeId: string, ownerId: string, dates: string[]) {
    const del = await supabase
      .from("event_blocked_dates")
      .delete()
      .eq("event_type_id", eventTypeId);
    if (del.error) throw del.error;
    if (dates.length === 0) return [];
    const rows = dates.map((date) => ({
      event_type_id: eventTypeId,
      owner_id: ownerId,
      date,
    }));
    const { data, error } = await supabase
      .from("event_blocked_dates")
      .insert(rows)
      .select();
    if (error) throw error;
    return data;
  },
};
