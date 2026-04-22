"use client";

import { useCallback } from "react";
import type { PaymentMethod } from "@/shared/types";

/**
 * Hook para obtener el nombre formateado de un método de pago.
 * Ejemplo: "Punto de Venta" -> "Punto"
 */
export function usePaymentMethodLabel(paymentMethods: PaymentMethod[]) {
  const getMethodLabel = useCallback(
    (id: string): string => {
      const method = paymentMethods?.find((m) => m.id === id);
      if (!method) return id;
      return method.name.replace(/Punto de Venta/gi, "Punto");
    },
    [paymentMethods],
  );

  return { getMethodLabel };
}