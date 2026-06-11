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

  async deleteSession(sessionId: string) {
    // 1. Obtener todas las ventas de la sesión
    const { data: sales } = await supabase
      .from("sales")
      .select("id")
      .eq("session_id", sessionId);

    if (sales?.length) {
      const saleIds = sales.map((s) => s.id);

      // 2. Eliminar sale_items de estas ventas
      await supabase.from("sale_items").delete().in("sale_id", saleIds);

      // 3. Eliminar sale_payments de estas ventas
      await supabase.from("sale_payments").delete().in("sale_id", saleIds);

      // 4. Eliminar las ventas
      await supabase.from("sales").delete().in("id", saleIds);
    }

    // 5. Obtener todas las órdenes de la sesión
    const { data: orders } = await supabase
      .from("orders")
      .select("id")
      .eq("session_id", sessionId);

    if (orders?.length) {
      const orderIds = orders.map((o) => o.id);

      // 6. Obtener ventas asociadas a órdenes (avances de pago)
      const { data: orderSales } = await supabase
        .from("sales")
        .select("id")
        .in("order_id", orderIds);

      if (orderSales?.length) {
        const orderSaleIds = orderSales.map((s) => s.id);

        // 7. Eliminar sale_payments de ventas de órdenes
        await supabase.from("sale_payments").delete().in("sale_id", orderSaleIds);

        // 8. Eliminar ventas de órdenes
        await supabase.from("sales").delete().in("id", orderSaleIds);
      }

      // 9. Eliminar order_payments
      await supabase.from("order_payments").delete().in("order_id", orderIds);

      // 10. Eliminar order_items
      await supabase.from("order_items").delete().in("order_id", orderIds);

      // 11. Eliminar las órdenes
      await supabase.from("orders").delete().in("id", orderIds);
    }

    // 12. Eliminar point_closings de la sesión
    await supabase.from("point_closings").delete().eq("session_id", sessionId);

    // 13. Eliminar la sesión
    const { error } = await supabase.from("sessions").delete().eq("id", sessionId);

    if (error) throw error;
  },
};
