/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "motion/react";
import { Trash2, Phone, Calendar, Clock } from "lucide-react";
import { formatVenezuelaDate } from "@/services/FechaYHora";
import { StatusBadge } from "./StatusBadge";
import { ActionButtons } from "./ActionButtons";
import { usePosData } from "@/hooks/usePosData";

// Interfaces Semánticas
interface OrderItem {
  product_id: number;
  quantity: number;
  price_at_moment: number;
}
interface OrderPayment {
  amount_bs: number;
  amount_ref: number;
  method_id: string;
  currency: "usd" | "bs";
}

interface Order {
  id: string;
  customer_name: string;
  customer_phone?: string;
  delivery_date: string;
  delivery_hour: string;
  description?: string;
  total_amount_bs: number;
  total_amount_usd: number;
  status: "pending" | "paid" | "delivered" | "cancelled";
  order_payments: OrderPayment[];
  order_items: OrderItem[];
}

interface Props {
  order: Order;
  onDelete: (id: string) => void;
  onCompletePayment: (id: string) => void;
  onDeliver: (id: string) => void;
  tasa: number;
}

/**
 * Función pura para calcular finanzas.
 * Separar esto del JSX hace el código mucho más mantenible.
 */
const calculateFinancials = (order: Order, tasa: number) => {
  const paidUsd = order.order_payments.reduce(
    (acc, p) =>
      acc + (p.currency.toLowerCase() === "usd" ? p.amount_ref : p.amount_bs / tasa),
    0,
  );

  const totalUsd = order.total_amount_usd;
  const progress = Math.min(100, (paidUsd / totalUsd) * 100);
  const remainingUsd = Math.max(0, totalUsd - paidUsd);

  return {
    paidUsd,
    paidBs: paidUsd * tasa,
    progress,
    remainingUsd,
    remainingBs: remainingUsd * tasa,
  };
};

export function OrderCard({
  order,
  onDelete,
  onCompletePayment,
  onDeliver,
  tasa,
}: Props) {
  const { productCategories, paymentMethods } = usePosData();
  const allProducts = productCategories?.flatMap(cat => cat.options) || [];
  
  const { paidUsd, progress, remainingUsd, remainingBs } =
    calculateFinancials(order, tasa);

  return (
    <motion.article
      layout
      className="group bg-white rounded-3xl border border-zinc-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 relative"
    >
      {/* Header */}
      <section className="flex justify-between items-start">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-lg font-bold text-zinc-800 tracking-tight">
            {order.customer_name}
          </h3>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <p className="flex items-center gap-1 text-[11px] font-medium text-zinc-500">
              <Phone size={10} className="text-primary-400" /> {order.customer_phone || "Sin contacto"}
            </p>
            <p className="flex items-center gap-1 text-[11px] font-medium text-zinc-500">
              <Calendar size={10} className="text-primary-400" /> {formatVenezuelaDate(new Date(order.delivery_date))}
            </p>
            <p className="flex items-center gap-1 text-[11px] font-medium text-zinc-500">
              <Clock size={10} className="text-primary-400" /> {order.delivery_hour}
            </p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </section>

      {/* Nota rápida */}
      {order.description && (
        <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-100">
          <p className="text-xs text-zinc-600 leading-relaxed italic">
            &quot;{order.description}&quot;
          </p>
        </div>
      )}

      {/* Listas Compactas */}
      <div className="space-y-3">
        {/* Productos */}
        {order.order_items?.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-bold uppercase text-zinc-400 px-1">Productos</span>
            <div className="bg-zinc-50/50 rounded-xl border border-zinc-100 p-2.5 space-y-1">
              {order.order_items.map((item, idx) => {
                const product = allProducts.find(p => String(p.id) === String(item.product_id));
                return (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-zinc-700 font-semibold truncate flex-1 mr-2">
                      <span className="text-primary-600 font-bold mr-1">{item.quantity}x</span> 
                      {product?.name || "Producto desconocido"}
                    </span>
                    <span className="text-zinc-400 font-bold whitespace-nowrap">
                      ${(item.price_at_moment * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pagos / Abonos */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] font-bold uppercase text-zinc-400 px-1">Abonos</span>
          <div className="bg-emerald-50/30 rounded-xl border border-emerald-100 p-2.5 space-y-1">
            {order.order_payments?.length > 0 ? (
              order.order_payments.map((p, idx) => {
                const method = paymentMethods?.find(m => m.id === p.method_id);
                return (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-emerald-700 font-semibold">
                      {method?.name || "Pago"}
                    </span>
                    <span className="text-emerald-600 font-bold">
                      {p.currency.toLowerCase() === "usd" ? `$${p.amount_ref.toFixed(2)}` : `Bs ${p.amount_bs.toLocaleString()}`}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-[11px] text-zinc-400 italic">Sin abonos previos</p>
            )}
          </div>
        </div>
      </div>

      {/* Finanzas */}
      <section className="grid grid-cols-2 gap-3">
        <FinanceMetric
          label="Total Orden"
          usd={order.total_amount_usd}
          bs={order.total_amount_bs}
          color="text-zinc-700"
          bg="bg-zinc-100"
        />
        <FinanceMetric
          label="Saldo Restante"
          usd={remainingUsd}
          bs={remainingBs}
          color="text-primary-600"
          bg="bg-primary-50/50 border-primary-100"
        />
      </section>

      {/* Barra de Progreso */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-end px-1">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-zinc-400 uppercase">Estado de Ingresos</span>
            <span className="text-xs font-bold text-zinc-600">
              Ingresado: ${paidUsd.toFixed(2)} / Bs {Math.round(paidUsd * tasa).toLocaleString()} ({progress.toFixed(0)}%)
            </span>
          </div>
        </div>
        <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={`h-full ${progress >= 100 ? "bg-emerald-500" : "bg-primary-500"}`}
          />
        </div>
      </div>

      {/* Footer Acciones */}
      <footer className="flex gap-2 pt-3 border-t border-zinc-100 items-center">
        <button
          onClick={() => onDelete(order.id)}
          className="p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          title="Cancelar"
        >
          <Trash2 size={16} />
        </button>
        <div className="flex-1">
          <ActionButtons
            order={order}
            onPay={onCompletePayment}
            onDeliver={onDeliver}
          />
        </div>
      </footer>
    </motion.article>
  );
}

const FinanceMetric = ({ label, usd, bs, color, bg = "bg-zinc-50" }: any) => (
  <div className={`${bg} p-3 rounded-2xl border border-transparent flex flex-col gap-0.5`}>
    <p className="text-[9px] font-bold text-zinc-400 uppercase">{label}</p>
    <p className={`text-sm font-black ${color}`}>${usd.toFixed(2)}</p>
    <p className="text-[10px] font-bold text-zinc-500/70">
      Bs {Math.round(bs).toLocaleString("es-VE")}
    </p>
  </div>
);
