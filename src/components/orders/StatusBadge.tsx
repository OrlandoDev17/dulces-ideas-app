import React from "react";

type OrderStatus = "pending" | "paid" | "delivered" | "cancelled";

interface Props {
  status: OrderStatus;
}

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  paid: "bg-blue-100 text-blue-700 border-blue-200",
  delivered: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export function StatusBadge({ status }: Props) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-black uppercase border transition-colors ${statusColors[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
