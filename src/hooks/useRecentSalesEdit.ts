import { useState } from "react";
import { Sale, Payment } from "@/lib/types";

/**
 * Hook para manejar la lógica de edición de precios en la lista de ventas recientes.
 */
export const useRecentSalesEdit = (onUpdateSale?: (sale: Sale, usdPaymentRef?: number) => void) => {
  const [editingSaleId, setEditingSaleId] = useState<string | null>(null);
  const [editTotalBS, setEditTotalBS] = useState<number>(0);
  const [editTotalUSD, setEditTotalUSD] = useState<number>(0);
  // Bug 3 Fix: estado para el monto directo en USD del pago en divisas
  const [editUsdPaymentRef, setEditUsdPaymentRef] = useState<number | null>(null);

  /**
   * Inicia el modo edición para una venta específica.
   */
  const startEdit = (sale: Sale) => {
    setEditingSaleId(sale.id);
    setEditTotalBS(sale.total_bs || sale.totalBs || 0);
    setEditTotalUSD(sale.total_usd || sale.totalUsd || 0);

    // Bug 3 Fix: detectar si hay un pago en divisas y pre-cargar su monto
    const payments: Payment[] = sale.sale_payments || sale.payments || [];
    const usdPayment = payments.find(
      (p) => p.currency === "USD" || p.method_id === "usd" || p.methodId === "usd"
    );
    setEditUsdPaymentRef(usdPayment ? (usdPayment.amount_ref ?? usdPayment.amountRef ?? null) : null);
  };

  /**
   * Guarda los cambios realizados en la venta.
   * @param usdPaymentRef Monto directo en USD para el pago en divisas (opcional)
   */
  const saveEdit = (sale: Sale, usdPaymentRef?: number) => {
    if (onUpdateSale) {
      onUpdateSale(
        {
          ...sale,
          total_bs: editTotalBS,
          total_usd: editTotalUSD,
          totalBs: editTotalBS,
          totalUsd: editTotalUSD,
        },
        usdPaymentRef,
      );
    }
    setEditingSaleId(null);
  };

  /**
   * Cancela la edición actual.
   */
  const cancelEdit = () => setEditingSaleId(null);

  return {
    editingSaleId,
    editTotalBS,
    setEditTotalBS,
    editTotalUSD,
    setEditTotalUSD,
    editUsdPaymentRef,
    setEditUsdPaymentRef,
    startEdit,
    saveEdit,
    cancelEdit,
  };
};
