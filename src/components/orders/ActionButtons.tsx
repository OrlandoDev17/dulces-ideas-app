import React from "react";
import { DollarSign, ChevronRight, CheckCircle } from "lucide-react";

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
    <div className="flex gap-2 ml-auto">
      {status === "pending" && (
        <button
          onClick={() => onPay(id)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors active:scale-95"
        >
          Completar Pago
          <DollarSign size={14} />
        </button>
      )}

      {(status === "paid" || status === "pending") && (
        <button
          onClick={() => onDeliver(id)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl text-xs font-bold hover:bg-primary-600 transition-colors active:scale-95 shadow-md shadow-primary-500/20"
        >
          Entregar
          <ChevronRight size={14} />
        </button>
      )}

      {status === "delivered" && (
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-bold">
          Entregado
          <CheckCircle size={14} />
        </div>
      )}
    </div>
  );
}
