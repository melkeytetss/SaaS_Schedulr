import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

export type AvailabilityRule = Database["public"]["Tables"]["availability_rules"]["Row"];
export type AvailabilityOverride =
  Database["public"]["Tables"]["availability_overrides"]["Row"];

export const availabilityService = {
  async listRules(ownerId: string) {
    const { data, error } = await supabase
      .from("availability_rules")
      .select("*")
      .eq("owner_id", ownerId)
      .order("weekday");
    if (error) throw error;
    return data;
  },

  async replaceRules(ownerId: string, rules: Omit<AvailabilityRule, "id">[]) {
    // Simple strategy: wipe + reinsert. For a real app, diff instead.
    const del = await supabase
      .from("availability_rules")
      .delete()
      .eq("owner_id", ownerId);
    if (del.error) throw del.error;
    if (rules.length === 0) return [];
    const { data, error } = await supabase
      .from("availability_rules")
      .insert(rules)
      .select();
    if (error) throw error;
    return data;
  },

  async listOverrides(ownerId: string, fromDate: string, toDate: string) {
    const { data, error } = await supabase
      .from("availability_overrides")
      .select("*")
      .eq("owner_id", ownerId)
      .gte("date", fromDate)
      .lte("date", toDate);
    if (error) throw error;
    return data;
  },
};
