import { supabase } from "@/lib/supabase";

export const openSession = async (sessionName: string) => {
  const { data, error } = await supabase
    .from("sessions")
    .insert([{ name: sessionName, is_open: true }])
    .select()
    .single();

  if (error) throw error;

  // Guardamos el ID en localStorage para que la app sepa que hay una sesion activa
  if (typeof window !== "undefined") {
    localStorage.setItem("active_session_id", data.id);
  }

  return data;
};

export const getActiveSession = async () => {
  const sessionId = localStorage.getItem("active_session_id");
  if (!sessionId) return null;

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (error || !data) {
    localStorage.removeItem("active_session_id");
    return null;
  }

  return data;
};
