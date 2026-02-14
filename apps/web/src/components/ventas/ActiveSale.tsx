"use client";

// Hooks
import { useState } from "react";
// Motion
import { motion, AnimatePresence } from "motion/react";
// Icons
import {
  Trash2,
  CreditCard,
  ShoppingBag,
  ChevronDown,
  MapPin,
} from "lucide-react";
// Components
import { OptionDropdown } from "@/components/common/OptionDropdown";
import { MixedPaymentModal } from "./MixedPaymentModal";
// Constants
import { PAYMENT_METHODS } from "@/lib/constants";
// Types
import type { CartItem, Sale } from "@/lib/types";
import type { Payment } from "./MixedPaymentModal";

interface Props {
  items: CartItem[];
  tasa: number;
  onRemoveItem: (id: string) => void;
  onRegister: (sale: Sale) => void;
  setCart: (cart: CartItem[]) => void;
}

export function ActiveSale({
  items,
  tasa,
  onRemoveItem,
  onRegister,
  setCart,
}: Props) {
  const [isOpenMetodo, setIsOpenMetodo] = useState(false);
  const [metodoSelected, setMetodoSelected] = useState(PAYMENT_METHODS[0]);
  const [showMixedModal, setShowMixedModal] = useState(false);
  const [isDelivery, setIsDelivery] = useState(false);

  const handleRegisterClick = () => {
    if (metodoSelected.id === "mx") {
      setShowMixedModal(true);
    } else {
      onRegister({
        id: crypto.randomUUID(),
        items,
        totalUSD,
        totalBS,
        metodo: metodoSelected.id,
        fecha: new Date().toISOString(),
        delivery: isDelivery,
      });
      setIsDelivery(false);
      setCart([]);
    }
  };

  const confirmMixedPayment = (payments: Payment[]) => {
    console.log("Pagos registrados:", payments);
    setShowMixedModal(false);
    onRegister({
      id: crypto.randomUUID(),
      items,
      totalUSD,
      totalBS,
      metodo: metodoSelected.id,
      fecha: new Date().toISOString(),
      delivery: isDelivery,
    });
    setIsDelivery(false);
    setCart([]);
  };

  const totalUSD = items?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const totalBS = totalUSD * tasa;

  // Solo renderizamos si hay items, con una animación de entrada global
  return (
    <AnimatePresence mode="wait">
      {items?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          className="flex flex-col gap-4 w-full bg-white p-6 rounded-3xl border border-zinc-100 shadow-2xl shadow-primary/10"
        >
          {/* Header Simplificado */}
          <header className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-primary font-bold">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ShoppingBag size={20} />
              </div>
              <h3 className="text-base 2xl:text-lg">Orden Actual</h3>
            </div>
            <span className="text-[10px] 2xl:text-xs font-black uppercase tracking-tighter text-zinc-400 bg-zinc-100 px-2 py-1 rounded-md">
              {items.length} Items
            </span>
          </header>

          {/* Lista de productos: Crece hasta un máximo y luego activa scroll */}
          <div className="flex flex-col gap-2 overflow-hidden">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex justify-between items-center p-3 hover:bg-zinc-50 rounded-2xl transition-colors border border-transparent hover:border-zinc-100 group"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-zinc-800 text-sm leading-tight">
                      {item.name}
                    </span>
                    <span className="text-sm text-zinc-500 font-medium">
                      {item.quantity} un. × ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-primary text-lg">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Totales con Diseño de Factura */}
          <section className="mt-2 p-4 rounded-2xl bg-zinc-50/50 border border-zinc-200 shadow-md relative overflow-hidden">
            {/* Decoración de ticket */}
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary/20 to-transparent" />

            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-xs 2xl:text-sm font-bold text-zinc-400 uppercase">
                  Total a pagar
                </span>
                <span className="text-xl 2xl:text-2xl font-black text-primary tracking-tight">
                  Bs.{" "}
                  {totalBS?.toLocaleString("es-VE", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-xs font-bold text-zinc-500">
                  ${totalUSD?.toFixed(2)} USD
                </span>
                <span className="text-sm text-zinc-400 font-medium">
                  Tasa: {tasa}
                </span>
              </div>
            </div>
          </section>

          {/* Selector de Pago Reutilizable */}
          <div className="relative">
            <button
              onClick={() => setIsOpenMetodo(!isOpenMetodo)}
              className="w-full flex items-center justify-between bg-white border border-primary rounded-xl px-4 py-3 text-sm font-medium text-zinc-700 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <CreditCard size={16} className="text-zinc-400" />
                {metodoSelected.label}
              </div>
              <ChevronDown
                size={16}
                className={`transition-transform ${isOpenMetodo ? "rotate-180" : ""}`}
              />
            </button>

            <OptionDropdown
              isOpen={isOpenMetodo}
              setIsOpen={setIsOpenMetodo}
              options={PAYMENT_METHODS}
              onSelect={(m: { id: string; label: string }) =>
                setMetodoSelected(m)
              }
              getLabel={(m: { id: string; label: string }) => m.label}
            />
          </div>

          {/* Delivery Toggle */}
          <button
            onClick={() => setIsDelivery(!isDelivery)}
            className={`w-full flex items-center justify-between border-2 rounded-xl px-4 py-3 text-sm font-bold transition-all cursor-pointer ${
              isDelivery
                ? "bg-green-50 border-green-500 text-green-700 shadow-md shadow-green-100"
                : "bg-white border-zinc-100 text-zinc-400 hover:border-zinc-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`p-1.5 rounded-lg ${isDelivery ? "bg-green-500 text-white" : "bg-zinc-100 text-zinc-400"}`}
              >
                <MapPin size={16} />
              </div>
              ¿Es para Delivery?
            </div>
            <div
              className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${isDelivery ? "bg-green-500" : "bg-zinc-200"}`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${isDelivery ? "translate-x-4" : ""}`}
              />
            </div>
          </button>

          <button
            onClick={handleRegisterClick}
            className="w-full bg-primary text-white py-3 2xl:py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] cursor-pointer group"
          >
            Registrar Venta
          </button>
        </motion.div>
      )}

      {showMixedModal && (
        <MixedPaymentModal
          totalToPayBs={totalBS}
          tasa={tasa}
          onClose={() => setShowMixedModal(false)}
          onConfirm={confirmMixedPayment}
        />
      )}
    </AnimatePresence>
  );
}
