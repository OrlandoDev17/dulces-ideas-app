import { Trash2, ShoppingBag, MapPin, CreditCard, Clock } from "lucide-react";
import { Sale } from "@/lib/types";
import { PAYMENT_METHODS } from "@/lib/constants";

interface Props {
  sales: Sale[];
  onDeleteSale: (id: string) => void;
  onClearAll: () => void;
}

export function RecentSales({ sales, onDeleteSale, onClearAll }: Props) {
  const getMethodLabel = (id: string) => {
    return PAYMENT_METHODS.find((m) => m.id === id)?.label || id;
  };

  return (
    <section className="flex flex-col gap-6 w-full bg-white p-6 rounded-3xl border border-zinc-100 shadow-2xl shadow-primary/10 mt-4 overflow-hidden">
      <header className="flex justify-between items-center px-2">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl 2xl:text-2xl text-primary font-bold">
            Ventas Recientes
          </h2>
          <p className="text-sm text-zinc-500 font-medium">
            Historial de transacciones de hoy
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 border-2 border-primary/20 text-primary px-4 py-2 text-sm font-bold rounded-xl hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer shadow-sm">
            Exportar PDF
          </button>
          <button
            onClick={onClearAll}
            className="p-2.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
            title="Limpiar historial"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </header>

      <div className="flex flex-col w-full overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Table Header using Grid */}
          <div className="grid grid-cols-[100px_1fr_120px_180px_100px_80px] gap-4 px-6 py-3 bg-zinc-50 rounded-2xl mb-4 text-[10px] 2xl:text-xs font-black uppercase tracking-wider text-zinc-400 border border-zinc-100">
            <div>Hora</div>
            <div>Resumen de productos</div>
            <div>Total</div>
            <div>Método de pago</div>
            <div className="text-center">Delivery</div>
            <div className="text-right">Acciones</div>
          </div>

          {/* Table Body */}
          <div className="flex flex-col gap-3">
            {sales.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-zinc-400 gap-4 bg-zinc-50/30 rounded-3xl border border-dashed border-zinc-200">
                <div className="p-4 bg-white rounded-full shadow-sm">
                  <ShoppingBag size={40} className="text-zinc-200" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-zinc-500">
                    No hay ventas registradas
                  </p>
                  <p className="text-xs uppercase tracking-tighter text-zinc-400 font-medium">
                    Las ventas nuevas aparecerán aquí
                  </p>
                </div>
              </div>
            ) : (
              [...sales].reverse().map((sale) => (
                <div
                  key={sale.id}
                  className="grid grid-cols-[100px_1fr_120px_180px_100px_80px] gap-4 px-6 py-5 items-center bg-white hover:bg-zinc-50/50 rounded-2xl transition-all border border-zinc-100 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 group"
                >
                  {/* Hora */}
                  <div className="flex items-center gap-2 text-zinc-600 font-bold text-sm">
                    <div className="p-1.5 bg-zinc-100 rounded-lg text-zinc-400">
                      <Clock size={14} />
                    </div>
                    {new Date(sale.fecha).toLocaleTimeString("es-VE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>

                  {/* Resumen */}
                  <div className="flex flex-wrap gap-1.5">
                    {sale.items.map((item, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 text-[10px] 2xl:text-xs font-bold border border-zinc-200/50"
                      >
                        <span className="text-primary mr-1">
                          {item.quantity}x
                        </span>{" "}
                        {item.name}
                      </span>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex flex-col">
                    <span className="text-primary font-black text-sm 2xl:text-base tracking-tight">
                      Bs.{" "}
                      {sale.totalBS.toLocaleString("es-VE", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                    <span className="text-zinc-400 font-bold text-[10px] 2xl:text-xs tracking-tighter">
                      ${sale.totalUSD.toFixed(2)} USD
                    </span>
                  </div>

                  {/* Método */}
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/5 text-primary text-[10px] 2xl:text-xs font-black border border-primary/10 shadow-sm">
                      <CreditCard size={12} />
                      {getMethodLabel(sale.metodo)}
                    </span>
                  </div>

                  {/* Delivery */}
                  <div className="flex justify-center">
                    {sale.delivery ? (
                      <div
                        className="p-2 bg-green-50 text-green-600 rounded-xl border border-green-100 shadow-sm"
                        title="Es Delivery"
                      >
                        <MapPin size={18} />
                      </div>
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center text-zinc-200">
                        <span className="w-4 h-0.5 bg-current rounded-full" />
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => onDeleteSale(sale.id)}
                      className="p-2.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all md:opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
