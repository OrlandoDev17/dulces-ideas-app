import { CircleDollarSign, Trash2 } from "lucide-react";
import { Button } from "../../common/Button";
import { Sale, Cierre } from "@/lib/types";
import { exportSalesToPDF } from "@/services/pdfService";

interface Props {
  sales: Sale[];
  cierres: Cierre[];
  onClearAll: () => void;
  handleEndDay: () => void;
}

/**
 * Cabecera de la sección de ventas recientes.
 * Contiene el título y las acciones globales (Exportar PDF y Limpiar).
 */
export function RecentSalesHeader({
  sales,
  cierres,
  onClearAll,
  handleEndDay,
}: Props) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 gap-6">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-2xl font-black text-zinc-800 tracking-tight">
          Historial del Día
        </h2>
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
          Control de ventas y cierres
        </p>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto h-12">
        <Button
          style="dashed"
          onClick={handleEndDay}
          className="flex-1 sm:flex-none h-full px-4 rounded-2xl group border-2 border-zinc-200 hover:border-primary-500 hover:bg-primary-50 transition-all"
        >
          <CircleDollarSign className="size-4 text-zinc-400 group-hover:text-primary-500" />
          <span className="text-xs font-black uppercase tracking-wider text-zinc-600 group-hover:text-primary-600">
            Cerrar Día
          </span>
        </Button>

        <Button
          style="primary"
          onClick={() => exportSalesToPDF(sales, cierres)}
          disabled={sales.length === 0}
          className="flex-1 sm:flex-none h-full px-4 rounded-2xl shadow-lg shadow-primary-500/20 text-xs font-black uppercase tracking-wider"
        >
          Exportar PDF
        </Button>

        <button
          onClick={onClearAll}
          className="size-12 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-2xl border border-zinc-100 transition-all shrink-0"
          title="Limpiar historial"
          aria-label="Limpiar historial de ventas"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </header>
  );
}
