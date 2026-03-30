/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pointClosingsApi } from "@/api/point_closings";
import { useStore } from "@/context/StoreContext";
import { useState } from "react";

export function usePointClosings(sessionId: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { activeStore } = useStore();

  // 1. Obtener cierres
  const { data: cierres, isLoading: isLoadingClosings } = useQuery({
    queryKey: ["point_closings", sessionId],
    queryFn: () =>
      pointClosingsApi.getSessionClosings(sessionId!, activeStore?.id!),
    enabled: !!sessionId && !!activeStore?.id,
  });

  // 2. Crear cierre
  const createClosing = useMutation({
    onMutate: () => {
      setIsLoading(true);
    },
    mutationFn: (monto: number) =>
      pointClosingsApi.createClosing({
        total_bs_point: monto,
        session_id: sessionId!,
        store_id: activeStore?.id!,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["point_closings"] });
      // También invalidamos ventas para que el FinancialSummary se recalcule
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  // 3. Eliminar cierre
  const deleteClosing = useMutation({
    mutationFn: (id: string) => pointClosingsApi.deleteClosing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["point_closings"] });
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });

  // 4. Archivar cierres
  const archiveClosings = useMutation({
    mutationFn: () => pointClosingsApi.archiveSessionClosings(sessionId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["point_closings"] });
    },
  });

  return {
    cierres,
    isLoadingClosings,
    createClosing,
    deleteClosing,
    archiveClosings,
    isLoading,
  };
}
