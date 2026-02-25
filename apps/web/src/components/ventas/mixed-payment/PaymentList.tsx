import { AnimatePresence, motion } from "motion/react";
import {
  CreditCard,
  Trash2,
  Banknote,
  Smartphone,
  DollarSign,
} from "lucide-react";
import { Payment } from "@/lib/types";
import { PAYMENT_METHODS } from "@/lib/constants";

interface Props {
  payments: Payment[];
  onRemove: (id: string) => void;
}

/**
 * Obtiene el icono correspondiente al método de pago.
 */
const getMethodIcon = (id: string) => {
  switch (id) {
    case "bs":
      return <Banknote size={16} />;
    case "pm":
      return <Smartphone size={16} />;
    case "usd":
      return <DollarSign size={16} />;
    default:
      return <CreditCard size={16} />;
  }
};

/**
 * Obtiene el nombre legible del método de pago.
 */
const getMethodLabel = (id: string) => {
  return PAYMENT_METHODS.find((p) => p.id === id)?.label || id;
};

/**
 * Lista animada de los pagos parciales agregados al pago mixto.
 */
export function PaymentList({ payments, onRemove }: Props) {
  return (
    <section className="flex flex-col gap-3 min-h-[120px]">
      {/* Contador de pagos registrados */}
      <label className="text-xs font-bold uppercase text-zinc-400 tracking-wider ml-1 flex justify-between items-center">
        <span>Pagos Registrados</span>
        <span className="bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-md text-[10px]">
          {payments.length}
        </span>
      </label>

      <ul className="flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {payments.length === 0 ? (
            /* Estado vacío */
            <motion.div
              key="empty-payments"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-8 text-zinc-300 gap-2 border-2 border-dashed border-zinc-100 rounded-2xl"
            >
              <CreditCard size={32} />
              <span className="text-sm font-medium">
                No hay pagos registrados
              </span>
            </motion.div>
          ) : (
            /* Lista de líneas de pago */
            payments.map((p) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center justify-between p-3 bg-white border border-zinc-100 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${p.method === "usd" ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"}`}
                  >
                    {getMethodIcon(p.method)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs md:text-sm font-bold text-zinc-700">
                      {getMethodLabel(p.method)}
                    </span>
                    <span className="text-[8px] md:text-xs text-zinc-400">
                      {p.method === "usd"
                        ? `Bs. ${p.amountBs.toLocaleString("es-VE", { minimumFractionDigits: 2 })}`
                        : `Ref: $${p.amountRef.toFixed(2)}`}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs md:text-base font-mono font-bold text-zinc-700">
                    {p.method === "usd"
                      ? `$ ${p.amountRef.toFixed(2)}`
                      : `Bs. ${p.amountBs.toLocaleString("es-VE", { minimumFractionDigits: 2 })}`}
                  </span>
                  <button
                    onClick={() => onRemove(p.id)}
                    className="p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Eliminar línea de pago"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.li>
            ))
          )}
        </AnimatePresence>
      </ul>
    </section>
  );
}
