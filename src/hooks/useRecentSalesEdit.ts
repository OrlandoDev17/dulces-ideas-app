import { useState } from "react";
import { Sale } from "@/lib/types";

/**
 * Hook para manejar la lógica de edición de precios en la lista de ventas recientes.
 */
export const useRecentSalesEdit = (onUpdateSale?: (sale: Sale) => void) => {
  const [editingSaleId, setEditingSaleId] = useState<string | null>(null);
  const [editTotalBS, setEditTotalBS] = useState<number>(0);
  const [editTotalUSD, setEditTotalUSD] = useState<number>(0);

  /**
   * Inicia el modo edición para una venta específica.
   */
  const startEdit = (sale: Sale) => {
    setEditingSaleId(sale.id);
    setEditTotalBS(sale.total_bs || sale.totalBs || 0);
    setEditTotalUSD(sale.total_usd || sale.totalUsd || 0);
  };

  /**
   * Guarda los cambios realizados en la venta.
   */
  const saveEdit = (sale: Sale) => {
    if (onUpdateSale) {
      onUpdateSale({
        ...sale,
        total_bs: editTotalBS,
        total_usd: editTotalUSD,
        totalBs: editTotalBS,
        totalUsd: editTotalUSD,
      });
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
    startEdit,
    saveEdit,
    cancelEdit,
  };
};
