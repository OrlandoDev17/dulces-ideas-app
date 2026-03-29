import { supabase } from "@/shared/config/supabase";
import type { CartItem, Payment } from "@/shared/types";

export const salesApi = {
  // 1. Obtener ventas recientes
  async getRecentSales(sessionId: string, storeId: string) {
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
      .eq("store_id", storeId)
      .eq("is_archived", false)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // 2. Crear una venta
  async createSale(
    saleData: {
      session_id: string;
      store_id: string;
      total_bs: number;
      total_usd: number;
      tasa_bcv: number;
      delivery: boolean;
      delivery_name?: string | null;
      delivery_amount?: number | null;
    },
    items: CartItem[],
    payments: Payment[],
  ) {
    // 1. Insertar Cabecera
    const { data: sale, error: saleError } = await supabase
      .from("sales")
      .insert([
        {
          session_id: saleData.session_id,
          store_id: saleData.store_id,
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

    // 2. Insertar Items vinculados al sale_id
    const itemsToInsert = items.map((item) => ({
      sale_id: sale.id,
      product_id: item.id,
      price_at_moment: item.price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("sale_items")
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;

    // 3. Insertar Pagos vinculados al sale_id
    const paymentsToInsert = payments.map((p) => ({
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

  // 3. Actualizar una venta existente
  async updateSaleAmount(
    id: string,
    newTotalBs: number,
    newTotalUsd: number,
    usdPaymentRef?: number,
  ) {
    // 1. Actualizamos la cabecera de la venta
    const { data: sale, error: saleError } = await supabase
      .from("sales")
      .update({
        total_bs: newTotalBs,
        total_usd: newTotalUsd,
      })
      .eq("id", id)
      .select()
      .single();

    if (saleError) throw saleError;

    // 2. Sincronizamos los pagos
    const { data: payments } = await supabase
      .from("sale_payments")
      .select("*")
      .eq("sale_id", id);

    if (payments && payments.length > 0) {
      // Caso A: Es un solo método de pago (Lo más común)
      if (payments.length === 1) {
        const updateData: { amount_bs: number; amount_ref: number } = {
          amount_bs: newTotalBs,
          amount_ref:
            usdPaymentRef !== undefined &&
            (payments[0].currency === "USD" || payments[0].method_id === "usd")
              ? usdPaymentRef
              : newTotalUsd,
        };

        await supabase
          .from("sale_payments")
          .update(updateData)
          .eq("id", payments[0].id);
      }
      // Caso B: Pagos mixtos (Reescalamos proporcionalmente)
      else {
        const currentTotalBs = payments.reduce(
          (acc, p) => acc + p.amount_bs,
          0,
        );
        const factor = newTotalBs / (currentTotalBs || 1);

        for (const p of payments) {
          await supabase
            .from("sale_payments")
            .update({
              amount_bs: p.amount_bs * factor,
              amount_ref: p.amount_ref * factor,
            })
            .eq("id", p.id);
        }
      }
    }

    return sale;
  },

  // 4. Eliminar una sola venta
  async deleteSale(id: string) {
    const { error } = await supabase.from("sales").delete().eq("id", id);
    if (error) throw error;
  },

  // 5. Eliminar todas las ventas de la sesión (Limpiar)
  async deleteAllFromSession(sessionId: string) {
    const { error } = await supabase
      .from("sales")
      .delete()
      .eq("session_id", sessionId)
      .eq("is_archived", false);
    if (error) throw error;
  },

  // 6. Archivar ventas de la sesión (Cierre)
  async archiveSessionSales(sessionId: string) {
    const { error } = await supabase
      .from("sales")
      .update({ is_archived: true })
      .eq("session_id", sessionId)
      .eq("is_archived", false);
    if (error) throw error;
  },
};
