"use client";

// Hooks
import { useState, useMemo, ChangeEvent } from "react";
// Motion
import { motion, AnimatePresence } from "motion/react";
// Icons
import { CreditCard, ShoppingBag, User, DollarSign } from "lucide-react";
// Components
import { OptionDropdown } from "@/components/common/OptionDropdown";
import { MixedPaymentModal } from "./MixedPaymentModal";
import { ProductList } from "./ProductList";
import { TotalToPay } from "./TotalToPay";
import { DropdownButton } from "@/components/common/DropdownButton";
import { Button } from "@/components/common/Button";
import { DeliveryToggle } from "./DeliveryToggle";
// Types
import type { CartItem, Sale, Payment, PaymentMethod } from "@/lib/types";

interface Props {
  items: CartItem[];
  tasa: number;
  paymentMethods: PaymentMethod[];
  onRemoveItem: (id: string) => void;
  onRegister: (sale: Sale) => void;
  setCart: (cart: CartItem[]) => void;
}

export function ActiveSale({
  items,
  tasa,
  paymentMethods,
  onRemoveItem,
  onRegister,
  setCart,
}: Props) {
  // Combinar métodos de la DB con la opción de Pago Mixto
  const allPaymentOptions = useMemo(() => {
    return [
      ...paymentMethods,
      { id: "mx", name: "Pago Mixto", currency: "VES" as const },
    ];
  }, [paymentMethods]);

  // Estados
  const [isOpenMetodo, setIsOpenMetodo] = useState(false);
  const [showMixedModal, setShowMixedModal] = useState(false);
  const [isDelivery, setIsDelivery] = useState(false);
  const [deliveryName, setDeliveryName] = useState("");
  const [deliveryAmount, setDeliveryAmount] = useState<number | "">("");

  // Estado para la seleccion interna del usuario
  const [metodoSelectedInternal, setMetodoSelected] = useState<
    PaymentMethod | undefined
  >(allPaymentOptions[0]);

  // Derivamos el metodo seleccionado: si la seleccion es valida lo usamos, si no, volvemos al primero
  const metodoSelected = useMemo(() => {
    const isValid =
      metodoSelectedInternal &&
      allPaymentOptions.some((m) => m.id === metodoSelectedInternal.id);
    return isValid
      ? (metodoSelectedInternal as PaymentMethod)
      : allPaymentOptions[0];
  }, [metodoSelectedInternal, allPaymentOptions]);

  // El efecto anterior se elimina para evitar renders en cascada

  // Funcion para registrar la venta
  const handleRegisterClick = () => {
    if (metodoSelected.id === "mx") {
      setShowMixedModal(true);
    } else {
      const salePayload = {
        id: crypto.randomUUID(),
        items,
        totalUSD,
        totalBS,
        tasa_bcv: tasa,
        metodo: metodoSelected.id,
        fecha: new Date().toISOString(),
        delivery: isDelivery,
        deliveryName: isDelivery ? deliveryName : undefined,
        deliveryAmount: isDelivery ? Number(deliveryAmount) || 0 : undefined,
      };

      console.log("🚀 Payload de Venta a Registrar:", salePayload);
      onRegister(salePayload);
      resetStates();
    }
  };

  // Funcion para resetear los estados
  const resetStates = () => {
    setIsDelivery(false);
    setDeliveryName("");
    setDeliveryAmount("");
    setCart([]);
  };

  // Funcion para confirmar el pago mixto
  const confirmMixedPayment = (payments: Payment[]) => {
    console.log("Pagos registrados:", payments);
    setShowMixedModal(false);
    const salePayload = {
      id: crypto.randomUUID(),
      items,
      totalUSD,
      totalBS,
      tasa_bcv: tasa,
      metodo: metodoSelected.id,
      fecha: new Date().toISOString(),
      delivery: isDelivery,
      deliveryName: isDelivery ? deliveryName : undefined,
      deliveryAmount: isDelivery ? Number(deliveryAmount) || 0 : undefined,
      payments,
    };

    console.log("🚀 Payload de Venta Mixta a Registrar:", salePayload);
    onRegister(salePayload);
    resetStates();
  };

  // Calculo del total en USD
  const totalUSD = items?.reduce((acc, item) => {
    if (item.currency === "VES") {
      return acc + (item.price * item.quantity) / tasa;
    }
    return acc + item.price * item.quantity;
  }, 0);

  // Calculo del total en BS
  const totalBS = items?.reduce((acc, item) => {
    if (item.currency === "VES") {
      return acc + item.price * item.quantity;
    }
    return acc + item.price * item.quantity * tasa;
  }, 0);

  const totalBSRounded = Math.round(totalBS * 100) / 100;

  // Rule 5.5/5.11: Memorizar la creacion del objeto
  const DELIVERY_FIELDS = useMemo(
    () => [
      {
        id: "name",
        label: "Nombre del Delivery",
        placeholder: "Ej. Cesar, Wouker, etc…",
        type: "text",
        value: deliveryName,
        onChange: (e: ChangeEvent<HTMLInputElement>) =>
          setDeliveryName(e.target.value),
        icon: User,
      },
      {
        id: "amount",
        label: "Monto del Delivery",
        placeholder: "400Bs",
        type: "number",
        value: deliveryAmount,
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          const val = e.target.value === "" ? "" : Number(e.target.value);
          setDeliveryAmount(
            typeof val === "number" ? Math.round(val * 100) / 100 : "",
          );
        },
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
          className={`flex flex-col gap-4 w-full bg-white p-4 md:p-6 rounded-3xl border border-zinc-200 shadow-lg shadow-primary-500/20 relative ${isOpenMetodo ? "z-20" : "z-10"}`}
        >
          {/* Header de la Orden */}
          <header className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-primary-500 font-bold">
              <figure className="p-2 bg-primary-500/10 rounded-lg">
                <ShoppingBag className="size-4 md:size-6" aria-hidden="true" />
              </figure>
              <h3 className="text-base md:text-lg">Orden Actual</h3>
            </div>
            <output className="text-[8px] md:text-[10px] font-black uppercase tracking-tighter text-zinc-400 bg-zinc-100 px-2.5 py-1.5 rounded-lg tabular-nums">
              {items.length} {items.length === 1 ? "Item" : "Items"}
            </output>
          </header>

          {/* Lista de productos */}
          <ProductList items={items} onRemoveItem={onRemoveItem} />

          {/* Totales con Diseño de Factura */}
          <TotalToPay
            totalBS={totalBSRounded}
            totalUSD={totalUSD}
            tasa={tasa}
            isDelivery={isDelivery}
            deliveryAmount={Number(deliveryAmount) || 0}
          />

          {/* Selectores y Opciones */}
          <div className="flex flex-col gap-4">
            {/* Selector de Pago */}
            <div className={`relative ${isOpenMetodo ? "z-30" : "z-10"}`}>
              <DropdownButton isOpen={isOpenMetodo} setIsOpen={setIsOpenMetodo}>
                <CreditCard size={18} className="text-primary-500" />
                {metodoSelected?.name || "Seleccionar pago…"}
              </DropdownButton>

              <OptionDropdown
                isOpen={isOpenMetodo}
                setIsOpen={setIsOpenMetodo}
                options={allPaymentOptions}
                onSelect={(m: PaymentMethod) => setMetodoSelected(m)}
                getLabel={(m: PaymentMethod) => m.name}
              />
            </div>

            {/* Delivery Toggle y Datos */}
            <DeliveryToggle
              setIsDelivery={setIsDelivery}
              isDelivery={isDelivery}
              DELIVERY_FIELDS={DELIVERY_FIELDS}
            />
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
          paymentMethods={paymentMethods}
          onClose={() => setShowMixedModal(false)}
          onConfirm={confirmMixedPayment}
        />
      )}
    </AnimatePresence>
  );
}
