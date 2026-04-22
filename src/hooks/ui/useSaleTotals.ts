"use client";

import { useMemo } from "react";
import type { Sale, Payment } from "@/shared/types";
import { roundTo2 } from "@/shared/utils/formatters";

/**
 * Hook para cálculos de totales de una venta.
 * Retorna los totales (con delivery) y los payments netos (delivery descontado para ingresos).
 */
export function useSaleTotals(sale: Sale) {
  const deliveryAmt = sale.delivery_amount || sale.deliveryAmount || 0;
  const tasa = sale.tasa_bcv || 1;

  // Totales con delivery incluido
  const totalBs = sale.total_bs || sale.totalBs || 0;
  const totalUsd = sale.total_usd || sale.totalUsd || 0;

  // Pagos netos (descontando delivery para ingresos)
  const payments = useMemo(() => {
    const rawPayments = sale.sale_payments || [];
    if (!deliveryAmt || rawPayments.length === 0) return rawPayments;

    const netPayments = rawPayments.map((p) => ({ ...p }));
    let toSubtract = deliveryAmt;

    // Prioridad: PM -> Punto -> Efectivo -> USD
    const methods = [
      ["pm"],
      ["punto", "pv"],
      ["ves", "bs"],
      ["usd"],
    ];

    for (const group of methods) {
      if (toSubtract <= 0) break;
      for (const p of netPayments) {
        const mId = p.method_id || p.methodId;
        if (group.includes(mId || "")) {
          if (p.currency === "USD" || mId === "usd") {
            const currentRef = p.amount_ref || p.amountRef || 0;
            const subUsd = Math.min(currentRef, toSubtract / tasa);
            p.amount_ref = currentRef - subUsd;
            p.amountRef = p.amount_ref;
            toSubtract -= subUsd * tasa;
          } else {
            const currentBs = p.amount_bs || p.amountBs || 0;
            const subBs = Math.min(currentBs, toSubtract);
            p.amount_bs = currentBs - subBs;
            p.amountBs = p.amount_bs;
            toSubtract -= subBs;
          }
        }
      }
    }
    return netPayments;
  }, [sale.sale_payments, deliveryAmt, tasa]);

  // Items de la venta
  const items = sale.sale_items || [];

  return {
    items,
    deliveryAmt,
    tasa,
    totalBs,
    totalUsd,
    payments,
    roundTo2Decimals: roundTo2,
  };
}