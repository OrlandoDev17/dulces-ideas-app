"use client";

import { Clock, CreditCard, MapPin, Pencil, Trash2, Phone, Calendar, Cake } from "lucide-react";
import { useProductName } from "@/hooks/ui/useProductName";
import { useSaleTotals } from "@/hooks/ui/useSaleTotals";
import { usePaymentMethodLabel } from "@/hooks/ui/usePaymentMethodLabel";
import { fmtBs } from "@/shared/utils/formatters";
import type { Sale, CartItem, Payment, PaymentMethod } from "@/shared/types";

interface Props {
  sale: Sale;
  paymentMethods: PaymentMethod[];
  onStartEdit: () => void;
  onDelete: () => void;
}

/**
 * Tarjeta de historial de ventas adaptada a estructura relacional (Supabase)
 */
export function RecentSaleCard({
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
    <article className="group flex flex-col gap-3.5 p-2 bg-white rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-zinc-50 px-2 py-1.5 rounded-xl border border-zinc-100/50 shrink-0">
          {isOrderAdvance ? (
            <Cake size={11} className="text-primary-500" aria-hidden="true" />
          ) : (
            <Clock size={11} className="text-zinc-400" aria-hidden="true" />
          )}
          <time
            className="text-[10px] font-black text-zinc-600 tabular-nums uppercase tracking-tight"
            suppressHydrationWarning
          >
            {new Date(sale.created_at || sale.fecha || "").toLocaleTimeString(
              "es-VE",
              {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              },
            )}
          </time>
        </div>

        <nav className="flex gap-1 shrink-0" aria-label="Acciones de venta">
          <button
            onClick={onStartEdit}
            className="p-1.5 text-zinc-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-all active:scale-90"
            aria-label="Editar venta"
          >
            <Pencil size={16} aria-hidden="true" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-90"
            aria-label="Eliminar venta"
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </nav>
      </header>

      <div className="flex flex-col gap-2">
        {sale.order_id && (
          <span className="self-start inline-flex items-center px-2 py-0.5 rounded-md bg-primary-500 text-white text-[9px] font-black uppercase tracking-widest shadow-sm">
            Encargo
          </span>
        )}

        {/* Información del cliente si es un encargo */}
        {isOrderAdvance && orderData && (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-zinc-800">
              {orderData.customer_name}
            </span>
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <Phone size={10} />
                {orderData.customer_phone}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={10} />
                {orderData.delivery_date?.split("T")[0]}
              </span>
            </div>
          </div>
        )}

        <ul
          className="flex flex-wrap gap-1.5"
          aria-label="Productos en esta venta"
        >
          {items.map((item: CartItem, i: number) => (
            <li
              key={`${sale.id}-item-${i}`}
              className="inline-flex items-center px-2 py-0.5 rounded-lg bg-zinc-50/80 text-zinc-700 text-[10px] font-bold border border-zinc-100/50 shadow-sm"
            >
              <span className="text-primary-500 mr-1 font-black">
                {item.quantity}x
              </span>
              <span className="truncate max-w-[100px]">
                {getProductName(item.product_id || item.id)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <section className="flex flex-col gap-3 pt-3 border-t border-zinc-50 border-dashed">
        <div className="flex flex-col xs:flex-row justify-between items-start gap-3">
          <div className={`flex flex-col px-3 py-2 rounded-xl border w-full xs:w-auto min-w-[100px] ${
            isOrderAdvance
              ? "bg-primary-50 border-primary-100"
              : "bg-primary-50/50 border-primary-100/50"
          }`}>
            <h3 className="text-[8px] font-black uppercase text-primary-400 tracking-widest mb-0.5">
              Total
            </h3>
            <div className="flex flex-col">
              <span className="text-base font-black text-primary-600 leading-tight tabular-nums">
                Bs. {fmtBs(totalBs)}
              </span>
              <span className="text-[9px] font-bold text-primary-400/80 tabular-nums leading-none">
                ${Math.max(0, totalUsd).toFixed(2)} USD
              </span>
            </div>
          </div>

          <div className="w-full flex-1 flex flex-col gap-1.5 min-w-0">
            <h3 className="text-[8px] font-black uppercase text-zinc-400 tracking-widest px-0.5">
              Pagos
            </h3>
            <ul className="flex flex-col gap-1">
              {payments.length > 0 ? (
                payments.map((p: Payment, pIndex: number) => {
                  const amtBs = p.amount_bs || p.amountBs || 0;
                  const amtRef = p.amount_ref || p.amountRef || 0;

                  if (amtBs <= 0 && amtRef <= 0) return null;

                  return (
                    <li
                      key={`${sale.id}-pay-${pIndex}`}
                      className="flex items-center justify-between gap-2 px-2 py-1.5 bg-zinc-50/30 border border-zinc-100/50 rounded-xl group/pay"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <CreditCard
                          size={10}
                          className="text-zinc-300 group-hover/pay:text-primary-500 shrink-0"
                          aria-hidden="true"
                        />
                        <span className="text-[10px] font-black text-zinc-700 uppercase truncate">
                          {getMethodLabel(p.method_id || p.methodId)}:
                        </span>
                        <span className="text-[10px] font-black text-primary-600 tabular-nums">
                          {p.currency === "USD"
                            ? `$${amtRef.toFixed(2)}`
                            : `Bs. ${fmtBs(amtBs)}`}
                        </span>
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="text-[9px] text-zinc-300 italic">Sin pagos</li>
              )}
            </ul>
          </div>
        </div>
      </section>

      <footer className="flex flex-col gap-2 pt-2 border-t border-zinc-50 border-dashed">
        {sale.delivery && (
          <div className="flex items-center gap-2.5 bg-green-50/30 p-2 rounded-xl border border-green-100/30">
            <div className="size-8 rounded-lg bg-white flex items-center justify-center shadow-sm border border-green-50 shrink-0">
              <MapPin
                size={14}
                className="text-green-500"
                strokeWidth={3}
                aria-hidden="true"
              />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-black text-zinc-800 truncate leading-none mb-0.5">
                {sale.delivery_name || "Delivery"}
              </span>
              <span className="text-[10px] font-bold text-green-600 tabular-nums leading-none">
                +Bs. {fmtBs(Number(deliveryAmt))}
              </span>
            </div>
          </div>
        )}
      </footer>
    </article>
  );
}