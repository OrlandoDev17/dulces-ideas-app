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
  Check,
  ChevronDown,
} from "lucide-react";
// Components
import { OptionDropdown } from "@/components/common/OptionDropdown";
import { MixedPaymentModal } from "./MixedPaymentModal";
// Types
import type { CartItem } from "@/lib/types";
import type { Payment } from "./MixedPaymentModal";

interface Props {
  items: CartItem[];
  tasa: number;
  onRemoveItem: (id: string) => void;
  onRegister: () => void;
}

const METODOS_PAGO = [
  { id: "pm", label: "Bs - Pago Móvil" },
  { id: "bs", label: "Bs - Efectivo" },
  { id: "pv", label: "Bs - Punto de Venta" },
  { id: "usd", label: "USD - Divisas" },
  { id: "mx", label: "Pago Mixto" },
];

export function ActiveSale({ items, tasa, onRemoveItem, onRegister }: Props) {
  const [isOpenMetodo, setIsOpenMetodo] = useState(false);
  const [metodoSelected, setMetodoSelected] = useState(METODOS_PAGO[0]);
  const [showMixedModal, setShowMixedModal] = useState(false);

  const handleRegisterClick = () => {
    if (metodoSelected.id === "mx") {
      setShowMixedModal(true);
    } else {
      onRegister(); // Registro normal
    }
  };

  const confirmMixedPayment = (payments: Payment[]) => {
    console.log("Pagos registrados:", payments);
    setShowMixedModal(false);
    onRegister(); // Cerramos el proceso
  };

  const totalUSD = items?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const totalBS = totalUSD * tasa;

  // Solo renderizamos si hay items, con una animación de entrada global
  return (
    <AnimatePresence>
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
              <h3 className="text-lg">Orden Actual</h3>
            </div>
            <span className="text-xs font-black uppercase tracking-tighter text-zinc-400 bg-zinc-100 px-2 py-1 rounded-md">
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
          <section className="mt-2 p-4 rounded-2xl bg-zinc-50/50 border border-zinc-100 relative overflow-hidden">
            {/* Decoración de ticket */}
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary/20 to-transparent" />

            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-zinc-400 uppercase">
                  Total a pagar
                </span>
                <span className="text-2xl font-black text-primary tracking-tight">
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
              className="w-full flex items-center justify-between bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium text-zinc-700 hover:border-primary transition-all cursor-pointer"
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
              options={METODOS_PAGO}
              onSelect={(m) => setMetodoSelected(m)}
              getLabel={(m) => m.label}
            />
          </div>

          <button
            onClick={handleRegisterClick}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] cursor-pointer group"
          >
            <div className="p-1 bg-white/20 rounded-md group-hover:rotate-12 transition-transform">
              <Check size={18} />
            </div>
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
