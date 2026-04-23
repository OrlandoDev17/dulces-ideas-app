import { useState } from "react";
import {
  Trash2,
  Phone,
  Calendar,
  Clock,
  ChevronDown,
  Cake,
} from "lucide-react";
import { formatVenezuelaDate } from "@/services/FechaYHora";
import { StatusBadge } from "./StatusBadge";
import { ActionButtons } from "./ActionButtons";
import { usePosData } from "@/hooks/api/usePosData";
import { motion, AnimatePresence } from "motion/react";
import { fmtBs } from "@/shared/utils/formatters";

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

const calculateFinancials = (order: Order, tasa: number) => {
  const paidUsd = order.order_payments.reduce(
    (acc, p) =>
      acc +
      (p.currency.toLowerCase() === "usd" ? p.amount_ref : p.amount_bs / tasa),
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
  const [isExpanded, setIsExpanded] = useState(false);
  const { productCategories, paymentMethods } = usePosData();
  const allProducts = productCategories?.flatMap((cat) => cat.options) || [];

  const { paidUsd, progress, remainingUsd, remainingBs } = calculateFinancials(
    order,
    tasa,
  );

  const productsList =
    order.order_items
      ?.map((item) => {
        const product = allProducts.find(
          (p) => String(p.id) === String(item.product_id),
        );
        return `${item.quantity}x ${product?.name || "Producto"}`;
      })
      .join(", ") || "Sin productos";

  return (
    <motion.article
      layout
      className={`
        bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden cursor-pointer
        ${isExpanded ? "shadow-xl shadow-primary-500/10" : "hover:shadow-lg"}
      `}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Vista Base */}
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center gap-4">
          {/* Icono */}
          <motion.div
            whileHover={{ scale: 1.08, rotate: 3 }}
            className="w-14 h-14 rounded-2xl bg-linear-to-br from-primary-500 to-primary-600 flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/30"
          >
            <Cake className="text-white" size={24} />
          </motion.div>

          {/* Info Principal */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-zinc-800 truncate">
              {order.customer_name}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-sm text-zinc-500">
              <Phone size={12} className="text-primary-500" />
              <span>{order.customer_phone || "Sin contacto"}</span>
            </div>
          </div>

          {/* Status y Chevron */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <StatusBadge status={order.status} />
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ChevronDown size={20} className="text-zinc-400" />
            </motion.div>
          </div>
        </div>

        {/* Info Secundaria */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-500">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-primary-500" />
            {formatVenezuelaDate(new Date(order.delivery_date))}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-primary-500" />
            {order.delivery_hour}
          </span>
        </div>

        {/* Productos y Total */}
        <div className="mt-4 p-4 bg-linear-to-r from-zinc-50 to-zinc-100/50 rounded-2xl border border-zinc-100">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-zinc-600 flex-1 truncate">
              {productsList}
            </p>
            <div className="text-right shrink-0">
              <p className="text-xl font-black text-zinc-800">
                ${order.total_amount_usd.toFixed(2)}
              </p>
              <p className="text-xs font-medium text-zinc-500">
                Bs {fmtBs(order.total_amount_bs)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vista Expandida */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-zinc-100 p-5 space-y-5">
              {/* Descripción */}
              {order.description && (
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 shadow-sm">
                  <p className="text-sm text-amber-800 italic">
                    &ldquo;{order.description}&rdquo;
                  </p>
                </div>
              )}

              {/* Productos */}
              {order.order_items?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase text-zinc-400">
                    Productos
                  </span>
                  <div className="bg-zinc-50 rounded-2xl p-4 space-y-3 shadow-sm border border-zinc-100">
                    {order.order_items.map((item, idx) => {
                      const product = allProducts.find(
                        (p) => String(p.id) === String(item.product_id),
                      );
                      return (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-zinc-700 font-medium">
                            <span className="font-bold text-primary-600">
                              {item.quantity}x{" "}
                            </span>
                            {product?.name || "Producto"}
                          </span>
                          <span className="font-bold text-zinc-600">
                            ${(item.price_at_moment * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Abonos */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase text-zinc-400">
                  Abonos
                </span>
                <div className="bg-emerald-50 rounded-2xl p-4 space-y-3 shadow-sm border border-emerald-100">
                  {order.order_payments?.length > 0 ? (
                    order.order_payments.map((p, idx) => {
                      const method = paymentMethods?.find(
                        (m) => m.id === p.method_id,
                      );
                      return (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-emerald-700 font-medium">
                            {method?.name || "Pago"}
                          </span>
                          <span className="font-bold text-emerald-600">
                            {p.currency.toLowerCase() === "usd"
                              ? `$${p.amount_ref.toFixed(2)}`
                              : `Bs ${fmtBs(p.amount_bs)}`}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-zinc-400 italic">
                      Sin abonos previos
                    </p>
                  )}
                </div>
              </div>

              {/* Finanzas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-100 rounded-2xl p-4 shadow-sm border border-zinc-200">
                  <p className="text-xs font-bold text-zinc-400 uppercase">
                    Total
                  </p>
                  <p className="text-2xl font-black text-zinc-800 mt-1">
                    ${order.total_amount_usd.toFixed(2)}
                  </p>
                  <p className="text-sm font-medium text-zinc-500 mt-1">
                    Bs {fmtBs(order.total_amount_bs)}
                  </p>
                </div>
                <div className="bg-primary-50 rounded-2xl p-4 shadow-sm border border-primary-100">
                  <p className="text-xs font-bold text-primary-400 uppercase">
                    Saldo
                  </p>
                  <p className="text-2xl font-black text-primary-600 mt-1">
                    ${remainingUsd.toFixed(2)}
                  </p>
                  <p className="text-sm font-medium text-primary-500 mt-1">
                    Bs {Math.round(remainingBs).toLocaleString("es-VE")}
                  </p>
                </div>
              </div>

              {/* Progreso */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 font-medium">
                    Progreso de Pago
                  </span>
                  <span className="font-bold text-zinc-700">
                    ${paidUsd.toFixed(2)} ({progress.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-3 bg-zinc-100 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      progress >= 100
                        ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                        : "bg-gradient-to-r from-primary-400 to-primary-500"
                    }`}
                  />
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4 border-t border-zinc-100">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(order.id);
                  }}
                  className="p-3 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={20} />
                </motion.button>
                <div className="flex-1">
                  <ActionButtons
                    order={order}
                    onPay={onCompletePayment}
                    onDeliver={onDeliver}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
