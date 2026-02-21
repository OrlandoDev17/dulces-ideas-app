import { Sale } from "@/lib/types";
import { RecentSaleRow } from "./RecentSaleRow";
import { useRecentSalesEdit } from "@/hooks/useRecentSalesEdit";
import { ShoppingBag } from "lucide-react";
import { useMemo } from "react";

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

  return (
    <div className="flex flex-col w-full overflow-x-auto">
      <div
        className="min-w-[800px]"
        role="table"
        aria-label="Historial de ventas"
      >
        {/* Encabezado de la tabla usando CSS Grid para alineación perfecta */}
        <div
          className="grid grid-cols-[100px_1fr_150px_220px_100px_100px] gap-4 px-6 py-3 bg-zinc-50 rounded-2xl mb-4 text-[10px] 2xl:text-xs font-black uppercase tracking-wider text-zinc-400 border border-zinc-100"
          role="row"
        >
          <div role="columnheader">Hora</div>
          <div role="columnheader">Productos</div>
          <div role="columnheader">Total</div>
          <div role="columnheader">Pagos</div>
          <div role="columnheader" className="text-center">
            Delivery
          </div>
          <div role="columnheader" className="text-right">
            Acciones
          </div>
        </div>

        <div className="flex flex-col gap-3" role="rowgroup">
          {reversedSales.map((sale) => (
            <RecentSaleRow
              key={sale.id}
              sale={sale}
              isEditing={editingSaleId === sale.id}
              editValues={{ bs: editTotalBS, usd: editTotalUSD }}
              onEditChange={{ bs: setEditTotalBS, usd: setEditTotalUSD }}
              onStartEdit={() => startEdit(sale)}
              onSave={() => saveEdit(sale)}
              onCancel={cancelEdit}
              onDelete={() => onDeleteSale(sale.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
