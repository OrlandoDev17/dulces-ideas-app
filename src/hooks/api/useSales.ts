/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { salesApi } from "@/api/sales";
import { useStore } from "@/context/StoreContext";
import type { Sale, CartItem, Payment } from "@/shared/types";

export function useSales(sessionId: string | null) {
  const queryClient = useQueryClient();
  const { activeStore } = useStore();

  // OBTENER
  const { data: recentSales, isLoading: isLoadingRecent } = useQuery({
    queryKey: ["sales", "recent", sessionId],
    queryFn: () => salesApi.getRecentSales(sessionId!, activeStore?.id!),
    enabled: !!sessionId,
  });

  // CREAR
  const createSale = useMutation({
    mutationFn: async (payload: {
      total_bs: number;
      total_usd: number;
      tasa_bcv: number;
      items: CartItem[];
      payments: Payment[];
      delivery: boolean;
      delivery_name?: string | null;
      delivery_amount?: number | null;
    }) => {
      if (!sessionId || !activeStore?.id) throw new Error("Faltan datos");
      return salesApi.createSale(
        { ...payload, session_id: sessionId, store_id: activeStore.id },
        payload.items,
        payload.payments,
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sales"] }),
  });

  // ACTUALIZAR
  const updateSale = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Sale> }) =>
      salesApi.updateSale(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sales"] }),
  });

  // ELIMINAR UNA
  const deleteSale = useMutation({
    mutationFn: (id: string) => salesApi.deleteSale(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sales"] }),
  });

  // LIMPIAR TODO (DELETE)
  const deleteAllRecent = useMutation({
    mutationFn: () => salesApi.deleteAllFromSession(sessionId!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sales"] }),
  });

  // ARCHIVAR (UPDATE is_archived: true)
  const archiveSales = useMutation({
    mutationFn: () => salesApi.archiveSessionSales(sessionId!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sales"] }),
  });

  return {
    recentSales,
    isLoadingRecent,
    createSale,
    updateSale,
    deleteSale,
    deleteAllRecent,
    archiveSales,
  };
}
