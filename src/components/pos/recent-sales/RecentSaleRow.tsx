"use client";

import { Clock, CreditCard, MapPin, Pencil, Trash2, Phone, Calendar, Cake } from "lucide-react";
import { useProductName } from "@/hooks/ui/useProductName";
import { useSaleTotals } from "@/hooks/ui/useSaleTotals";
import { usePaymentMethodLabel } from "@/hooks/ui/usePaymentMethodLabel";
import { fmtBs } from "@/shared/utils/formatters";
import type { PaymentMethod, Sale, CartItem, Payment } from "@/shared/types";

interface Props {
  sale: Sale;
  paymentMethods: PaymentMethod[];
  onStartEdit: () => void;
  onDelete: () => void;
}

/**
 * Componente que renderiza una fila individual en la tabla de ventas (Desktop).
 * Adaptado para la estructura relacional de Supabase.
 */
export function RecentSaleRow({
  sale,
  paymentMethods,
  onStartEdit,
  onDelete,
}: Props) {
  const { getProductName } = useProductName();
  const { getMethodLabel } = usePaymentMethodLabel(paymentMethods);
  const { items, totalBs, totalUsd, payments, deliveryAmt } = useSaleTotals(sale);

  // Obtener datos del encargo si existe
  const orderData = sale.orders?.[0];
  const isOrderAdvance = sale.order_id;

  return (
    <div
      role="row"
      className={`grid grid-cols-recent-sales gap-4 px-6 py-5 items-center bg-white hover:bg-zinc-50/50 rounded-2xl transition-all border ${
        isOrderAdvance
          ? "border-primary-200 hover:border-primary-300 hover:shadow-lg hover:shadow-primary-500/10"
          : "border-zinc-100 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/5"
      } group`}
    >
      <div className="flex items-center gap-2 text-zinc-600 font-bold text-sm tabular-nums">
        <div className={`p-1.5 rounded-lg ${isOrderAdvance ? "bg-primary-100 text-primary-500" : "bg-zinc-100 text-zinc-400"}`}>
          {isOrderAdvance ? (
            <Cake size={14} aria-hidden="true" />
          ) : (
            <Clock size={14} aria-hidden="true" />
          )}
        </div>
        <span suppressHydrationWarning>
          {new Date(sale.created_at || sale.fecha || "").toLocaleTimeString(
            "es-VE",
            {
              hour: "2-digit",
              minute: "2-digit",
            },
          )}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 min-w-0">
        {/* Badge de Encargo */}
        {isOrderAdvance && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary-500 text-white text-xs font-black uppercase tracking-widest mb-1 shadow-sm">
            Encargo
          </span>
        )}

        {/* Información del cliente si es un encargo */}
        {isOrderAdvance && orderData && (
          <div className="flex flex-col gap-1 w-full mb-1">
            <span className="text-sm font-bold text-zinc-800">
              {orderData.customer_name}
            </span>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <Phone size={10} />
                {orderData.customer_phone}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={10} />
                {orderData.delivery_date?.split("T")[0]} • {orderData.delivery_hour}
              </span>
            </div>
          </div>
        )}

        {/* Productos */}
        {items.map((item: CartItem, i: number) => (
          <span
            key={`${sale.id}-item-${i}`}
            className="inline-flex items-center px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 text-xs font-bold border border-zinc-200/50 truncate max-w-full"
          >
            <span className="text-primary-500 mr-1">{item.quantity}x</span>{" "}
            {getProductName(item.product_id || item.id)}
          </span>
        ))}

        {sale.description && (
          <p className="text-xs font-bold text-zinc-400 italic w-full truncate">
            {sale.description}
          </p>
        )}
      </div>

      <div className="flex flex-col">
        <span className="text-primary-500 font-black text-sm tracking-tight tabular-nums">
          Bs. {fmtBs(totalBs)}
        </span>
        <span className="text-zinc-400 font-bold text-xs tracking-tighter tabular-nums">
          ${Math.max(0, totalUsd).toFixed(2)} USD
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 items-center">
        {payments.length > 0 ? (
          <>
            {payments.map((p: Payment, pIndex: number) => {
              const amtBs = p.amount_bs || p.amountBs || 0;
              const amtRef = p.amount_ref || p.amountRef || 0;

              if (amtBs <= 0 && amtRef <= 0) return null;

              return (
                <div
                  key={`${sale.id}-pay-${pIndex}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 border-[1.5px] border-primary-200 rounded-full shadow-sm hover:scale-[1.02] transition-transform"
                >
                  <CreditCard
                    size={14}
                    className="text-primary-800"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  <span className="font-black text-primary-900 text-[11px] uppercase tracking-wide mt-0.5">
                    {getMethodLabel(p.method_id || p.methodId)}:
                  </span>
                  <span className="font-black text-primary-600 text-[11px] tabular-nums mt-0.5">
                    {p.currency === "USD"
                      ? `$${amtRef.toFixed(2)}`
                      : `Bs. ${fmtBs(amtBs)}`}
                  </span>
                </div>
              );
            })}
          </>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 border-[1.5px] border-primary-200 rounded-full shadow-sm text-primary-900 text-[11px] font-black uppercase tracking-wide">
            <CreditCard
              size={14}
              className="text-primary-800"
              strokeWidth={2.5}
              aria-hidden="true"
            />
            <span className="mt-0.5">
              {getMethodLabel(sale.metodo || "N/A")}
            </span>
          </span>
        )}
      </div>

      <div className="flex items-center justify-center min-w-[120px]">
        {sale.delivery ? (
          <div className="flex items-center gap-3 bg-green-50/50 px-3 py-2 rounded-xl border border-green-100/50 hover:bg-green-50 transition-colors group/delivery-row w-full">
            <div className="size-8 rounded-lg bg-white flex items-center justify-center shadow-sm border border-green-100 group-hover/delivery-row:scale-105 transition-transform">
              <div className="size-6 rounded-md bg-green-400/10 flex items-center justify-center text-green-600">
                <MapPin size={14} strokeWidth={2.5} />
              </div>
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-black text-zinc-800 leading-none truncate mb-0.5">
                {sale.delivery_name || "Delivery"}
              </span>
              <span className="text-[10px] font-black text-green-600 tabular-nums">
                +Bs. {fmtBs(Number(deliveryAmt))}
              </span>
            </div>
          </div>
        ) : (
          <div className="size-8 flex items-center justify-center text-zinc-200">
            <span className="w-4 h-0.5 bg-current rounded-full" />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-1">
        <button
          onClick={onStartEdit}
          className="p-2 text-zinc-300 hover:text-primary-500 hover:bg-primary-500/5 rounded-lg transition-all md:opacity-0 group-hover:opacity-100 cursor-pointer active:scale-90"
          aria-label="Editar"
        >
          <Pencil size={18} aria-hidden="true" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all md:opacity-0 group-hover:opacity-100 cursor-pointer active:scale-90"
          aria-label="Eliminar"
        >
          <Trash2 size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}