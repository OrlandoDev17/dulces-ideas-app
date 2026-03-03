"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { Payment, PaymentMethod } from "@/lib/types";
import { Button } from "../common/Button";
import { useMixedPayment } from "@/hooks/useMixedPayment";
import { PaymentSummary } from "./mixed-payment/PaymentSummary";
import { PaymentForm } from "./mixed-payment/PaymentForm";
import { PaymentList } from "./mixed-payment/PaymentList";
import { Modal } from "../common/Modal";

interface Props {
  onClose: () => void;
  totalToPayBs: number;
  tasa: number;
  paymentMethods: PaymentMethod[];
  onConfirm: (payments: Payment[]) => void;
  isOpen?: boolean;
}

/**
 * Modal para gestionar pagos mixtos (múltiples métodos de pago en una sola venta).
 */
export function MixedPaymentModal({
  onClose,
  totalToPayBs,
  tasa,
  paymentMethods,
  onConfirm,
  isOpen = true,
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
  } = useMixedPayment(totalToPayBs, tasa, paymentMethods, onConfirm);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pago Mixto"
      description="Registra múltiples métodos de pago para esta orden"
      footer={
        <div className="flex gap-3 mt-4">
          <Button style="secondary" onClick={onClose} className="w-1/3 py-4">
            Cancelar
          </Button>
          <Button
            style="primary"
            onClick={confirm}
            disabled={!isComplete}
            className="w-2/3 py-4"
          >
            Confirmar Pagos
            {isComplete ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
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
        <PaymentList
          payments={payments}
          onRemove={removePayment}
          paymentMethods={paymentMethods}
        />
      </div>
    </Modal>
  );
}
