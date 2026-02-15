import { Trash2, ShoppingBag, MapPin, CreditCard, Clock } from "lucide-react";
import { Sale } from "@/lib/types";
import { PAYMENT_METHODS } from "@/lib/constants";
import { Button } from "../common/Button";

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
    <section
      className="flex flex-col gap-6 w-full bg-white p-6 rounded-3xl border 
    border-zinc-100 shadow-lg shadow-zinc-500/20 mt-4 overflow-hidden"
    >
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-2 gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl 2xl:text-2xl text-primary font-bold">
            Ventas Recientes
          </h2>
          <p className="text-sm text-zinc-500 font-medium">
            Historial de transacciones de hoy
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button style="primary" className="flex-1 sm:flex-none">
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

      <div className="flex flex-col w-full overflow-x-auto">
        <div
          className="min-w-[800px]"
          role="table"
          aria-label="Historial de ventas"
        >
          {/* Table Header using Grid */}
          <div
            className="grid grid-cols-[100px_1fr_120px_220px_100px_80px] gap-4 px-6 py-3 bg-zinc-50 rounded-2xl mb-4 text-[10px] 2xl:text-xs font-black uppercase tracking-wider text-zinc-400 border border-zinc-100"
            role="row"
          >
            <div role="columnheader">Hora</div>
            <div role="columnheader">Resumen de productos</div>
            <div role="columnheader">Total</div>
            <div role="columnheader">Métodos de pago</div>
            <div role="columnheader" className="text-center">
              Delivery
            </div>
            <div role="columnheader" className="text-right">
              Acciones
            </div>
          </div>

          <div className="flex flex-col gap-3" role="rowgroup">
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
              [...sales].reverse().map((sale, index) => (
                <div
                  key={`${sale.id || "sale"}-${index}`}
                  role="row"
                  className="grid grid-cols-[100px_1fr_120px_220px_100px_80px] gap-4 px-6 py-5 items-center bg-white hover:bg-zinc-50/50 rounded-2xl transition-all border border-zinc-100 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 group"
                >
                  {/* Hora */}
                  <div
                    className="flex items-center gap-2 text-zinc-600 font-bold text-sm"
                    role="cell"
                  >
                    <div className="p-1.5 bg-zinc-100 rounded-lg text-zinc-400">
                      <Clock size={14} />
                    </div>
                    {new Date(sale.fecha).toLocaleTimeString("es-VE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>

                  {/* Resumen */}
                  <div className="flex flex-wrap gap-1.5" role="cell">
                    {sale.items.map((item, i) => (
                      <span
                        key={`item-${sale.id}-${i}`}
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
                  <div className="flex flex-col" role="cell">
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

                  {/* Métodos de Pago */}
                  <div className="flex flex-col gap-1" role="cell">
                    {sale.payments && sale.payments.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {sale.payments.map((p, pIndex) => (
                          <div
                            key={`${p.id || "pay"}-${pIndex}`}
                            className="flex justify-between items-center text-[9px] 2xl:text-[10px] bg-zinc-50 px-2 py-0.5 rounded border border-zinc-100"
                          >
                            <span className="font-bold text-zinc-500 uppercase tracking-tighter">
                              {p.method}
                            </span>
                            <span className="font-black text-primary">
                              {p.method === "usd"
                                ? `$${p.amountRef.toFixed(2)}`
                                : `Bs. ${p.amountBs.toFixed(2)}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/5 text-primary text-[10px] 2xl:text-xs font-black border border-primary/10 shadow-sm w-fit">
                        <CreditCard size={12} />
                        {getMethodLabel(sale.metodo)}
                      </span>
                    )}
                  </div>

                  {/* Delivery */}
                  <div
                    className="flex flex-col items-center justify-center gap-1"
                    role="cell"
                  >
                    {sale.delivery ? (
                      <>
                        <div
                          className="p-2 bg-green-50 text-green-600 rounded-xl border border-green-100 shadow-sm"
                          title={
                            sale.deliveryName
                              ? `Repartidor: ${sale.deliveryName}`
                              : "Es Delivery"
                          }
                        >
                          <MapPin size={18} />
                        </div>
                        {sale.deliveryName && (
                          <span className="text-[9px] font-bold text-zinc-500 text-center leading-none max-w-[80px] truncate">
                            {sale.deliveryName}
                          </span>
                        )}
                        {sale.deliveryAmount !== undefined &&
                          sale.deliveryAmount > 0 && (
                            <span className="text-[9px] font-black text-green-600">
                              ${sale.deliveryAmount.toFixed(2)}
                            </span>
                          )}
                      </>
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center text-zinc-200">
                        <span className="w-4 h-0.5 bg-current rounded-full" />
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex justify-end" role="cell">
                    <button
                      onClick={() => onDeleteSale(sale.id)}
                      className="p-2.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all md:opacity-0 group-hover:opacity-100 cursor-pointer"
                      aria-label="Eliminar venta"
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
