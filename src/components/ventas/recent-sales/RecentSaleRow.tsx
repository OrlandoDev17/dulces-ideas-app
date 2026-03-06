"use client";

import { usePosData } from "@/hooks/usePosData";
import { Clock, CreditCard, MapPin, Pencil, Trash2 } from "lucide-react";
import { PaymentMethod, Sale, Product, CartItem, Payment } from "@/lib/types";

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

    // Convertimos el ID recibido a string para comparar con seguridad
    const searchId = String(id);

    for (const category of productCategories) {
      // Buscamos el producto convirtiendo también su ID a string
      const product = category.options.find(
        (p: Product) => String(p.id) === searchId,
      );
      if (product) return product.name;
    }

    return `ID: ${id}`; // Retornamos el ID si no se encuentra para poder debuguear
  };

  // --- EXTRACCIÓN DE DATOS RELACIONADOS ---
  const items: CartItem[] = sale.sale_items || [];
  const payments: Payment[] = sale.sale_payments || [];

  return (
    <div
      role="row"
      className="grid grid-cols-recent-sales gap-4 px-6 py-5 items-center bg-white hover:bg-zinc-50/50 rounded-2xl transition-all border border-zinc-100 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/5 group"
    >
      {/* 1. Columna: Hora (created_at) */}
      <div className="flex items-center gap-2 text-zinc-600 font-bold text-sm tabular-nums">
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

      {/* 2. Columna: Productos (sale_items) */}
      <div className="flex flex-wrap gap-1.5 min-w-0">
        {/* Marcador de Encargo (Si mantuviste la columna 'type' en 'sales') */}
        {sale.type === "order_payment" && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary-500 text-white text-xs font-black uppercase tracking-widest mb-1 shadow-sm">
            Encargo
          </span>
        )}

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

      {/* 3. Columna: Totales (snake_case) */}
      <div className="flex flex-col">
        <span className="text-primary-500 font-black text-sm tracking-tight tabular-nums">
          Bs.{" "}
          {roundTo2Decimals(
            (sale.total_bs || sale.totalBs || 0) -
              (sale.delivery ? sale.delivery_amount || 0 : 0),
          )}
        </span>
        <span className="text-zinc-400 font-bold text-xs tracking-tighter tabular-nums">
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

      {/* 4. Columna: Métodos de pago (sale_payments) */}
      <div className="flex flex-wrap gap-1.5 items-center">
        {payments.length > 0 ? (
          <>
            {payments.map((p: Payment, pIndex: number) => (
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
                  {getMethodLabel(p.method_id || p.methodId)}
                </span>
              </div>
            ))}
          </>
        ) : (
          /* Fallback por si la venta no tiene pagos registrados aún */
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

      {/* 5. Columna: Estado de Delivery (Nuevo Diseño Premium) */}
      <div className="flex items-center justify-center min-w-[120px]">
        {sale.delivery ? (
          <div className="flex items-center gap-3 bg-green-50/50 px-3 py-2 rounded-xl border border-green-100/50 hover:bg-green-50 transition-colors group/delivery-row w-full">
            {/* Pequeño círculo con Icono */}
            <div className="size-8 rounded-lg bg-white flex items-center justify-center shadow-sm border border-green-100 group-hover/delivery-row:scale-105 transition-transform">
              <div className="size-6 rounded-md bg-green-400/10 flex items-center justify-center text-green-600">
                <MapPin size={14} strokeWidth={2.5} />
              </div>
            </div>

            {/* Texto de Delivery */}
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-black text-zinc-800 leading-none truncate mb-0.5">
                {sale.delivery_name || "Delivery"}
              </span>
              <span className="text-[10px] font-black text-green-600 tabular-nums">
                +Bs. {Number(sale.delivery_amount || 0).toFixed(2)}
              </span>
            </div>
          </div>
        ) : (
          <div className="size-8 flex items-center justify-center text-zinc-200">
            <span className="w-4 h-0.5 bg-current rounded-full" />
          </div>
        )}
      </div>

      {/* 6. Columna: Acciones */}
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
