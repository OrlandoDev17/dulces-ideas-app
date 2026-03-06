import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Sale, CartItem, Payment } from "@/lib/types";

export function useSales(sessionId: string | null) {
  const queryClient = useQueryClient();

  // 1. OBTENER: Ventas recientes de la sesión con sus items y pagos
  const { data: recentSales, isLoading: isLoadingRecent } = useQuery({
    queryKey: ["sales", "recent", sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      const { data, error } = await supabase
        .from("sales")
        .select(
          `
          *,
          sale_items (*),
          sale_payments (*)
        `,
        )
        .eq("session_id", sessionId)
        .eq("is_archived", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!sessionId,
  });

  // 2. CREAR: Registro en cascada (Venta -> Items -> Pagos)
  const createSale = useMutation({
    mutationFn: async (saleData: {
      total_bs: number;
      total_usd: number;
      tasa_bcv: number;
      items: CartItem[];
      payments: Payment[];
      delivery: boolean;
      delivery_name?: string | null;
      delivery_amount?: number | null;
    }) => {
      // A. Insertar Cabecera
      const { data: sale, error: saleError } = await supabase
        .from("sales")
        .insert([
          {
            session_id: sessionId,
            total_bs: saleData.total_bs,
            total_usd: saleData.total_usd,
            tasa_bcv: saleData.tasa_bcv,
            delivery: saleData.delivery,
            delivery_name: saleData.delivery_name,
            delivery_amount: saleData.delivery_amount,
            is_archived: false,
          },
        ])
        .select()
        .single();

      if (saleError) throw saleError;

      // B. Insertar Items
      const itemsToInsert = saleData.items.map((item) => ({
        sale_id: sale.id,
        product_id: item.id,
        price_at_moment: item.price,
        quantity: item.quantity,
      }));
      const { error: itemsError } = await supabase
        .from("sale_items")
        .insert(itemsToInsert);
      if (itemsError) throw itemsError;

      // C. Insertar Pagos
      const paymentsToInsert = saleData.payments.map((p) => ({
        sale_id: sale.id,
        method_id: p.methodId,
        amount_bs: p.amountBs,
        amount_ref: p.amountRef,
        currency: p.currency,
      }));
      const { error: paymentsError } = await supabase
        .from("sale_payments")
        .insert(paymentsToInsert);
      if (paymentsError) throw paymentsError;

      return sale;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["sales", "recent", sessionId],
      }),
  });

  // 3. EDITAR: Actualiza solo la cabecera (totales/tasa)
  const updateSale = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Sale>;
    }) => {
      const { data, error } = await supabase
        .from("sales")
        .update(updates)
        .eq("id", id)
        .eq("session_id", sessionId);
      if (error) throw error;
      return data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["sales", "recent", sessionId],
      }),
  });

  // 4. BORRAR 1: Elimina una venta específica
  const deleteSale = useMutation({
    mutationFn: async (id: string) => {
      // El ON DELETE CASCADE del SQL borrará automáticamente items y pagos
      const { error } = await supabase
        .from("sales")
        .delete()
        .eq("id", id)
        .eq("session_id", sessionId);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["sales", "recent", sessionId],
      }),
  });

  // 5. BORRAR TODAS: Limpia las ventas recientes de esta sesión (sin archivar)
  const deleteAllRecent = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("sales")
        .delete()
        .eq("session_id", sessionId)
        .eq("is_archived", false);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["sales", "recent", sessionId],
      }),
  });

  // 6. ARCHIVAR: Envía todas las ventas de la sesión al historial (Cierre de turno)
  const archiveSales = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("sales")
        .update({ is_archived: true })
        .eq("session_id", sessionId)
        .eq("is_archived", false);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["sales", "recent", sessionId],
      }),
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
