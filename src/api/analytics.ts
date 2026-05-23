import { supabase } from "@/shared/config/supabase";
import { startOfDay, subDays, startOfMonth, subMonths } from "date-fns";

export type AnalyticsRange = "7d" | "30d" | "thisMonth";

export const analyticsApi = {
  /*
   * Obtiene las ventas filtradas port rango de fecha
   * @param range "7d" | "30d" | "thisMonth"
   */
  async getSalesData(range: AnalyticsRange, storeId: string) {
    const now = new Date();
    let startDate: string;

    if (range === "thisMonth") {
      startDate = startOfDay(subMonths(startOfMonth(now), 1)).toISOString();
    } else {
      const daysBack = range === "7d" ? 14 : 60;
      startDate = startOfDay(subDays(now, daysBack)).toISOString();
    }

    const query = supabase
      .from("sales")
      .select(
        `
        total_bs,
        total_usd,
        created_at,
        sale_items (product_id, quantity),
        sale_payments (method_id, amount_bs)
      `,
      )
      .eq("store_id", storeId)
      .eq("is_archived", true)
      .gte("created_at", startDate)
      .order("created_at", { ascending: true });

    const { data, error } = await query;

    if (error) throw error;

    return data;
  },

  /*
   * Obtiene estadísticas de órdenes para el rango
   */
  async getOrdersStats(range: AnalyticsRange, storeId: string) {
    const now = new Date();
    let startDate: string;

    if (range === "thisMonth") {
      startDate = startOfDay(startOfMonth(now)).toISOString();
    } else {
      const daysBack = range === "7d" ? 7 : 30;
      startDate = startOfDay(subDays(now, daysBack)).toISOString();
    }

    const { data, error } = await supabase
      .from("orders")
      .select("status")
      .eq("store_id", storeId)
      .gte("created_at", startDate);

    if (error) throw error;

    const total = data?.length || 0;
    const paid = data?.filter((o) => o.status === "paid" || o.status === "delivered").length || 0;

    return { total, paid };
  },
};
