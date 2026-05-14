import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

export type Integration = Database["public"]["Tables"]["integrations"]["Row"];
export type IntegrationInsert = Database["public"]["Tables"]["integrations"]["Insert"];

export const integrationsService = {
  async listForOwner(ownerId: string) {
    const { data, error } = await supabase
      .from("integrations")
      .select("*")
      .eq("owner_id", ownerId);
    if (error) throw error;
    return data;
  },

  async upsert(input: IntegrationInsert) {
    const { data, error } = await supabase
      .from("integrations")
      .upsert(input, { onConflict: "owner_id,provider" })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async disconnect(id: string) {
    const { error } = await supabase
      .from("integrations")
      .update({ status: "disconnected" })
      .eq("id", id);
    if (error) throw error;
  },
};
