import { supabase } from "@/shared/config/supabase";
import { startOfDay, subDays, startOfWeek } from "date-fns";

export type AnalyticsRange = "thisWeek" | "last7d";

function getStartDate(range: AnalyticsRange, now: Date) {
  if (range === "thisWeek") {
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    return startOfDay(subDays(weekStart, 7));
  }
  return startOfDay(subDays(now, 14));
}

export interface SaleRecord {
  id: string;
  total_bs: number;
  total_usd: number;
  created_at: string;
  store_id: string;
  sale_items: SaleItemRecord[];
  sale_payments: SalePaymentRecord[];
}

export interface SaleItemRecord {
  sale_id: string;
  product_id: number | string;
  quantity: number;
  price_at_moment: number;
}

export interface SalePaymentRecord {
  sale_id: string;
  method_id: string;
  amount_bs: number;
  amount_ref: number;
  currency: string;
}

export interface OrderItemRecord {
  order_id: string;
  product_id: number | string;
  product_name: string | null;
  quantity: number;
  price_at_moment: number;
}

export const analyticsApi = {
  async getSalesData(range: AnalyticsRange, storeId: string): Promise<SaleRecord[]> {
    const now = new Date();
    const startDate = getStartDate(range, now);

    // 1. Traer ventas del rango
    const { data: sales, error: salesError } = await supabase
      .from("sales")
      .select("id, total_bs, total_usd, created_at, store_id")
      .eq("store_id", storeId)
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: true });

    if (salesError) throw salesError;
    if (!sales || sales.length === 0) return [];

    const saleIds = sales.map((s) => s.id);

    // 2. Traer items de esas ventas
    const { data: items } = await supabase
      .from("sale_items")
      .select("sale_id, product_id, quantity, price_at_moment")
      .in("sale_id", saleIds);

    // 3. Traer pagos de esas ventas
    const { data: payments } = await supabase
      .from("sale_payments")
      .select("sale_id, method_id, amount_bs, amount_ref, currency")
      .in("sale_id", saleIds);

    // 4. Unir todo
    const itemsBySale = new Map<string, SaleItemRecord[]>();
    const paymentsBySale = new Map<string, SalePaymentRecord[]>();

    items?.forEach((item) => {
      const list = itemsBySale.get(item.sale_id) || [];
      list.push(item as SaleItemRecord);
      itemsBySale.set(item.sale_id, list);
    });

    payments?.forEach((pay) => {
      const list = paymentsBySale.get(pay.sale_id) || [];
      list.push(pay as SalePaymentRecord);
      paymentsBySale.set(pay.sale_id, list);
    });

    return sales.map((sale) => ({
      ...sale,
      sale_items: itemsBySale.get(sale.id) || [],
      sale_payments: paymentsBySale.get(sale.id) || [],
    }));
  },

  async getOrderItems(range: AnalyticsRange, storeId: string): Promise<OrderItemRecord[]> {
    const now = new Date();
    const startDate = getStartDate(range, now);

    // 1. Traer order IDs del rango
    const { data: orders } = await supabase
      .from("orders")
      .select("id")
      .eq("store_id", storeId)
      .gte("created_at", startDate.toISOString());

    if (!orders || orders.length === 0) return [];

    const orderIds = orders.map((o) => o.id);

    // 2. Traer items de esos encargos
    const { data: items } = await supabase
      .from("order_items")
      .select("order_id, product_id, product_name, quantity, price_at_moment")
      .in("order_id", orderIds);

    return (items as OrderItemRecord[]) || [];
  },

  async getOrdersStats(range: AnalyticsRange, storeId: string) {
    const now = new Date();
    const startDate = getStartDate(range, now);

    const { data, error } = await supabase
      .from("orders")
      .select("status")
      .eq("store_id", storeId)
      .gte("created_at", startDate.toISOString());

    if (error) throw error;

    const total = data?.length || 0;
    const paid =
      data?.filter((o) => o.status === "paid" || o.status === "delivered")
        .length || 0;

    return { total, paid };
  },
};
