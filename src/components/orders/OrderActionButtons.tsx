import React from "react";
import { Trash2, DollarSign, ChevronRight, CheckCircle } from "lucide-react";

type OrderStatus = "pending" | "paid" | "delivered" | "cancelled";

interface Props {
  orderId: string;
  status: OrderStatus;
  onDelete: (id: string) => void;
  onCompletePayment: (id: string) => void;
  onDeliver: (id: string) => void;
}

export function OrderActionButtons({
  orderId,
  status,
  onDelete,
  onCompletePayment,
  onDeliver,
}: Props) {
  return (
    <footer className="flex items-center justify-between gap-2 mt-2 pt-4 border-t border-zinc-100">
      <button
        onClick={() => onDelete(orderId)}
        className="p-2.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-95"
        title="Cancelar pedido"
      >
        <Trash2 size={18} />
      </button>

      <div className="flex gap-2">
        {status === "pending" && (
          <button
            onClick={() => onCompletePayment(orderId)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors active:scale-95"
          >
            Completar Pago
            <DollarSign size={14} />
          </button>
        )}

        {(status === "paid" || status === "pending") && (
          <button
            onClick={() => onDeliver(orderId)}
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
    </footer>
  );
}
