import { Sale, Cierre } from "@/lib/types";
import { Calculator, Bike, Info, History } from "lucide-react";
import { useMemo } from "react";

interface Props {
  sales: Sale[];
  cierres: Cierre[];
  onAddCierre: () => void;
}

/**
 * Paneles de resumen financiero para ventas (Ingresos) y cuentas por pagar (Delivery).
 * Muestra el desglose por método de pago y los montos totales del día.
 */
export function FinancialSummary({ sales, cierres, onAddCierre }: Props) {
  // Cálculos de ingresos por método
  const totals = useMemo(() => {
    let pmBs = 0;
    let pvBs = 0;
    let efBs = 0;
    let usdTotal = 0;
    let deliveryTotal = 0;

    sales.forEach((sale) => {
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
      if (sale.deliveryAmount) deliveryTotal += sale.deliveryAmount;
    });

    return {
      pmBs,
      pvBs,
      efBs,
      usdTotal,
      deliveryTotal,
      totalBs: pmBs + pvBs + efBs,
    };
  }, [sales]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mb-2">
      {/* Panel de Ventas (Ingresos) - Diseño solicitado Marrón */}
      <article className="bg-[#8B6D61] rounded-3xl p-6 text-white shadow-xl flex flex-col gap-4 relative overflow-hidden">
        {/* Adorno visual */}
        <div className="absolute right-[-20px] top-[-20px] opacity-10 rotate-12">
          <Calculator size={150} />
        </div>

        <header className="flex items-center gap-2 border-b border-white/20 pb-3">
          <Calculator size={20} />
          <h3 className="text-lg font-bold">Ventas (Ingresos)</h3>
        </header>

        <div className="grid grid-cols-2 gap-6 relative z-10">
          {/* Columna Bolívares */}
          <section className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              Caja Bolívares
            </span>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-white/80">Pago Móvil:</span>
                <span className="font-bold">
                  {totals.pmBs.toLocaleString("es-VE", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-white/80">Punto:</span>
                <span className="font-bold">
                  {totals.pvBs.toLocaleString("es-VE", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-white/80">Efectivo:</span>
                <span className="font-bold">
                  {totals.efBs.toLocaleString("es-VE", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </section>

          {/* Columna Divisas */}
          <section className="flex flex-col gap-2 border-l border-white/20 pl-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              Caja Divisas
            </span>
            <div className="flex flex-col">
              <span className="text-4xl font-black">
                ${totals.usdTotal.toFixed(2)}
              </span>
            </div>
          </section>
        </div>

        <footer className="mt-2 flex flex-col gap-4">
          <div className="flex justify-between items-center border-t border-white/20 pt-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-tighter text-white/60">
                Total Recaudado
              </span>
              <span className="text-2xl font-black">
                Bs.{" "}
                {totals.totalBs.toLocaleString("es-VE", {
                  minimumFractionDigits: 0,
                })}
              </span>
            </div>

            <button
              onClick={onAddCierre}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border border-white/20 cursor-pointer backdrop-blur-sm"
            >
              Agregar Cierre
            </button>
          </div>

          {/* Sección de Cierres Registrados */}
          {cierres.length > 0 && (
            <div className="bg-black/10 rounded-2xl p-3 flex flex-col gap-2">
              <span className="text-[9px] font-black uppercase flex items-center gap-1.5 text-white/50">
                <History size={10} /> Historial de Cierres de Hoy
              </span>
              <div className="flex flex-wrap gap-2">
                {cierres.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white/10 px-2.5 py-1 rounded-lg flex items-center gap-2 border border-white/5"
                  >
                    <span className="text-[10px] font-black">
                      Bs. {c.monto.toLocaleString("es-VE")}
                    </span>
                    <span className="text-[8px] font-bold text-white/40">
                      {new Date(c.fecha).toLocaleTimeString("es-VE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </footer>
      </article>

      {/* Panel de Cuentas x Pagar (Deliverys) */}
      <article className="bg-white rounded-3xl p-6 border-l-4 border-l-red-500 shadow-xl border border-zinc-100 flex flex-col gap-4 relative overflow-hidden">
        <header className="flex items-center gap-2 border-b border-zinc-300 pb-3">
          <Bike size={20} className="text-zinc-600" />
          <h3 className="text-lg font-bold text-zinc-800 tracking-tight">
            Cuentas x Pagar
          </h3>
        </header>

        <div className="flex flex-col gap-3 min-h-[100px]">
          {sales.filter((s) => s.delivery).length > 0 ? (
            <ul className="flex flex-col gap-2">
              {sales
                .filter((s) => s.delivery)
                .map((sale) => (
                  <li
                    key={sale.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-zinc-500 font-bold">
                      {sale.deliveryName || "Delivery s/n"}
                    </span>
                    <span className="font-black text-zinc-700">
                      Bs.{" "}
                      {(sale.deliveryAmount || 0).toLocaleString("es-VE", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </li>
                ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-zinc-500 gap-1">
              <Info size={24} />
              <span className="text-xs font-bold uppercase">
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
            <span className="text-lg font-black text-zinc-800">
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
