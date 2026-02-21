import { Sale, Cierre } from "@/lib/types";
import { RecentSalesHeader } from "./recent-sales/RecentSalesHeader";
import { RecentSalesTable } from "./recent-sales/RecentSalesTable";

interface Props {
  sales: Sale[];
  cierres: Cierre[];
  onDeleteSale: (id: string) => void;
  onUpdateSale?: (sale: Sale) => void;
  onClearAll: () => void;
}

/**
 * Componente para visualizar el historial de ventas recientes.
 */
export function RecentSales({
  sales,
  cierres,
  onDeleteSale,
  onUpdateSale,
  onClearAll,
}: Props) {
  return (
    <section className="flex flex-col gap-6 w-full bg-white p-6 rounded-3xl border border-zinc-200 shadow-lg shadow-zinc-500/30 mt-4 overflow-hidden">
      {/* Parte Superior: Título y Botones de acción (PDF, Limpiar) */}
      <RecentSalesHeader
        sales={sales}
        cierres={cierres}
        onClearAll={onClearAll}
      />

      {/* Listado Principal de Ventas en formato de tabla responsive */}
      <RecentSalesTable
        sales={sales}
        onDeleteSale={onDeleteSale}
        onUpdateSale={onUpdateSale}
      />
    </section>
  );
}
