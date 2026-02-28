import { useState, useMemo } from "react";
import { Payment, PaymentMethod } from "@/lib/types";

/**
 * Hook personalizado para gestionar la lógica de pagos mixtos.
 * Maneja la lista de pagos, cálculos de montos restantes y conversiones de divisas.
 */
export const useMixedPayment = (
  totalToPayBs: number,
  tasa: number,
  paymentMethods: PaymentMethod[],
  onConfirm: (payments: Payment[]) => void,
) => {
  const [payments, setPayments] = useState<Payment[]>([]);

  // Filtramos "Pago Mixto" para evitar recursión infinita (si llegara a estar)
  const paymentOptions = useMemo(
    () => paymentMethods.filter((m) => m.id !== "mx"),
    [paymentMethods],
  );

  // Estado para la selección manual del usuario (inicia con la primera opción disponible)
  const [selectedMethodInternal, setSelectedMethod] = useState<
    PaymentMethod | undefined
  >(paymentOptions[0]);

  // Estado derivado: usa la selección manual si sigue siendo válida, si no, vuelve a la primera opicón
  const selectedMethod = useMemo(() => {
    const isValid =
      selectedMethodInternal &&
      paymentOptions.some((m) => m.id === selectedMethodInternal.id);
    return isValid ? selectedMethodInternal : paymentOptions[0];
  }, [selectedMethodInternal, paymentOptions]);

  const [isOpenMethod, setIsOpenMethod] = useState(false);
  const [amount, setAmount] = useState<number | "">("");

  // Eliminamos el useEffect que causaba renders en cascada

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
    if (!val || val <= 0 || !selectedMethod) return;

    let amountBs = 0;
    let amountRef = 0;

    if (selectedMethod.currency === "USD") {
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
