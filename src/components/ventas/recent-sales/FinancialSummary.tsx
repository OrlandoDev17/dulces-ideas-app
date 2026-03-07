import { Sale, Cierre } from "@/lib/types";
import { Calculator, Bike, Info, History, Pencil, Trash2 } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { AddCierreModal } from "./AddCierreModal";
import { fmtBs, fmtUSD } from "@/lib/formatters";

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
    const deliveryGrouped: Record<string, number> = {};

    sales.forEach((sale) => {
      const payments = sale.sale_payments || [];
      const totalBs = sale.total_bs || sale.totalBs || 0;
      const totalUsd = sale.total_usd || sale.totalUsd || 0;
      const deliveryAmt = sale.delivery_amount || sale.deliveryAmount || 0;
      const tasa = sale.tasa_bcv || 1;

      // Ingresos (Descontando Delivery si aplica)
      if (payments.length > 0) {
        // Calculamos el total pagado en Bs para prorratear el descuento de delivery
        const totalPaidInBs = payments.reduce(
          (acc, p) => acc + (p.amount_bs || p.amountBs || 0),
          0,
        );

        payments.forEach((p) => {
          const mId = p.method_id || p.methodId;
          const amtBs = p.amount_bs || p.amountBs || 0;
          const amtRef = p.amount_ref || p.amountRef || 0;

          // Si hay delivery, restamos la parte proporcional del pago
          let finalAmtBs = amtBs;
          let finalAmtRef = amtRef;

          if (deliveryAmt > 0 && totalPaidInBs > 0) {
            const factor = amtBs / totalPaidInBs;
            const discountBs = deliveryAmt * factor;
            finalAmtBs = Math.max(0, amtBs - discountBs);
            finalAmtRef = Math.max(0, amtRef - discountBs / tasa);
          }

          if (mId === "pm") pmBs += finalAmtBs;
          if (mId === "punto" || mId === "pv") pvBs += finalAmtBs;
          if (mId === "ves" || mId === "bs") efBs += finalAmtBs;
          if (mId === "usd") usdTotal += finalAmtRef;
        });
      } else {
        // Fallback para ventas sin desglose de pagos detallado
        const met = sale.method_id || sale.metodo;
        const finalTotalBs = Math.max(0, totalBs - deliveryAmt);
        const finalTotalUsd = Math.max(0, totalUsd - deliveryAmt / tasa);

        if (met === "pm") pmBs += finalTotalBs;
        if (met === "punto" || met === "pv") pvBs += finalTotalBs;
        if (met === "ves" || met === "bs") efBs += finalTotalBs;
        if (met === "usd") usdTotal += finalTotalUsd;
      }

      // Deuda de Delivery (Cuentas por pagar)
      if (sale.delivery) {
        const name = sale.delivery_name || sale.deliveryName || "Delivery s/n";
        const amount = sale.delivery_amount || sale.deliveryAmount || 0;
        deliveryGrouped[name] = (deliveryGrouped[name] || 0) + amount;
        deliveryTotal += amount;
      }
    });

    // Convertir el objeto agrupado a un array para el renderizado
    const deliverySummary = Object.entries(deliveryGrouped).map(
      ([name, total]) => ({
        name,
        total,
      }),
    );

    return {
      pmBs,
      pvBs,
      efBs,
      usdTotal,
      deliveryTotal,
      deliverySummary,
      totalBs: pmBs + pvBs + efBs,
    };
  }, [sales]);

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

  if (!isMounted) return <FinancialSummarySkeleton />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-2">
      {/* Panel de Ventas (Ingresos) - Diseño solicitado Marrón */}
      <article className="bg-primary-600 rounded-3xl p-4 md:p-6 text-white shadow-lg shadow-primary-600/30 flex flex-col gap-4 relative overflow-hidden">
        {/* Adorno visual */}
        <div className="absolute -right-5 -top-5 opacity-10 rotate-12">
          <Calculator size={150} />
        </div>

        <header className="flex items-center gap-2 border-b border-white/20 pb-3">
          <Calculator size={20} aria-hidden="true" />
          <h3 className="text-base md:text-lg font-black">Ventas (Ingresos)</h3>
        </header>

        <div className="grid grid-cols-2 gap-4 md:gap-6 relative z-10">
          {/* Columna Bolívares */}
          <section className="flex flex-col gap-2">
            <span
              className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white bg-black/10 
            px-2 py-0.5 rounded w-fit"
            >
              Caja Bolívares
            </span>
            <div className="flex flex-col gap-1.5">
              {BOLIVARS_BOX.map((box) => (
                <div
                  key={box.label}
                  className="flex justify-between text-[10px] md:text-sm font-medium"
                >
                  <span className="text-white/90">{box.label}:</span>
                  <span className="font-black tabular-nums">
                    {fmtBs(box.value)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Columna Divisas */}
          <section className="flex flex-col gap-2 border-l border-white/20 pl-6">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/90 bg-black/10 px-2 py-0.5 rounded w-fit">
              Caja Divisas
            </span>
            <div className="flex flex-col">
              <span className="text-3xl md:text-4xl font-black tabular-nums">
                ${fmtUSD(totals.usdTotal)}
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
              <span className="text-lg md:text-2xl font-black tabular-nums">
                Bs. {fmtBs(totals.totalBs)}
              </span>
            </div>

            <button
              onClick={onAddCierre}
              aria-label="Registrar un nuevo cierre de caja"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-tight transition-all border border-white/20 cursor-pointer backdrop-blur-sm active:scale-95"
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
                    border-white/10 group relative transition-all"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-black tracking-wide tabular-nums text-white">
                        Bs. {fmtBs(c.monto)}
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
                        className="p-1 hover:text-white transition-colors"
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
          {totals.deliverySummary.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {totals.deliverySummary.map((item, index) => (
                <li
                  key={`delivery-${index}`}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-zinc-500 font-bold">{item.name}</span>
                  <span className="font-black text-zinc-700 tabular-nums">
                    Bs. {fmtBs(item.total)}
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
              Bs. {fmtBs(totals.deliveryTotal)}
            </span>
          </div>
        </footer>
      </article>
    </div>
  );
}

export function FinancialSummarySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-2">
      {/* Skeleton: Ventas (Ingresos) */}
      <article className="bg-primary-600/80 rounded-3xl p-4 md:p-6 flex flex-col gap-4 animate-pulse">
        {/* Header */}
        <header className="flex items-center gap-2 border-b border-white/20 pb-3">
          <div className="size-5 bg-white/20 rounded" />
          <div className="h-5 w-40 bg-white/20 rounded-lg" />
        </header>

        {/* Grid de contenido */}
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {/* Columna Bolívares */}
          <div className="flex flex-col gap-2">
            <div className="h-5 w-28 bg-white/10 rounded" />
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between">
                <div className="h-3 w-16 bg-white/15 rounded" />
                <div className="h-3 w-10 bg-white/15 rounded" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 w-12 bg-white/15 rounded" />
                <div className="h-3 w-10 bg-white/15 rounded" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 w-14 bg-white/15 rounded" />
                <div className="h-3 w-10 bg-white/15 rounded" />
              </div>
            </div>
          </div>

          {/* Columna Divisas */}
          <div className="flex flex-col gap-2 border-l border-white/20 pl-6">
            <div className="h-5 w-24 bg-white/10 rounded" />
            <div className="h-10 w-28 bg-white/15 rounded-lg" />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-2 flex justify-between items-center border-t border-white/20 pt-4">
          <div className="flex flex-col gap-1">
            <div className="h-3 w-24 bg-white/10 rounded" />
            <div className="h-7 w-32 bg-white/15 rounded-lg" />
          </div>
          <div className="h-9 w-28 bg-white/10 rounded-xl" />
        </div>
      </article>

      {/* Skeleton: Cuentas x Pagar (Delivery) */}
      <article className="bg-white rounded-3xl p-6 border-l-4 border-l-zinc-200 shadow-xl border border-zinc-100 flex flex-col gap-4 animate-pulse">
        {/* Header */}
        <header className="flex items-center gap-2 border-b border-zinc-100 pb-3">
          <div className="size-5 bg-zinc-200 rounded" />
          <div className="h-5 w-36 bg-zinc-200 rounded-lg" />
        </header>

        {/* Content */}
        <div className="flex flex-col gap-3 min-h-[100px] items-center justify-center">
          <div className="size-6 bg-zinc-100 rounded-full" />
          <div className="h-3 w-40 bg-zinc-200 rounded" />
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t-2 border-zinc-200">
          <div className="flex justify-between items-center">
            <div className="h-5 w-24 bg-zinc-200 rounded-lg" />
            <div className="h-5 w-20 bg-zinc-200 rounded-lg" />
          </div>
        </div>
      </article>
    </div>
  );
}
