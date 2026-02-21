/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// Hooks
import { useState, useMemo } from "react";
// Motion
import { motion, AnimatePresence } from "motion/react";
// Icons
import {
  CreditCard,
  ShoppingBag,
  MapPin,
  User,
  DollarSign,
} from "lucide-react";
// Components
import { OptionDropdown } from "@/components/common/OptionDropdown";
import { MixedPaymentModal } from "./MixedPaymentModal";
import { ProductList } from "./ProductList";
import { TotalToPay } from "./TotalToPay";
import { DropdownButton } from "@/components/common/DropdownButton";
import { Button } from "@/components/common/Button";
// Constants
import { PAYMENT_METHODS } from "@/lib/constants";
// Types
import type { CartItem, Sale, Payment } from "@/lib/types";

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
  const [deliveryName, setDeliveryName] = useState("");
  const [deliveryAmount, setDeliveryAmount] = useState<number | "">("");

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
        deliveryName: isDelivery ? deliveryName : undefined,
        deliveryAmount: isDelivery ? Number(deliveryAmount) || 0 : undefined,
      });
      resetStates();
    }
  };

  const resetStates = () => {
    setIsDelivery(false);
    setDeliveryName("");
    setDeliveryAmount("");
    setCart([]);
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
      deliveryName: isDelivery ? deliveryName : undefined,
      deliveryAmount: isDelivery ? Number(deliveryAmount) || 0 : undefined,
      payments,
    });
    resetStates();
  };

  const totalUSD = items?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const totalBS = totalUSD * tasa;

  // Rule 5.5/5.11: Memoize constant object creation in render
  const DELIVERY_FIELDS = useMemo(
    () => [
      {
        id: "name",
        label: "Nombre del Delivery",
        placeholder: "Ej. Cesar, Wouker, etc…",
        type: "text",
        value: deliveryName,
        onChange: (e: any) => setDeliveryName(e.target.value),
        icon: User,
      },
      {
        id: "amount",
        label: "Monto del Delivery",
        placeholder: "400Bs",
        type: "number",
        value: deliveryAmount,
        onChange: (e: any) =>
          setDeliveryAmount(
            e.target.value === "" ? "" : Number(e.target.value),
          ),
        icon: DollarSign,
      },
    ],
    [deliveryName, deliveryAmount],
  );

  // Solo renderizamos si hay items, con una animación de entrada global
  return (
    <AnimatePresence mode="wait">
      {items?.length > 0 && (
        <motion.section
          key="active-sale-main-content"
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          className={`flex flex-col gap-4 w-full bg-white p-6 rounded-3xl border border-zinc-100 shadow-lg shadow-zinc-500/20 relative ${isOpenMetodo ? "z-20" : "z-10"}`}
        >
          {/* Header de la Orden */}
          <header className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-primary font-bold">
              <figure className="p-2 bg-primary/10 rounded-lg">
                <ShoppingBag size={20} aria-hidden="true" />
              </figure>
              <h3 className="text-base 2xl:text-lg">Orden Actual</h3>
            </div>
            <output className="text-[10px] 2xl:text-xs font-black uppercase tracking-tighter text-zinc-400 bg-zinc-100 px-2.5 py-1.5 rounded-lg tabular-nums">
              {items.length} {items.length === 1 ? "Item" : "Items"}
            </output>
          </header>

          {/* Lista de productos */}
          <ProductList items={items} onRemoveItem={onRemoveItem} />

          {/* Totales con Diseño de Factura */}
          <TotalToPay
            totalBS={totalBS}
            totalUSD={totalUSD}
            tasa={tasa}
            isDelivery={isDelivery}
            deliveryAmount={Number(deliveryAmount) || 0}
          />

          {/* Selectores y Opciones */}
          <div className="flex flex-col gap-4">
            {/* Selector de Pago */}
            <div className={`relative ${isOpenMetodo ? "z-30" : "z-10"}`}>
              <label className="sr-only">Método de Pago</label>
              <DropdownButton isOpen={isOpenMetodo} setIsOpen={setIsOpenMetodo}>
                <CreditCard size={18} className="text-primary/60" />
                {metodoSelected.label}
              </DropdownButton>

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

            {/* Delivery Toggle y Datos */}
            <fieldset className="flex flex-col gap-3 border-none p-0 m-0">
              <legend className="sr-only">Opciones de Delivery</legend>
              <button
                type="button"
                onClick={() => setIsDelivery(!isDelivery)}
                className={`w-full flex items-center justify-between border-2 rounded-xl px-4 py-3.5 text-sm font-black transition-all cursor-pointer ${
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

              <AnimatePresence>
                {isDelivery && (
                  <motion.div
                    key="delivery-form"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-3 py-1">
                      {DELIVERY_FIELDS.map(
                        (
                          {
                            id,
                            label,
                            icon: Icon,
                            placeholder,
                            onChange,
                            type,
                            value,
                          },
                          index,
                        ) => (
                          <div
                            key={`${id}-${index}`}
                            className="flex flex-col gap-1.5"
                          >
                            <label
                              htmlFor={id}
                              className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1"
                            >
                              {label}
                            </label>
                            <div className="relative">
                              <Icon
                                size={16}
                                className="text-primary/60 absolute top-1/2 -translate-y-1/2 left-3"
                                aria-hidden="true"
                              />
                              <input
                                id={id}
                                type={type}
                                value={value}
                                onChange={onChange}
                                placeholder={placeholder}
                                spellCheck={false}
                                className={`w-full bg-zinc-50 border border-zinc-200 pl-10 pr-4 py-3 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500/50 transition-all ${type === "number" ? "font-mono tracking-wider tabular-nums" : ""}`}
                              />
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </fieldset>
          </div>

          <Button style="primary" onClick={handleRegisterClick}>
            Registrar Venta
            <ShoppingBag size={20} className="group-hover:bounce" />
          </Button>
        </motion.section>
      )}

      {showMixedModal && (
        <MixedPaymentModal
          key="mixed-payment-modal"
          totalToPayBs={
            totalBS + (isDelivery ? Number(deliveryAmount) || 0 : 0)
          }
          tasa={tasa}
          onClose={() => setShowMixedModal(false)}
          onConfirm={confirmMixedPayment}
        />
      )}
    </AnimatePresence>
  );
}
