import { Cake, X, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { OrderStep1Form } from "./add-orders/OrderStep1Form";

import { Button } from "../common/Button";
import { OrderStep2Form } from "./add-orders/OrderStep2Form";
import { usePosData } from "@/hooks/usePosData";
import { useOrderForm } from "@/hooks/useOrderForm";
import { useTasaBCV } from "@/hooks/useTasaBCV";
import { useSessions } from "@/hooks/useSessions";
import { OrderStep3Summary } from "./add-orders/OrderStep3Summary";

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddOrderModal({ isOpen, onClose }: AddOrderModalProps) {
  const { sessions } = useSessions();
  const activeSessionId = sessions?.[0]?.id || "";
  const { state, actions } = useOrderForm(activeSessionId);

  const { productCategories, paymentMethods } = usePosData();
  const { tasa } = useTasaBCV();
  const products = productCategories?.flatMap((cat) => cat.options) || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-900 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          />

          {/* Modal */}
          <motion.article
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md w-full max-h-[90vh] bg-white 
            rounded-3xl shadow-xl shadow-primary-900/5 z-901 border border-zinc-100 flex flex-col overflow-hidden"
          >
            <header className="shrink-0 flex items-center justify-between p-4 sm:px-6 sm:py-4 border-b border-zinc-100">
              <div className="flex items-center gap-3 text-primary-700">
                <div className="bg-primary-50 p-2.5 rounded-2xl">
                  <Cake className="size-6 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold tracking-tight">
                  Nuevo Encargo
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="size-11 flex items-center justify-center rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 cursor-pointer transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="size-6" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto flex flex-col gap-5 px-4 sm:px-6 pb-5 pt-4">
              <section className="flex flex-col gap-6">
                <header className="flex flex-col items-start gap-2">
                  <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                    Paso {state.step} de 3
                  </span>
                  <div>
                    <h3 className="text-lg text-zinc-900 font-bold">
                      {state.step === 1
                        ? "Detalles del cliente y entrega"
                        : "Detalles del pedido"}
                    </h3>
                    <p className="text-sm text-zinc-500 mt-1">
                      {state.step === 1
                        ? "Ingresa la información para el pedido de este cliente."
                        : "Ingresa los detalles del pedido."}
                    </p>
                  </div>
                </header>
                <div className="relative overflow-visible">
                  <AnimatePresence mode="wait">
                    {state.step === 1 && (
                      <OrderStep1Form
                        customerName={state.customerName}
                        setCustomerName={actions.setCustomerName}
                        customerPhone={state.customerPhone}
                        setCustomerPhone={actions.setCustomerPhone}
                        description={state.description}
                        setDescription={actions.setDescription}
                        deliveryDate={state.deliveryDate}
                        setDeliveryDate={actions.setDeliveryDate}
                        deliveryTime={state.deliveryTime}
                        setDeliveryTime={actions.setDeliveryTime}
                      />
                    )}
                    {state.step === 2 && (
                      <OrderStep2Form
                        products={products}
                        cart={state.cart}
                        payments={state.payments}
                        onAddToCart={actions.addToCart}
                        onRemoveFromCart={actions.removeFromCart}
                        paymentOptions={paymentMethods || []}
                        onAddPayment={actions.addPayment}
                        onRemovePayment={actions.removePayment}
                        tasa={tasa}
                      />
                    )}
                    {state.step === 3 && (
                      <OrderStep3Summary
                        cart={state.cart}
                        payments={state.payments}
                        customerName={state.customerName}
                        customerPhone={state.customerPhone}
                        description={state.description}
                        deliveryTime={state.deliveryTime}
                        deliveryDate={state.deliveryDate}
                        tasa={tasa}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </section>
            </div>
            <footer className="shrink-0 flex justify-end items-center gap-3 p-4 sm:px-6 py-4 border-t border-zinc-100 bg-zinc-50/50 rounded-b-3xl">
              {state.step === 1 && (
                <Button size="small" style="secondary" onClick={onClose}>
                  Cancelar
                </Button>
              )}
              {state.step > 1 && (
                <Button
                  size="small"
                  style="secondary"
                  onClick={actions.prevStep}
                >
                  Volver
                </Button>
              )}
              <Button
                size="small"
                style="primary"
                isLoading={state.isSubmitting}
                onClick={async () => {
                  if (state.step === 3) {
                    try {
                      const { success } = await actions.submitOrder(tasa);
                      if (success) onClose();
                    } catch {
                      alert("Error al guardar el pedido");
                    }
                  } else {
                    actions.nextStep();
                  }
                }}
              >
                {state.step === 1
                  ? "Siguiente"
                  : state.step === 2
                    ? "Ver Resumen"
                    : "Finalizar"}{" "}
                {state.step !== 3 && <ArrowRight className="size-4 ml-1" />}
              </Button>
            </footer>
          </motion.article>
        </>
      )}
    </AnimatePresence>
  );
}
