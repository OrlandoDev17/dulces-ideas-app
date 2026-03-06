import { Sale, Cierre, PaymentMethod } from "@/lib/types";
import { RecentSalesHeader } from "./recent-sales/RecentSalesHeader";
import { RecentSalesTable } from "./recent-sales/RecentSalesTable";

interface Props {
  sales: Sale[];
  cierres: Cierre[];
  paymentMethods: PaymentMethod[];
  onDeleteSale: (id: string) => void;
  onUpdateSale?: (sale: Sale) => void;
  onClearAll: () => void;
  onArchiveDay: () => void;
}

/**
 * Componente para visualizar el historial de ventas recientes.
 */
export function RecentSales({
  sales,
  cierres,
  paymentMethods,
  onDeleteSale,
  onUpdateSale,
  onClearAll,
  onArchiveDay,
}: Props) {
  return (
    <section className="flex flex-col gap-6 w-full min-w-0 bg-white p-2 md:p-6 rounded-3xl border border-zinc-200 shadow-lg shadow-primary-500/30 mt-4 overflow-hidden">
      {/* Parte Superior: Título y Botones de acción (PDF, Limpiar) */}
      <RecentSalesHeader
        sales={sales}
        cierres={cierres}
        onClearAll={onClearAll}
        handleEndDay={onArchiveDay}
      />

      {/* Listado Principal de Ventas en formato de tabla responsive */}
      <RecentSalesTable
        sales={sales}
        paymentMethods={paymentMethods}
        onDeleteSale={onDeleteSale}
        onUpdateSale={onUpdateSale}
      />
    </section>
  );
}
