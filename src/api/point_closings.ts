import { supabase } from "@/shared/config/supabase";
import type { PointClosing } from "@/shared/types";

export const pointClosingsApi = {
  // Obtener cierres no archivados de la sesión actual
  async getSessionClosings(sessionId: string, storeId: string) {
    const { data, error } = await supabase
      .from("point_closings")
      .select("*")
      .eq("session_id", sessionId)
      .eq("store_id", storeId)
      .eq("is_archived", false)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as PointClosing[];
  },

  // Crear un nuevo registro de cierre de punto
  async createClosing(payload: {
    session_id: string;
    store_id: string;
    total_bs_point: number;
  }) {
    const { data, error } = await supabase
      .from("point_closings")
      .insert([
        {
          session_id: payload.session_id,
          store_id: payload.store_id,
          total_bs_point: payload.total_bs_point,
          is_archived: false,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Eliminar un cierre específico
  async deleteClosing(id: string) {
    const { error } = await supabase
      .from("point_closings")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  // Archivar todos los cierres de la sesión (se llama al finalizar el día)
  async archiveSessionClosings(sessionId: string) {
    const { error } = await supabase
      .from("point_closings")
      .update({ is_archived: true })
      .eq("session_id", sessionId)
      .eq("is_archived", false);

    if (error) throw error;
  },
};
