/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/api/analytics";
import { useMemo } from "react";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { useStore } from "@/context/StoreContext";
import { productsApi } from "@/api/products";
import { useTasaBCV } from "@/hooks/ui/useTasaBCV";

export function useAnalytics(range: "7d" | "30d") {
  const { activeStore } = useStore();
  const { tasa } = useTasaBCV();

  // 1. Traemos la data cruda de ventas
  const {
    data: sales = [],
    isLoading: isLoadingSales,
    error,
  } = useQuery({
    queryKey: ["analytics", range],
    queryFn: () => analyticsApi.getSalesData(range, activeStore?.id || ""),
    staleTime: 0,
    enabled: !!activeStore?.id,
  });

  // 1.1 Traemos metodos de pago
  const {
    data: globalPaymentMethods = [],
    isLoading: isLoadingMethods,
  } = useQuery({
    queryKey: ["payment_methods_analytics"],
    queryFn: () => productsApi.getPaymentMethods(),
    staleTime: 1000 * 60 * 60, // 1 hora
  });

  const isLoading = isLoadingSales || isLoadingMethods;

  const processedData = useMemo(() => {
    console.log("[useAnalytics] Procesando registros:", sales);
    if (!sales.length)
      return {
        chartData: [],
        totals: { bs: 0, usd: 0, count: 0 },
        totalsByCurrency: { bs: 0, usd: 0, bsEqUsd: 0 },
        topProducts: [],
        paymentMethods: [],
        percentageChange: 0,
      };

    const daysLimit = range === "7d" ? 7 : 30;
    const now = new Date();
    const cutoffDate = subDays(now, daysLimit);

    const currentPeriodSales: any[] = [];
    const previousPeriodSales: any[] = [];

    sales.forEach((sale: any) => {
      const saleDate = new Date(sale.created_at);
      if (saleDate >= cutoffDate) {
        currentPeriodSales.push(sale);
      } else {
        previousPeriodSales.push(sale);
      }
    });

    const paymentMethodCurrencyMap: Record<string, "VES" | "USD"> = {};
    globalPaymentMethods.forEach((pm: any) => {
      paymentMethodCurrencyMap[pm.id] = pm.currency;
    });

    // --- LOGICA PARA EL GRAFICO Y TOTALES POR MONEDA ---
    const chartMap: Record<string, { bs: number; usd: number; count: number }> = {};
    const productMap: Record<string, number> = {};
    const paymentMap: Record<string, number> = {};
    const totalsByCurrency = { bs: 0, usd: 0, bsEqUsd: 0 };

    currentPeriodSales.forEach((sale: any) => {
      const date = new Date(sale.created_at);
      const label = format(date, "dd MMM", { locale: es });

      if (!chartMap[label]) {
        chartMap[label] = { bs: 0, usd: 0, count: 0 };
      }
      chartMap[label].count += 1;

      sale.sale_items?.forEach((item: any) => {
        productMap[item.product_name] =
          (productMap[item.product_name] || 0) + item.quantity;
      });

      sale.sale_payments?.forEach((p: any) => {
        paymentMap[p.method_id] = (paymentMap[p.method_id] || 0) + (p.amount_bs || 0);
        
        const currency = paymentMethodCurrencyMap[p.method_id] || "VES";
        const usdValue = p.amount_ref || p.amount_usd || (p.amount_bs / (sale.total_bs / sale.total_usd)) || 0;
        const bsValue = p.amount_bs || 0;

        if (currency === "USD") {
          totalsByCurrency.usd += usdValue;
          chartMap[label].usd += usdValue;
        } else {
          totalsByCurrency.bs += bsValue;
          chartMap[label].bs += bsValue;
        }
      });
    });

    // Calcular la equivalencia en USD para la caja de Bs basándose en la tasa del día
    totalsByCurrency.bsEqUsd = tasa > 0 ? totalsByCurrency.bs / tasa : 0;

    const chartData = Object.entries(chartMap).map(([date, data]) => ({
      date,
      Ingresos: data.bs,
      IngresosUSD: data.usd,
      Ventas: data.count,
    }));

    const totals = currentPeriodSales.reduce(
      (acc, s) => ({
        bs: acc.bs + (s.total_bs || 0),
        usd: acc.usd + (s.total_usd || 0),
        count: acc.count + 1,
      }),
      { bs: 0, usd: 0, count: 0 },
    );

    const previousTotals = previousPeriodSales.reduce(
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

    const topProducts = Object.entries(productMap)
      .map(([name, units]) => ({ name, units }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 3);

    const paymentMethods = Object.entries(paymentMap).map(([name, value]) => {
      const pmLabel = globalPaymentMethods.find((m: any) => m.id === name)?.name || name;
      return {
        name: pmLabel,
        value,
      };
    });

    return {
      chartData,
      totals,
      totalsByCurrency,
      topProducts,
      paymentMethods,
      percentageChange,
    };
  }, [sales, globalPaymentMethods, tasa, range]);

  return {
    ...processedData,
    isLoading,
    error,
  };
}
