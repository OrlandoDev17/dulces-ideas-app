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

const getMethodLabel = (id: string) => {
  return PAYMENT_METHODS.find((m) => m.id === id)?.label || id;
};

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
  return (
    <div
      role="row"
      className="grid grid-cols-[100px_1fr_150px_220px_100px_100px] gap-4 px-6 py-5 items-center bg-white hover:bg-zinc-50/50 rounded-2xl transition-all border border-zinc-100 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 group"
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
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary text-white text-[8px] font-black uppercase tracking-widest mb-1 shadow-sm">
            Encargo
          </span>
        )}
        {sale.items.map((item, i) => (
          <span
            key={`${sale.id}-item-${i}`}
            className="inline-flex items-center px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 text-[10px] 2xl:text-xs font-bold border border-zinc-200/50 truncate max-w-full"
            title={item.name}
          >
            <span className="text-primary mr-1">{item.quantity}x</span>{" "}
            {item.name}
          </span>
        ))}
        {sale.description && (
          <p className="text-[9px] font-bold text-zinc-400 italic w-full truncate">
            {sale.description}
          </p>
        )}
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
            <span className="text-primary font-black text-sm 2xl:text-base tracking-tight tabular-nums">
              Bs.{" "}
              {sale.totalBS.toLocaleString("es-VE", {
                minimumFractionDigits: 2,
              })}
            </span>
            <span className="text-zinc-400 font-bold text-[10px] 2xl:text-xs tracking-tighter tabular-nums">
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
                <span className="font-black text-primary tabular-nums">
                  {p.method === "usd"
                    ? `$${p.amountRef.toFixed(2)}`
                    : `Bs. ${p.amountBs.toFixed(2)}`}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/5 text-primary text-[10px] 2xl:text-xs font-black border border-primary/10 shadow-sm w-fit uppercase tracking-tight">
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
              <span className="text-[9px] font-bold text-zinc-800 text-center leading-none max-w-[80px] truncate">
                {sale.deliveryName}
              </span>
            )}
            {sale.deliveryAmount !== undefined && sale.deliveryAmount > 0 && (
              <span className="text-[9px] font-black text-green-600 tabular-nums">
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
              aria-label="Guardar cambios de precio"
              className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-all cursor-pointer active:scale-90"
            >
              <Check size={18} aria-hidden="true" />
            </button>
            <button
              onClick={onCancel}
              aria-label="Cancelar edición"
              className="p-2 text-zinc-400 hover:bg-zinc-100 rounded-lg transition-all cursor-pointer active:scale-90"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onStartEdit}
<<<<<<< HEAD
              className="p-2 text-zinc-300 hover:text-primary hover:bg-primary/5 rounded-lg transition-all md:opacity-0 group-hover:opacity-100 cursor-pointer active:scale-90"
              aria-label="Editar precio de esta venta"
=======
              className="p-2 text-zinc-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-all cursor-pointer"
>>>>>>> 46380ceda7b14c721b2d68418d6616abc5f89a16
              title="Editar precio"
            >
              <Pencil size={18} aria-hidden="true" />
            </button>
            <button
              onClick={onDelete}
<<<<<<< HEAD
              className="p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all md:opacity-0 group-hover:opacity-100 cursor-pointer active:scale-90"
              aria-label="Eliminar esta venta definitivamente"
=======
              className="p-2 text-zinc-700 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
              aria-label="Eliminar venta"
>>>>>>> 46380ceda7b14c721b2d68418d6616abc5f89a16
            >
              <Trash2 size={18} aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
