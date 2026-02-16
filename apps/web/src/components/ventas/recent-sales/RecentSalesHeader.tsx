import { Trash2 } from "lucide-react";
import { Button } from "../../common/Button";
import { Sale, Cierre } from "@/lib/types";
import { exportSalesToPDF } from "@/services/pdfService";

interface Props {
  sales: Sale[];
  cierres: Cierre[];
  onClearAll: () => void;
}

/**
 * Cabecera de la sección de ventas recientes.
 * Contiene el título y las acciones globales (Exportar PDF y Limpiar).
 */
export function RecentSalesHeader({ sales, cierres, onClearAll }: Props) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-2 gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl 2xl:text-2xl text-primary font-bold">
          Historial del Día
        </h2>
        <p className="text-sm text-zinc-500 font-medium">
          Control detallado de ventas y cierres registrados
        </p>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Button
          style="primary"
          className="flex-1 sm:flex-none"
          onClick={() => exportSalesToPDF(sales, cierres)}
          disabled={sales.length === 0}
        >
          Exportar PDF
        </Button>
        <button
          onClick={onClearAll}
          className="p-2.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
          title="Limpiar historial"
          aria-label="Limpiar historial de ventas"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </header>
  );
}
