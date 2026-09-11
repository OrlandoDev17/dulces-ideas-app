/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { analyticsApi, type AnalyticsRange } from "@/api/analytics";
import { useMemo } from "react";
import { subDays, startOfWeek } from "date-fns";
import { useStore } from "@/context/StoreContext";
import { useTasaBCV } from "@/hooks/ui/useTasaBCV";

export interface ProductSale {
  id: string;
  name: string;
  units: number;
  revenue: number;
}

export function useAnalytics(range: AnalyticsRange) {
  const { activeStore } = useStore();
  const { tasa } = useTasaBCV();

  const {
    data: sales = [],
    isLoading: isLoadingSales,
    error,
  } = useQuery({
    queryKey: ["analytics", range, activeStore?.id],
    queryFn: () => analyticsApi.getSalesData(range, activeStore?.id || ""),
    staleTime: 1000 * 10,
    refetchOnWindowFocus: true,
    enabled: !!activeStore?.id,
  });

  const {
    data: orderItems = [],
    isLoading: isLoadingOrders,
  } = useQuery({
    queryKey: ["analytics_order_items", range, activeStore?.id],
    queryFn: () => analyticsApi.getOrderItems(range, activeStore?.id || ""),
    staleTime: 1000 * 10,
    refetchOnWindowFocus: true,
    enabled: !!activeStore?.id,
  });

  const {
    data: ordersStats = { total: 0, paid: 0 },
  } = useQuery({
    queryKey: ["analytics_orders", range, activeStore?.id],
    queryFn: () => analyticsApi.getOrdersStats(range, activeStore?.id || ""),
    staleTime: 1000 * 10,
    refetchOnWindowFocus: true,
    enabled: !!activeStore?.id,
  });

  const isLoading = isLoadingSales || isLoadingOrders;

  const processedData = useMemo(() => {
    const now = new Date();

    if (!sales.length && !orderItems.length) {
      const dateRange =
        range === "thisWeek"
          ? { start: startOfWeek(now, { weekStartsOn: 1 }), end: now }
          : { start: subDays(now, 7), end: now };

      return {
        totals: { bs: 0, usd: 0, count: 0 },
        totalsByCurrency: { bs: 0, usd: 0, bsEqUsd: 0 },
        topProducts: [],
        percentageChange: 0,
        ordersStats,
        dateRange,
      };
    }

    // --- Periodo actual y anterior ---
    const currentSales: any[] = [];
    const previousSales: any[] = [];

    if (range === "thisWeek") {
      const weekStart = startOfWeek(now, { weekStartsOn: 1 });
      const prevWeekStart = subDays(weekStart, 7);
      const prevWeekEnd = subDays(weekStart, 1);

      sales.forEach((sale: any) => {
        const d = new Date(sale.created_at);
        if (d >= weekStart) {
          currentSales.push(sale);
        } else if (d >= prevWeekStart && d <= prevWeekEnd) {
          previousSales.push(sale);
        }
      });
    } else {
      const cutoff = subDays(now, 7);
      const prevCutoff = subDays(now, 14);

      sales.forEach((sale: any) => {
        const d = new Date(sale.created_at);
        if (d >= cutoff) {
          currentSales.push(sale);
        } else if (d >= prevCutoff && d < cutoff) {
          previousSales.push(sale);
        }
      });
    }

    // --- Totales por moneda ---
    const totalsByCurrency = { bs: 0, usd: 0, bsEqUsd: 0 };

    currentSales.forEach((sale: any) => {
      sale.sale_payments?.forEach((p: any) => {
        const isUSD = p.currency === "USD";
        if (isUSD) {
          totalsByCurrency.usd += p.amount_ref || p.amount_bs || 0;
        } else {
          totalsByCurrency.bs += p.amount_bs || 0;
        }
      });
    });

    totalsByCurrency.bsEqUsd = tasa > 0 ? totalsByCurrency.bs / tasa : 0;

    const totals = currentSales.reduce(
      (acc, s) => ({
        bs: acc.bs + (s.total_bs || 0),
        usd: acc.usd + (s.total_usd || 0),
        count: acc.count + 1,
      }),
      { bs: 0, usd: 0, count: 0 },
    );

    const previousTotals = previousSales.reduce(
      (acc, s) => ({
        bs: acc.bs + (s.total_bs || 0),
        usd: acc.usd + (s.total_usd || 0),
      }),
      { bs: 0, usd: 0 },
    );

    let percentageChange = 0;
    if (previousTotals.bs > 0) {
      percentageChange =
        ((totals.bs - previousTotals.bs) / previousTotals.bs) * 100;
    } else if (totals.bs > 0) {
      percentageChange = 100;
    }

    // --- Productos vendidos: sale_items + order_items ---
    const productMap: Record<
      string,
      { name: string; units: number; revenue: number }
    > = {};

    currentSales.forEach((sale: any) => {
      sale.sale_items?.forEach((item: any) => {
        const pid = String(item.product_id);
        if (!productMap[pid]) {
          productMap[pid] = { name: pid, units: 0, revenue: 0 };
        }
        productMap[pid].units += item.quantity || 0;
        productMap[pid].revenue += item.price_at_moment
          ? item.price_at_moment * (item.quantity || 0)
          : 0;
      });
    });

    // Agregar items de encargos que estan en el mismo rango
    orderItems.forEach((item: any) => {
      const pid = String(item.product_id);
      if (!productMap[pid]) {
        productMap[pid] = {
          name: item.product_name || pid,
          units: 0,
          revenue: 0,
        };
      }
      productMap[pid].units += item.quantity || 0;
      productMap[pid].revenue += item.price_at_moment
        ? item.price_at_moment * (item.quantity || 0)
        : 0;
      // Usar product_name del order_item si esta disponible
      if (item.product_name && productMap[pid].name === pid) {
        productMap[pid].name = item.product_name;
      }
    });

    const topProducts: ProductSale[] = Object.entries(productMap)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.units - a.units);

    const dateRange =
      range === "thisWeek"
        ? { start: startOfWeek(now, { weekStartsOn: 1 }), end: now }
        : { start: subDays(now, 7), end: now };

    return {
      totals,
      totalsByCurrency,
      topProducts,
      percentageChange,
      ordersStats,
      dateRange,
    };
  }, [sales, orderItems, tasa, range, ordersStats]);

  return {
    ...processedData,
    isLoading,
    error,
    ordersStats,
  };
}
