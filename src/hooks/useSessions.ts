import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Session } from "@/lib/types";

export function useSessions() {
  const queryClient = useQueryClient();

  // Obtener todas las sesiones abiertas
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("is_open", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Session[];
    },
  });

  // Mutacion para crear una nueva sesion
  const createSessionMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from("sessions")
        .insert([{ name, is_open: true }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (newSession) => {
      // Actualizamos la cache de React Query
      queryClient.setQueryData(["sessions"], (old: Session[] | undefined) =>
        old ? [newSession, ...old] : [newSession],
      );
    },
  });

  return {
    sessions,
    isLoading,
    createSession: createSessionMutation.mutateAsync,
  };
}
