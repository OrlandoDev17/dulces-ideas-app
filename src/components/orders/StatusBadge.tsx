import React from "react";

type OrderStatus = "pending" | "paid" | "delivered" | "cancelled";

interface Props {
  status: OrderStatus;
}

const statusColors: Record<OrderStatus, { bg: string; text: string; shadow: string; border: string }> = {
  pending: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    shadow: "shadow-yellow-500/20",
    border: "border-yellow-200",
  },
  paid: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    shadow: "shadow-blue-500/20",
    border: "border-blue-200",
  },
  delivered: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    shadow: "shadow-emerald-500/20",
    border: "border-emerald-200",
  },
  cancelled: {
    bg: "bg-zinc-100",
    text: "text-zinc-600",
    shadow: "shadow-zinc-500/20",
    border: "border-zinc-200",
  },
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export function StatusBadge({ status }: Props) {
  const colors = statusColors[status] || statusColors.pending;

  return (
    <span
      className={`
        px-4 py-1.5 rounded-xl text-sm font-bold uppercase tracking-wide
        ${colors.bg} ${colors.text} ${colors.shadow} ${colors.border} border
        shadow-sm transition-all hover:shadow-md
      `}
    >
      {statusLabels[status]}
    </span>
  );
}