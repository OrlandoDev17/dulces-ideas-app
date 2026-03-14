import { useState } from "react";
import { Cake, X, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { OrderStep1Form } from "./OrderStep1Form";

import { Button } from "../common/Button";

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddOrderModal({ isOpen, onClose }: AddOrderModalProps) {
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [deliveryTime, setDeliveryTime] = useState("");

  const [step, setStep] = useState(1);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md w-full max-h-[95vh] bg-white 
            rounded-3xl shadow-xl shadow-primary-900/5 z-901 border border-zinc-100 flex flex-col overflow-visible"
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
            <div className="flex flex-col gap-5 px-4 sm:px-6 pb-5 pt-4 overflow-visible">
              <section className="flex flex-col gap-6">
                <header className="flex flex-col items-start gap-2">
                  <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                    Paso {step} de 3
                  </span>
                  <div>
                    <h3 className="text-lg text-zinc-900 font-bold">
                      {step === 1
                        ? "Detalles del cliente y entrega"
                        : "Detalles del pedido"}
                    </h3>
                    <p className="text-sm text-zinc-500 mt-1">
                      {step === 1
                        ? "Ingresa la información para el pedido de este cliente."
                        : "Ingresa los detalles del pedido."}
                    </p>
                  </div>
                </header>
                <div className="relative overflow-visible">
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <OrderStep1Form
                        deliveryDate={deliveryDate}
                        setDeliveryDate={setDeliveryDate}
                        deliveryTime={deliveryTime}
                        setDeliveryTime={setDeliveryTime}
                      />
                    )}
                    {step === 2 && <div>proximamente</div>}
                  </AnimatePresence>
                </div>
              </section>
            </div>
            <footer className="shrink-0 flex justify-end items-center gap-3 p-4 sm:px-6 py-4 border-t border-zinc-100 bg-zinc-50/50 rounded-b-3xl">
              {step === 1 && (
                <Button size="small" style="secondary" onClick={onClose}>
                  Cancelar
                </Button>
              )}
              {step > 1 && (
                <Button
                  size="small"
                  style="secondary"
                  onClick={handlePreviousStep}
                >
                  Volver
                </Button>
              )}
              <Button
                size="small"
                style="primary"
                onClick={step === 3 ? onClose : handleNextStep}
              >
                {step === 1
                  ? "Siguiente"
                  : step === 2
                    ? "Ver Resumen"
                    : "Finalizar"}{" "}
                {step !== 3 && <ArrowRight className="size-4 ml-1" />}
              </Button>
            </footer>
          </motion.article>
        </>
      )}
    </AnimatePresence>
  );
}
