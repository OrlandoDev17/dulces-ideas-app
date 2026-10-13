"use client";

import { useCallback } from "react";
import type { PaymentMethod } from "@/shared/types";
import { getShortMethodLabel } from "@/shared/utils/paymentAggregation";

/**
 * Hook para obtener el nombre corto de un método de pago.
 * Ejemplo: "Bs - Pago Móvil (Johnnie)" -> "PM Johnnie", "Punto de Venta" -> "Punto"
 */
export function usePaymentMethodLabel(paymentMethods: PaymentMethod[]) {
  const getMethodLabel = useCallback(
    (id: string): string => getShortMethodLabel(id, paymentMethods),
    [paymentMethods],
  );

  return { getMethodLabel };
}
