import { Sale } from "@/lib/types";
import { RecentSaleRow } from "./RecentSaleRow";
import { RecentSaleCard } from "./RecentSaleCard";
import { useRecentSalesEdit } from "@/hooks/useRecentSalesEdit";
import { ShoppingBag } from "lucide-react";
import { useMemo } from "react";
import { EditSaleModal } from "./EditSaleModal";

interface Props {
  sales: Sale[];
  onDeleteSale: (id: string) => void;
  onUpdateSale?: (sale: Sale) => void;
}

/**
 * Tabla de ventas recientes.
 * Gestiona la lista de ventas y el estado de edición individual.
 */
export function RecentSalesTable({ sales, onDeleteSale, onUpdateSale }: Props) {
  const {
    editingSaleId,
    editTotalBS,
    setEditTotalBS,
    editTotalUSD,
    setEditTotalUSD,
    startEdit,
    saveEdit,
    cancelEdit,
  } = useRecentSalesEdit(onUpdateSale);

  const reversedSales = useMemo(() => [...sales].reverse(), [sales]);

  // Encontrar la venta que se está editando para pasarla al modal
  const activeEditingSale = useMemo(
    () => sales.find((s) => s.id === editingSaleId),
    [sales, editingSaleId],
  );

  if (sales.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-zinc-400 gap-4 bg-zinc-50/30 rounded-3xl border border-dashed border-zinc-200">
        <div className="p-4 bg-white rounded-full shadow-sm">
          <ShoppingBag size={40} className="text-zinc-200" />
        </div>
        <div className="text-center">
          <p className="font-bold text-zinc-500">No hay ventas registradas</p>
          <p className="text-xs uppercase tracking-tighter text-zinc-400 font-medium">
            Las ventas nuevas aparecerán aquí
          </p>
        </div>
      </div>
    );
  }

  const COLUMNS = [
    { key: "time", label: "Hora" },
    { key: "products", label: "Productos" },
    { key: "total", label: "Total" },
    { key: "payments", label: "Pagos" },
    { key: "delivery", label: "Delivery" },
    { key: "actions", label: "Acciones" },
  ];

  return (
    <div className="flex flex-col w-full min-w-0 pb-4">
      <div className="w-full" role="table" aria-label="Historial de ventas">
        {/* Encabezado de la tabla: Solo visible en desktop */}
        <div
          className="hidden md:grid grid-cols-recent-sales gap-4 px-6 py-4 bg-zinc-50 rounded-2xl mb-4 text-[10px] xl:text-xs font-black uppercase tracking-wider text-zinc-700 border border-zinc-100"
          role="row"
        >
          {COLUMNS.map((column) => (
            <div key={column.key} role="columnheader">
              {column.label}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 md:gap-4" role="rowgroup">
          {reversedSales.map((sale) => (
            <div key={sale.id}>
              {/* Versión Card para móvil */}
              <div className="md:hidden">
                <RecentSaleCard
                  sale={sale}
                  onStartEdit={() => startEdit(sale)}
                  onDelete={() => onDeleteSale(sale.id)}
                />
              </div>
              {/* Versión Fila para desktop */}
              <div className="hidden md:block">
                <RecentSaleRow
                  sale={sale}
                  onStartEdit={() => startEdit(sale)}
                  onDelete={() => onDeleteSale(sale.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de edición */}
      {activeEditingSale && (
        <EditSaleModal
          sale={activeEditingSale}
          isOpen={true}
          onClose={cancelEdit}
          onSave={() => saveEdit(activeEditingSale)}
          editValues={{ bs: editTotalBS, usd: editTotalUSD }}
          onEditChange={{ bs: setEditTotalBS, usd: setEditTotalUSD }}
        />
      )}
    </div>
  );
}
