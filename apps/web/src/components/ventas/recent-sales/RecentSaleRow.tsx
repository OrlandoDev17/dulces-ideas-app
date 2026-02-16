import { Sale } from "@/lib/types";
import { PAYMENT_METHODS } from "@/lib/constants";
import {
  Clock,
  CreditCard,
  MapPin,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";

interface Props {
  sale: Sale;
  isEditing: boolean;
  editValues: { bs: number; usd: number };
  onEditChange: { bs: (v: number) => void; usd: (v: number) => void };
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

/**
 * Componente que renderiza una fila individual en la tabla de ventas.
 * Incluye la lógica visual para el modo edición de precios.
 */
export function RecentSaleRow({
  sale,
  isEditing,
  editValues,
  onEditChange,
  onStartEdit,
  onSave,
  onCancel,
  onDelete,
}: Props) {
  const getMethodLabel = (id: string) => {
    return PAYMENT_METHODS.find((m) => m.id === id)?.label || id;
  };

  return (
    <div
      role="row"
      className="grid grid-cols-[100px_1fr_150px_220px_100px_100px] gap-4 px-6 py-5 items-center bg-white hover:bg-zinc-50/50 rounded-2xl transition-all border border-zinc-100 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 group"
    >
      {/* Columna: Hora */}
      <div className="flex items-center gap-2 text-zinc-600 font-bold text-sm">
        <div className="p-1.5 bg-zinc-100 rounded-lg text-zinc-400">
          <Clock size={14} />
        </div>
        {new Date(sale.fecha).toLocaleTimeString("es-VE", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>

      {/* Columna: Productos resumen */}
      <div className="flex flex-wrap gap-1.5">
        {sale.items.map((item, i) => (
          <span
            key={`${sale.id}-item-${i}`}
            className="inline-flex items-center px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 text-[10px] 2xl:text-xs font-bold border border-zinc-200/50"
          >
            <span className="text-primary mr-1">{item.quantity}x</span>{" "}
            {item.name}
          </span>
        ))}
      </div>

      {/* Columna: Totales (Con soporte para edición) */}
      <div className="flex flex-col">
        {isEditing ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-zinc-400">Bs.</span>
              <input
                type="number"
                value={editValues.bs}
                onChange={(e) => onEditChange.bs(Number(e.target.value))}
                className="w-full bg-zinc-50 border border-primary/30 rounded px-1 py-0.5 text-xs font-bold outline-none focus:border-primary"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-zinc-400">$</span>
              <input
                type="number"
                value={editValues.usd}
                onChange={(e) => onEditChange.usd(Number(e.target.value))}
                className="w-full bg-zinc-50 border border-primary/30 rounded px-1 py-0.5 text-xs font-bold outline-none focus:border-primary"
              />
            </div>
          </div>
        ) : (
          <>
            <span className="text-primary font-black text-sm 2xl:text-base tracking-tight">
              Bs.{" "}
              {sale.totalBS.toLocaleString("es-VE", {
                minimumFractionDigits: 2,
              })}
            </span>
            <span className="text-zinc-400 font-bold text-[10px] 2xl:text-xs tracking-tighter">
              ${sale.totalUSD.toFixed(2)} USD
            </span>
          </>
        )}
      </div>

      {/* Columna: Métodos de pago registrados */}
      <div className="flex flex-col gap-1">
        {sale.payments && sale.payments.length > 0 ? (
          <div className="flex flex-col gap-1">
            {sale.payments.map((p, pIndex) => (
              <div
                key={`${sale.id}-pay-${pIndex}`}
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

      {/* Columna: Estado de Delivery */}
      <div className="flex flex-col items-center justify-center gap-1">
        {sale.delivery ? (
          <>
            <div className="p-2 bg-green-50 text-green-600 rounded-xl border border-green-100 shadow-sm">
              <MapPin size={18} />
            </div>
            {sale.deliveryName && (
              <span className="text-[9px] font-bold text-zinc-800 text-center leading-none max-w-[80px] truncate">
                {sale.deliveryName}
              </span>
            )}
            {sale.deliveryAmount !== undefined && sale.deliveryAmount > 0 && (
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

      {/* Columna: Acciones (Editar/Eliminar/Guardar) */}
      <div className="flex justify-end gap-1">
        {isEditing ? (
          <>
            <button
              onClick={onSave}
              className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-all cursor-pointer"
            >
              <Check size={18} />
            </button>
            <button
              onClick={onCancel}
              className="p-2 text-zinc-400 hover:bg-zinc-100 rounded-lg transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onStartEdit}
              className="p-2 text-zinc-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-all cursor-pointer"
              title="Editar precio"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-zinc-700 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
              aria-label="Eliminar venta"
            >
              <Trash2 size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
