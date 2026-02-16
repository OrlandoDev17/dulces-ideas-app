import { useState, useMemo } from "react";
import { Payment } from "@/lib/types";
import { PAYMENT_METHODS } from "@/lib/constants";

/**
 * Hook personalizado para gestionar la lógica de pagos mixtos.
 * Maneja la lista de pagos, cálculos de montos restantes y conversiones de divisas.
 */
export const useMixedPayment = (
  totalToPayBs: number,
  tasa: number,
  onConfirm: (payments: Payment[]) => void,
) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [amount, setAmount] = useState<number | "">("");
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0]);
  const [isOpenMethod, setIsOpenMethod] = useState(false);

  // Filtramos "Pago Mixto" para evitar recursión infinita
  const paymentOptions = useMemo(
    () => PAYMENT_METHODS.filter((m) => m.id !== "mx"),
    [],
  );

  const totalRegisteredBs = useMemo(
    () => payments.reduce((acc, p) => acc + p.amountBs, 0),
    [payments],
  );

  const remainingBs = totalToPayBs - totalRegisteredBs;
  // Margen de tolerancia para precisiones de punto flotante
  const isComplete = Math.abs(remainingBs) < 100;

  /**
   * Agrega un nuevo pago a la lista realizando las conversiones necesarias.
   */
  const addPayment = () => {
    const val = Number(amount);
    if (!val || val <= 0) return;

    let amountBs = 0;
    let amountRef = 0;

    if (selectedMethod.id === "usd") {
      amountRef = val;
      amountBs = val * tasa;
    } else {
      amountBs = val;
      amountRef = val / tasa;
    }

    const newPayment: Payment = {
      id: crypto.randomUUID(),
      method: selectedMethod.id,
      amountBs,
      amountRef,
    };

    setPayments([...payments, newPayment]);
    setAmount("");
  };

  /**
   * Elimina un pago de la lista por su ID.
   */
  const removePayment = (id: string) => {
    setPayments(payments.filter((p) => p.id !== id));
  };

  /**
   * Ejecuta el callback de confirmación si el monto está completo.
   */
  const confirm = () => {
    if (isComplete) {
      onConfirm(payments);
    }
  };

  return {
    payments,
    amount,
    setAmount,
    selectedMethod,
    setSelectedMethod,
    isOpenMethod,
    setIsOpenMethod,
    paymentOptions,
    totalRegisteredBs,
    remainingBs,
    isComplete,
    addPayment,
    removePayment,
    confirm,
  };
};
