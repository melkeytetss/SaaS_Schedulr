import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

export type Reminder = Database["public"]["Tables"]["reminders"]["Row"];
export type ReminderInsert = Database["public"]["Tables"]["reminders"]["Insert"];

export const remindersService = {
  async listForOwner(ownerId: string) {
    const { data, error } = await supabase
      .from("reminders")
      .select("*")
      .eq("owner_id", ownerId)
      .order("offset_minutes");
    if (error) throw error;
    return data;
  },

  async create(input: ReminderInsert) {
    const { data, error } = await supabase
      .from("reminders")
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id: string) {
    const { error } = await supabase.from("reminders").delete().eq("id", id);
    if (error) throw error;
  },
};
