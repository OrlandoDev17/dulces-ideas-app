import { Sale, Cierre } from "@/lib/types";
import { Calculator, Bike, Info, History, Pencil, Trash2 } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { AddCierreModal } from "./AddCierreModal";

interface Props {
  sales: Sale[];
  cierres: Cierre[];
  onAddCierre: () => void;
  onUpdateCierre?: (cierre: Cierre) => void;
  onDeleteCierre?: (id: string) => void;
}

/**
 * Paneles de resumen financiero para ventas (Ingresos) y cuentas por pagar (Delivery).
 * Muestra el desglose por método de pago y los montos totales del día.
 */
export function FinancialSummary({
  sales,
  cierres,
  onAddCierre,
  onUpdateCierre,
  onDeleteCierre,
}: Props) {
  const [editingCierre, setEditingCierre] = useState<Cierre | null>(null);

  // Hook para evitar errores de hidratación sin disparar cascadas de renderizado
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Cálculos de ingresos por método
  const totals = useMemo(() => {
    let pmBs = 0;
    let pvBs = 0;
    let efBs = 0;
    let usdTotal = 0;
    let deliveryTotal = 0;
    const deliverySales: Sale[] = [];

    sales.forEach((sale) => {
      // Ingresos
      if (sale.payments && sale.payments.length > 0) {
        sale.payments.forEach((p) => {
          if (p.method === "pm") pmBs += p.amountBs;
          if (p.method === "pv") pvBs += p.amountBs;
          if (p.method === "bs") efBs += p.amountBs;
          if (p.method === "usd") usdTotal += p.amountRef;
        });
      } else {
        if (sale.metodo === "pm") pmBs += sale.totalBS;
        if (sale.metodo === "pv") pvBs += sale.totalBS;
        if (sale.metodo === "bs") efBs += sale.totalBS;
        if (sale.metodo === "usd") usdTotal += sale.totalUSD;
      }

      // Delivery
      if (sale.delivery) {
        deliverySales.push(sale);
        if (sale.deliveryAmount) deliveryTotal += sale.deliveryAmount;
      }
    });

    return {
      pmBs,
      pvBs,
      efBs,
      usdTotal,
      deliveryTotal,
      deliverySales,
      totalBs: pmBs + pvBs + efBs,
    };
  }, [sales]);

  const roundTo2Decimals = (num: number) => {
    return Math.round(num * 100) / 100;
  };

  const BOLIVARS_BOX = [
    {
      label: "Pago Móvil",
      value: totals.pmBs,
    },
    {
      label: "Punto",
      value: totals.pvBs,
    },
    {
      label: "Efectivo",
      value: totals.efBs,
    },
  ];

  if (!isMounted) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mb-2">
      {/* Panel de Ventas (Ingresos) - Diseño solicitado Marrón */}
      <article className="bg-primary-600 rounded-3xl p-6 text-white shadow-lg shadow-primary-600/50 flex flex-col gap-4 relative overflow-hidden">
        {/* Adorno visual */}
        <div className="absolute right-[-20px] top-[-20px] opacity-10 rotate-12">
          <Calculator size={150} />
        </div>

        <header className="flex items-center gap-2 border-b border-white/20 pb-3">
          <Calculator size={20} aria-hidden="true" />
          <h3 className="text-lg font-black">Ventas (Ingresos)</h3>
        </header>

        <div className="grid grid-cols-2 gap-6 relative z-10">
          {/* Columna Bolívares */}
          <section className="flex flex-col gap-2">
            <span
              className="text-[12px] font-black uppercase tracking-widest text-white bg-black/10 
            px-2 py-0.5 rounded w-fit"
            >
              Caja Bolívares
            </span>
            <div className="flex flex-col gap-1.5">
              {BOLIVARS_BOX.map((box) => (
                <div
                  key={box.label}
                  className="flex justify-between text-sm font-medium"
                >
                  <span className="text-white/90">{box.label}:</span>
                  <span className="font-black tabular-nums">
                    {box.value > 0 ? roundTo2Decimals(box.value) : "0.00"}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Columna Divisas */}
          <section className="flex flex-col gap-2 border-l border-white/20 pl-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/90 bg-black/10 px-2 py-0.5 rounded w-fit">
              Caja Divisas
            </span>
            <div className="flex flex-col">
              <span className="text-4xl font-black tabular-nums">
                ${totals.usdTotal.toFixed(2)}
              </span>
            </div>
          </section>
        </div>

        <footer className="mt-2 flex flex-col gap-4">
          <div className="flex justify-between items-center border-t border-white/20 pt-4">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-tighter text-white/60">
                Total Ingresos
              </span>
              <span className="text-2xl font-black tabular-nums">
                Bs.{" "}
                {totals.totalBs > 0 ? roundTo2Decimals(totals.totalBs) : "0.00"}
              </span>
            </div>

            <button
              onClick={onAddCierre}
              aria-label="Registrar un nuevo cierre de caja"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tight transition-all border border-white/20 cursor-pointer backdrop-blur-sm active:scale-95"
            >
              Agregar Cierre
            </button>
          </div>

          {/* Sección de Cierres Registrados */}
          {cierres.length > 0 && (
            <div className="bg-black/10 rounded-2xl p-3 flex flex-col gap-2">
              <span className="text-xs font-black uppercase flex items-center gap-1.5 text-white/70">
                <History size={10} aria-hidden="true" /> Historial de Cierres de
                Hoy
              </span>
              <div className="flex flex-wrap gap-2">
                {cierres.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white/10 px-2.5 py-1 rounded-lg flex items-center gap-3 border 
                    border-white/5 group relative transition-all"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-black tracking-wide tabular-nums text-white">
                        Bs. {c.monto.toLocaleString("es-VE")}
                      </span>
                      <span className="text-[8px] font-bold text-white/60 tabular-nums uppercase">
                        {new Date(c.fecha).toLocaleTimeString("es-VE", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-black/20 rounded-md p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingCierre(c)}
                        className="p-1 hover:text-primary-300 transition-colors"
                        title="Editar cierre"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={() => onDeleteCierre?.(c.id)}
                        className="p-1 hover:text-red-400 transition-colors"
                        title="Eliminar cierre"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </footer>
      </article>

      {/* Modal para editar cierres */}
      {editingCierre && (
        <AddCierreModal
          isOpen={true}
          onClose={() => setEditingCierre(null)}
          onConfirm={(monto) => {
            onUpdateCierre?.({ ...editingCierre, monto });
            setEditingCierre(null);
          }}
        />
      )}

      {/* Panel de Cuentas x Pagar (Deliverys) */}
      <article className="bg-white rounded-3xl p-6 border-l-4 border-l-red-500 shadow-xl border border-zinc-100 flex flex-col gap-4 relative overflow-hidden">
        <header className="flex items-center gap-2 border-b border-zinc-100 pb-3">
          <Bike size={20} className="text-zinc-600" aria-hidden="true" />
          <h3 className="text-lg font-black text-zinc-800 tracking-tight">
            Cuentas x Pagar
          </h3>
        </header>

        <div className="flex flex-col gap-3 min-h-[100px]">
          {totals.deliverySales.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {totals.deliverySales.map((sale) => (
                <li
                  key={sale.id}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-zinc-500 font-bold">
                    {sale.deliveryName || "Delivery s/n"}
                  </span>
                  <span className="font-black text-zinc-700 tabular-nums">
                    Bs.{" "}
                    {(sale.deliveryAmount || 0).toLocaleString("es-VE", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-zinc-400 gap-1 opacity-80">
              <Info size={24} aria-hidden="true" />
              <span className="text-xs font-black uppercase tracking-tight">
                No hay deudas de delivery
              </span>
            </div>
          )}
        </div>

        <footer className="mt-auto pt-4 border-t-2 border-red-500">
          <div className="flex justify-between items-center">
            <span className="text-lg font-black text-zinc-800">
              Total Deuda:
            </span>
            <span className="text-lg font-black text-zinc-800 tabular-nums">
              Bs.{" "}
              {totals.deliveryTotal.toLocaleString("es-VE", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </footer>
      </article>
    </div>
  );
}
