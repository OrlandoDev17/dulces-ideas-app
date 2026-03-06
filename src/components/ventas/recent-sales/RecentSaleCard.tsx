"use client";

import { Clock, CreditCard, MapPin, Pencil, Trash2 } from "lucide-react";
import { usePosData } from "@/hooks/usePosData";
import type {
  Sale,
  Product,
  CartItem,
  Payment,
  PaymentMethod,
} from "@/lib/types";

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
  const { productCategories } = usePosData();

  const roundTo2Decimals = (value: number) => {
    return Math.round(value * 100) / 100;
  };

  const getMethodLabel = (id: string) => {
    const method = paymentMethods?.find((m) => m.id === id);
    if (!method) return id;
    return `${method.currency} - ${method.name}`;
  };

  // Funcion para buscar el nombre del producto
  const getProductName = (id: string | number) => {
    if (!productCategories) return "Cargando...";

    const searchId = String(id);
    for (const category of productCategories) {
      const product = category.options.find(
        (p: Product) => String(p.id) === searchId,
      );
      if (product) return product.name;
    }
    return `ID: ${id}`;
  };

  // --- EXTRACCIÓN DE DATOS DE RELACIONES ---
  const items: CartItem[] = sale.sale_items || [];
  const payments: Payment[] = sale.sale_payments || [];

  return (
    <div className="flex flex-col gap-4 px-4 py-4 bg-white rounded-2xl border border-zinc-100 shadow-sm active:bg-zinc-50 transition-colors">
      {/* 1. Cabecera: Hora y Acciones */}
      <div className="flex items-center justify-between border-b border-zinc-50 pb-2">
        <div className="flex items-center gap-2 text-zinc-600 font-bold text-xs tabular-nums">
          <div className="p-1.5 bg-zinc-100 rounded-lg text-zinc-400">
            <Clock size={14} aria-hidden="true" />
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

        <div className="flex gap-1">
          <button
            onClick={onStartEdit}
            className="p-1.5 text-zinc-400 hover:text-primary-500 hover:bg-primary-500/5 rounded-lg active:scale-90"
            aria-label="Editar"
          >
            <Pencil size={18} aria-hidden="true" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg active:scale-90"
            aria-label="Eliminar"
          >
            <Trash2 size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* 2. Lista de Productos (sale_items) */}
      <div className="flex flex-wrap gap-1.5">
        {items.map((item: CartItem, i: number) => (
          <span
            key={`${sale.id}-item-${i}`}
            className="inline-flex items-center px-2 py-0.5 rounded-lg bg-zinc-100 text-zinc-700 text-[10px] font-bold border border-zinc-200/50"
          >
            <span className="text-primary-500 mr-1">{item.quantity}x</span>{" "}
            {getProductName(item.product_id || item.id)}
          </span>
        ))}
      </div>

      {/* 3. Totales y Desglose de Pagos (sale_payments) */}
      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-50">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-zinc-400 mb-1">
            Total Venta
          </span>
          <span className="text-primary-500 font-black text-sm tracking-tight tabular-nums">
            Bs.{" "}
            {roundTo2Decimals(
              (sale.total_bs || sale.totalBs || 0) -
                (sale.delivery ? sale.delivery_amount || 0 : 0),
            )}
          </span>
          <span className="text-zinc-400 font-bold text-[10px] tracking-tighter tabular-nums">
            $
            {(
              (sale.total_usd || sale.totalUsd || 0) -
              (sale.delivery
                ? (sale.delivery_amount || 0) / (sale.tasa_bcv || 1)
                : 0)
            ).toFixed(2)}{" "}
            USD
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-black uppercase text-zinc-400 mb-0.5">
            Métodos de Pago
          </span>
          <div className="flex flex-wrap gap-1.5">
            {payments.length > 0 ? (
              payments.map((p: Payment, pIndex: number) => (
                <div
                  key={`${sale.id}-pay-${pIndex}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 border-[1.5px] border-primary-200 rounded-full shadow-sm hover:scale-[1.02] transition-transform"
                >
                  <CreditCard
                    size={11}
                    className="text-primary-800"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  <span className="font-black text-primary-900 text-[10px] uppercase tracking-wide mt-0.5">
                    {getMethodLabel(p.method_id || p.methodId)}
                  </span>
                  <span className="font-extrabold text-primary-800/70 text-[9px] bg-white/50 px-1 py-0.5 rounded-full ml-1 tabular-nums mt-0.5">
                    {p.currency === "USD"
                      ? `$${Number(p.amountRef || p.amount_ref).toFixed(2)}`
                      : `${Number(p.amountBs || p.amount_bs).toFixed(2)}`}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-[10px] text-zinc-300 italic">
                Sin pagos
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4. Sección de Delivery - Nuevo Diseño Premium */}
      <div className="flex flex-col gap-2 pt-3 border-t border-zinc-50 border-dashed">
        <header className="flex justify-between items-center px-1">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
            Detalles de Entrega
          </span>
          {!sale.delivery && (
            <span className="text-[10px] font-bold text-zinc-300">N/A</span>
          )}
        </header>

        {sale.delivery && (
          <div className="flex items-center gap-4 bg-green-50/50 p-3 rounded-2xl border border-green-100/50 group/delivery transition-all hover:bg-green-50">
            {/* Círculo con Icono */}
            <div className="size-12 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-green-100 group-hover/delivery:scale-105 transition-transform">
              <div className="size-9 rounded-xl bg-green-400/10 flex items-center justify-center text-green-600">
                <MapPin size={22} strokeWidth={2.5} />
              </div>
            </div>

            {/* Información de la Entrega */}
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-black text-zinc-800 tracking-tight">
                {sale.delivery_name || "Sin Nombre"}
              </span>
              <span className="text-xs font-black text-green-600 tabular-nums">
                +Bs. {Number(sale.delivery_amount || 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
