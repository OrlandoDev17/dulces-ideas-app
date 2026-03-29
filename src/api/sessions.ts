import { supabase } from "@/shared/config/supabase";
import { Session } from "@/shared/types";

export const sessionsApi = {
  async getActiveSessions(storeId: string) {
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("is_open", true)
      .eq("store_id", storeId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Session[];
  },

  async createSession(name: string, storeId: string) {
    const payload = {
      name: name,
      store_id: storeId,
      is_open: true,
    };
    const { data, error } = await supabase
      .from("sessions")
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data as Session;
  },

  async closeSession(sessionId: string) {
    const { error } = await supabase
      .from("sessions")
      .update({ is_open: false })
      .eq("id", sessionId);

    if (error) throw error;
  },
};
