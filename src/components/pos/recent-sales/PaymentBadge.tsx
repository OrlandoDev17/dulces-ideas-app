"use client";

import {
  Banknote,
  Coins,
  CreditCard,
  DollarSign,
  Smartphone,
} from "lucide-react";
import type { PaymentMethod } from "@/shared/types";
import { fmtBs } from "@/shared/utils/formatters";
import {
  getFullMethodName,
  getShortMethodLabel,
} from "@/shared/utils/paymentAggregation";

interface Props {
  methodId: string;
  amountBs: number;
  amountRef: number;
  currency?: string;
  paymentMethods: PaymentMethod[];
  /** "pill" para la fila desktop, "row" para la tarjeta móvil */
  variant?: "pill" | "row";
  className?: string;
}

type IconKey = "smartphone" | "banknote" | "usd" | "card" | "coins";

const getMethodIconKey = (id: string): IconKey => {
  const mid = (id || "").toLowerCase();
  if (mid.startsWith("pm")) return "smartphone";
  if (mid === "ves" || mid === "bs" || mid.includes("efectivo"))
    return "banknote";
  if (mid === "usd" || mid === "divisas") return "usd";
  if (mid === "punto" || mid === "pv") return "card";
  return "coins";
};

function MethodIcon({
  iconKey,
  size,
  className,
  strokeWidth,
}: {
  iconKey: IconKey;
  size: number;
  className?: string;
  strokeWidth?: number;
}) {
  if (iconKey === "smartphone") {
    return (
      <Smartphone
        size={size}
        className={className}
        strokeWidth={strokeWidth}
        aria-hidden="true"
      />
    );
  }
  if (iconKey === "banknote") {
    return (
      <Banknote
        size={size}
        className={className}
        strokeWidth={strokeWidth}
        aria-hidden="true"
      />
    );
  }
  if (iconKey === "usd") {
    return (
      <DollarSign
        size={size}
        className={className}
        strokeWidth={strokeWidth}
        aria-hidden="true"
      />
    );
  }
  if (iconKey === "card") {
    return (
      <CreditCard
        size={size}
        className={className}
        strokeWidth={strokeWidth}
        aria-hidden="true"
      />
    );
  }
  return (
    <Coins
      size={size}
      className={className}
      strokeWidth={strokeWidth}
      aria-hidden="true"
    />
  );
}

/**
 * Badge compacto de pago con icono por tipo de método, etiqueta corta
 * y monto. Trunca el texto con tooltip del nombre completo.
 */
export function PaymentBadge({
  methodId,
  amountBs,
  amountRef,
  currency,
  paymentMethods,
  variant = "pill",
  className = "",
}: Props) {
  const iconKey = getMethodIconKey(methodId);
  const label = getShortMethodLabel(methodId, paymentMethods);
  const fullLabel = getFullMethodName(methodId, paymentMethods);
  const amount =
    currency === "USD" ? `$${amountRef.toFixed(2)}` : `Bs. ${fmtBs(amountBs)}`;

  if (variant === "row") {
    return (
      <li
        className={`flex items-center justify-between gap-2 px-2 py-1.5 bg-zinc-50/30 border border-zinc-100/50 rounded-xl w-full min-w-0 group/pay ${className}`}
        title={fullLabel}
      >
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <MethodIcon
            iconKey={iconKey}
            size={10}
            className="text-zinc-400 shrink-0 group-hover/pay:text-primary-500 transition-colors"
          />
          <span className="text-[10px] font-black text-zinc-700 uppercase truncate min-w-0">
            {label}:
          </span>
        </div>
        <span className="text-[10px] font-black text-primary-600 tabular-nums shrink-0">
          {amount}
        </span>
      </li>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 pl-2 pr-2.5 py-1 bg-primary-50 border border-primary-200 rounded-full shadow-sm max-w-full min-w-0 ${className}`}
      title={fullLabel}
    >
      <MethodIcon
        iconKey={iconKey}
        size={12}
        className="text-primary-500 shrink-0"
        strokeWidth={2.5}
      />
      <span className="font-black text-primary-900 text-[10px] uppercase tracking-wide truncate min-w-0">
        {label}
      </span>
      <span className="font-black text-primary-600 text-[10px] tabular-nums shrink-0">
        {amount}
      </span>
    </span>
  );
}
