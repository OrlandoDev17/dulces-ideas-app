import React from "react";
import { DollarSign, CheckCircle, PackageCheck } from "lucide-react";
import { motion } from "motion/react";

type OrderStatus = "pending" | "paid" | "delivered" | "cancelled";

interface Order {
  id: string;
  status: OrderStatus;
}

interface Props {
  order: Order;
  onPay: (id: string) => void;
  onDeliver: (id: string) => void;
}

export function ActionButtons({ order, onPay, onDeliver }: Props) {
  const { status, id } = order;

  return (
    <div className="flex gap-3">
      {status === "pending" && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation();
            onPay(id);
          }}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-blue-50 text-blue-600 rounded-2xl text-sm font-bold hover:bg-blue-100 transition-colors border border-blue-200 shadow-sm hover:shadow-md"
          aria-label="Completar pago"
        >
          <DollarSign size={18} />
          <span>Completar Pago</span>
        </motion.button>
      )}

      {(status === "paid" || status === "pending") && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation();
            onDeliver(id);
          }}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-primary-500 text-white rounded-2xl text-sm font-bold hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/30 border border-primary-400 hover:shadow-xl"
          aria-label="Marcar como entregado"
        >
          <span>Entregar</span>
          <PackageCheck size={18} />
        </motion.button>
      )}

      {status === "delivered" && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-emerald-50 text-emerald-600 rounded-2xl text-sm font-bold border border-emerald-200 shadow-sm"
          aria-label="Entregado"
        >
          <CheckCircle size={18} />
          <span>Entregado</span>
        </motion.div>
      )}
    </div>
  );
}