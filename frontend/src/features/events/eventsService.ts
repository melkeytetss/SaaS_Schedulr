import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

export type EventType = Database["public"]["Tables"]["event_types"]["Row"];
export type EventTypeInsert = Database["public"]["Tables"]["event_types"]["Insert"];
export type EventTypeUpdate = Database["public"]["Tables"]["event_types"]["Update"];

export const eventsService = {
  async listForOwner(ownerId: string) {
    const { data, error } = await supabase
      .from("event_types")
      .select("*")
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data;
  },

  async getPublic(username: string, slug: string) {
    const { data, error } = await supabase
      .from("event_types")
      .select("*, profiles!inner(username, full_name, avatar_url, timezone)")
      .eq("slug", slug)
      .eq("is_active", true)
      .eq("profiles.username", username)
      .single();
    if (error) throw error;
    return data;
  },

  async create(input: EventTypeInsert) {
    const { data, error } = await supabase
      .from("event_types")
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, patch: EventTypeUpdate) {
    const { data, error } = await supabase
      .from("event_types")
      .update(patch)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id: string) {
    const { error } = await supabase.from("event_types").delete().eq("id", id);
    if (error) throw error;
  },
};
