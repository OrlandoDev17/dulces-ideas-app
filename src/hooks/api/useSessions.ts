// src/hooks/api/useSessions.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionsApi } from "@/api/sessions";
import { useStore } from "@/context/StoreContext";

export function useSessions() {
  const queryClient = useQueryClient();
  const { activeStore } = useStore();

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["sessions", activeStore?.id],
    queryFn: () => sessionsApi.getActiveSessions(activeStore!.id),
    enabled: !!activeStore?.id,
  });

  const createSessionMutation = useMutation({
    mutationFn: (name: string) => {
      console.log("Intentando crear sesión:", {
        name,
        storeId: activeStore?.id,
      });

      if (!activeStore?.id) {
        throw new Error("No hay una tienda activa seleccionada");
      }

      return sessionsApi.createSession(name, activeStore.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  return {
    sessions,
    isLoading,
    activeSessionId: sessions[0]?.id || null,
    createSession: createSessionMutation.mutateAsync,
  };
}
