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
 * Componente que renderiza una fila individual en la tabla de ventas.
 */
export function RecentSaleRow({ sale, onStartEdit, onDelete }: Props) {
  const roundTo2Decimals = (value: number) => {
    return Math.round(value * 100) / 100;
  };

  return (
    <div
      role="row"
      className="grid grid-cols-recent-sales gap-4 px-4 md:px-6 py-5 items-center bg-white hover:bg-zinc-50/50 rounded-2xl transition-all border border-zinc-100 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 group"
    >
      {/* Columna: Hora */}
      <div className="flex items-center gap-2 text-zinc-600 font-bold text-sm tabular-nums">
        <div className="p-1.5 bg-zinc-100 rounded-lg text-zinc-400">
          <Clock size={14} aria-hidden="true" />
        </div>
        {new Date(sale.fecha).toLocaleTimeString("es-VE", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>

      {/* Columna: Productos resumen */}
      <div className="flex flex-wrap gap-1.5 min-w-0">
        {sale.type === "order_payment" && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary text-white text-xs font-black uppercase tracking-widest mb-1 shadow-sm">
            Encargo
          </span>
        )}
        {sale.items.map((item, i) => (
          <span
            key={`${sale.id}-item-${i}`}
            className="inline-flex items-center px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 text-xs font-bold border border-zinc-200/50 truncate max-w-full"
            title={item.name}
          >
            <span className="text-primary mr-1">{item.quantity}x</span>{" "}
            {item.name}
          </span>
        ))}
        {sale.description && (
          <p className="text-xs font-bold text-zinc-400 italic w-full truncate">
            {sale.description}
          </p>
        )}
      </div>

      {/* Columna: Totales */}
      <div className="flex flex-col">
        <span className="text-primary font-black text-sm 2xl:text-base tracking-tight tabular-nums">
          Bs. {roundTo2Decimals(sale.totalBS)}
        </span>
        <span className="text-zinc-400 font-bold text-xs tracking-tighter tabular-nums">
          ${sale.totalUSD.toFixed(2)} USD
        </span>
      </div>

      {/* Columna: Métodos de pago registrados */}
      <div className="flex flex-col gap-1">
        {sale.payments && sale.payments.length > 0 ? (
          <div className="flex flex-col gap-1">
            {sale.payments.map((p, pIndex) => (
              <div
                key={`${sale.id}-pay-${pIndex}`}
                className="flex justify-between items-center text-xs bg-zinc-50 px-2 py-0.5 rounded border border-zinc-100"
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-100 text-primary text-xs font-black border border-primary-500 shadow-lg shadow-primary-500/20 w-fit uppercase tracking-tight">
            <CreditCard size={12} aria-hidden="true" />
            {getMethodLabel(sale.metodo)}
          </span>
        )}
      </div>

      {/* Columna: Estado de Delivery */}
      <div className="flex flex-col items-center justify-center gap-1">
        {sale.delivery ? (
          <>
            <div className="p-2 bg-green-50 text-green-600 rounded-xl border border-green-100 shadow-sm">
              <MapPin size={18} aria-hidden="true" />
            </div>
            {sale.deliveryName && (
              <span className="text-xs font-bold text-zinc-800 text-center leading-none max-w-[80px] truncate">
                {sale.deliveryName}
              </span>
            )}
            {sale.deliveryAmount !== undefined && sale.deliveryAmount > 0 && (
              <span className="text-xs font-black text-green-600 tabular-nums">
                ${sale.deliveryAmount.toFixed(2)}
              </span>
            )}
          </>
        ) : (
          <div className="size-8 flex items-center justify-center text-zinc-200">
            <span className="w-4 h-0.5 bg-current rounded-full" />
          </div>
        )}
      </div>

      {/* Columna: Acciones */}
      <div className="flex justify-end gap-1">
        <button
          onClick={onStartEdit}
          className="p-2 text-zinc-300 hover:text-primary hover:bg-primary/5 rounded-lg transition-all md:opacity-0 group-hover:opacity-100 cursor-pointer active:scale-90"
          aria-label="Editar precio de esta venta"
          title="Editar precio"
        >
          <Pencil size={18} aria-hidden="true" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all md:opacity-0 group-hover:opacity-100 cursor-pointer active:scale-90"
          aria-label="Eliminar esta venta definitivamente"
        >
          <Trash2 size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
