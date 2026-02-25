"use client";

import { motion } from "motion/react";
import { X, AlertCircle, CheckCircle2 } from "lucide-react";
import type { Payment } from "@/lib/types";
import { Button } from "../common/Button";
import { useMixedPayment } from "@/hooks/useMixedPayment";
import { PaymentSummary } from "./mixed-payment/PaymentSummary";
import { PaymentForm } from "./mixed-payment/PaymentForm";
import { PaymentList } from "./mixed-payment/PaymentList";

interface Props {
  onClose: () => void;
  totalToPayBs: number;
  tasa: number;
  onConfirm: (payments: Payment[]) => void;
}

/**
 * Modal para gestionar pagos mixtos (múltiples métodos de pago en una sola venta).
 */
export function MixedPaymentModal({
  onClose,
  totalToPayBs,
  tasa,
  onConfirm,
}: Props) {
  // Extraemos toda la lógica del hook personalizado
  const {
    payments,
    amount,
    setAmount,
    selectedMethod,
    setSelectedMethod,
    isOpenMethod,
    setIsOpenMethod,
    paymentOptions,
    remainingBs,
    isComplete,
    addPayment,
    removePayment,
    confirm,
  } = useMixedPayment(totalToPayBs, tasa, onConfirm);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-900 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Cabecera del Modal */}
        <header className="bg-primary-500 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-base md:text-xl font-bold text-primary-50">
              Pago Mixto
            </h2>
            <p className="text-[10px] md:text-xs text-primary-200 font-medium mt-0.5 text-balance">
              Registra múltiples métodos de pago para esta orden
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-primary-50 hover:bg-primary-800/20 rounded-lg
            transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </header>

        {/* Cuerpo del Modal con scroll si es necesario */}
        <div className="p-4 flex flex-col gap-4 overflow-y-auto">
          {/* Resumen de montos (Total y Restante) */}
          <PaymentSummary
            totalToPayBs={totalToPayBs}
            remainingBs={remainingBs}
            isComplete={isComplete}
          />

          {/* Formulario de entrada (solo si no está completo) */}
          {!isComplete && (
            <PaymentForm
              amount={amount}
              setAmount={setAmount}
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
              isOpenMethod={isOpenMethod}
              setIsOpenMethod={setIsOpenMethod}
              paymentOptions={paymentOptions}
              onAdd={addPayment}
            />
          )}

          {/* Listado de pagos ya agregados */}
          <PaymentList payments={payments} onRemove={removePayment} />
        </div>

        {/* Pie del Modal con acciones de confirmación */}
        <footer className="p-2 md:p-5 border-t border-zinc-100 bg-zinc-50 flex gap-3">
          <Button style="secondary" onClick={onClose} className="w-1/3">
            Cancelar
          </Button>
          <Button
            style="primary"
            onClick={confirm}
            disabled={!isComplete}
            className="w-2/3"
          >
            Confirmar Pagos
            {isComplete ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
          </Button>
        </footer>
      </motion.div>
    </motion.div>
  );
}
