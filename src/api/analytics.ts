import { supabase } from "@/shared/config/supabase";
import { startOfDay, subDays } from "date-fns";

export const analyticsApi = {
  /*
   * Obtiene las ventas filtradas port rango de fecha
   * @param range "7d" | "30d"
   * @param is_archived solo trae las ventas archivadas si no trae la de la seccion actual
   */
  async getSalesData(range: "7d" | "30d", storeId: string) {
    const now = new Date();
    const daysBack = range === "7d" ? 14 : 60;
    const startDate = startOfDay(subDays(now, daysBack)).toISOString();

    // Solo pedir campos necesarios para optimizar el rendimiento
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
};
