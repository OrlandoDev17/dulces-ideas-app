import { Sale } from "@/lib/types";
import { PAYMENT_METHODS } from "@/lib/constants";
import { Clock, CreditCard, MapPin, Pencil, Trash2 } from "lucide-react";

interface Props {
  sale: Sale;
  onStartEdit: () => void;
  onDelete: () => void;
}

const getMethodLabel = (id: string) => {
  return PAYMENT_METHODS.find((m) => m.id === id)?.label || id;
};

/**
 * Versión tipo Card para dispositivos móviles del historial de ventas.
 */
export function RecentSaleCard({ sale, onStartEdit, onDelete }: Props) {
  const roundTo2Decimals = (value: number) => {
    return Math.round(value * 100) / 100;
  };

  return (
    <div className="flex flex-col gap-4 px-4 py-4 bg-white rounded-2xl border border-zinc-100 shadow-sm active:bg-zinc-50 transition-colors">
      {/* Cabecera: Hora y Acciones */}
      <div className="flex items-center justify-between border-b border-zinc-50 pb-2">
        <div className="flex items-center gap-2 text-zinc-600 font-bold text-xs tabular-nums">
          <div className="p-1.5 bg-zinc-100 rounded-lg text-zinc-400">
            <Clock size={14} aria-hidden="true" />
          </div>
          {new Date(sale.fecha).toLocaleTimeString("es-VE", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        <div className="flex gap-1">
          <button
            onClick={onStartEdit}
            className="p-1.5 text-zinc-400 hover:text-primary hover:bg-primary/5 rounded-lg active:scale-90"
            aria-label="Editar"
          >
            <Pencil size={18} aria-hidden="true" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg active:scale-90"
            aria-label="Eliminar"
          >
            <Trash2 size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Productos */}
      <div className="flex flex-wrap gap-1.5">
        {sale.type === "order_payment" && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-sm">
            Encargo
          </span>
        )}
        {sale.items.map((item, i) => (
          <span
            key={`${sale.id}-item-${i}`}
            className="inline-flex items-center px-2 py-0.5 rounded-lg bg-zinc-100 text-zinc-700 text-[10px] font-bold border border-zinc-200/50"
          >
            <span className="text-primary mr-1">{item.quantity}x</span>{" "}
            {item.name}
          </span>
        ))}
        {sale.description && (
          <p className="text-[10px] font-bold text-zinc-400 italic w-full">
            {sale.description}
          </p>
        )}
      </div>

      {/* Totales y Pagos */}
      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-50">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-zinc-400 mb-1">
            Total
          </span>
          <span className="text-primary font-black text-sm tracking-tight tabular-nums">
            Bs. {roundTo2Decimals(sale.totalBS)}
          </span>
          <span className="text-zinc-400 font-bold text-[10px] tracking-tighter tabular-nums">
            ${sale.totalUSD.toFixed(2)} USD
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black uppercase text-zinc-400 mb-1">
            Pago
          </span>
          {sale.payments && sale.payments.length > 0 ? (
            <div className="flex flex-col gap-1">
              {sale.payments.map((p, pIndex) => (
                <div
                  key={`${sale.id}-pay-${pIndex}`}
                  className="flex justify-between items-center text-[10px] bg-zinc-50 px-2 py-0.5 rounded border border-zinc-100"
                >
                  <span className="font-bold text-zinc-500 uppercase tracking-tighter">
                    {p.method}
                  </span>
                  <span className="font-black text-primary tabular-nums">
                    {p.method === "usd"
                      ? `$${p.amountRef.toFixed(2)}`
                      : `Bs. ${p.amountBs.toFixed(2)}`}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-xl bg-primary-100 text-primary text-[10px] font-black border border-primary-500 shadow-sm w-fit uppercase tracking-tight">
              <CreditCard size={12} aria-hidden="true" className="scale-75" />
              {getMethodLabel(sale.metodo)}
            </span>
          )}
        </div>
      </div>

      {/* Delivery */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-50">
        <span className="text-[10px] font-black uppercase text-zinc-400">
          Delivery
        </span>
        <div className="flex items-center gap-2">
          {sale.delivery ? (
            <>
              <div className="p-1.5 bg-green-50 text-green-600 rounded-xl border border-green-100">
                <MapPin size={16} aria-hidden="true" />
              </div>
              <div className="flex flex-col items-end">
                {sale.deliveryName && (
                  <span className="text-[10px] font-bold text-zinc-800 leading-none truncate max-w-[120px]">
                    {sale.deliveryName}
                  </span>
                )}
                {sale.deliveryAmount !== undefined &&
                  sale.deliveryAmount > 0 && (
                    <span className="text-[10px] font-black text-green-600 tabular-nums">
                      +${sale.deliveryAmount.toFixed(2)}
                    </span>
                  )}
              </div>
            </>
          ) : (
            <span className="text-[10px] font-bold text-zinc-300">N/A</span>
          )}
        </div>
      </div>
    </div>
  );
}
