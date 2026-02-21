import { useState, useMemo, useCallback } from "react";
import { PAYMENT_METHODS } from "@/lib/constants";

/**
 * Hook para manejar la lógica de conversión de moneda en formularios de pago.
 * Detecta automáticamente si el método es en Bs o USD y realiza las conversiones.
 */
export function useCurrencyConverter(tasa: number) {
  const [amountInput, setAmountInput] = useState<number | "">("");
  const [metodo, setMetodo] = useState(PAYMENT_METHODS[0]);

  const [isOpenMetodo, setIsOpenMetodo] = useState(false);

  const isBsMethod = useMemo(() => metodo.id !== "usd", [metodo]);

  // Valores calculados en USD (referencia)
  const paidUSD = useMemo(() => {
    if (amountInput === "" || amountInput === 0) return 0;
    return isBsMethod ? Number(amountInput) / tasa : Number(amountInput);
  }, [amountInput, isBsMethod, tasa]);

  // Valores calculados en BS
  const paidBS = useMemo(() => {
    if (amountInput === "" || amountInput === 0) return 0;
    return isBsMethod ? Number(amountInput) : Number(amountInput) * tasa;
  }, [amountInput, isBsMethod, tasa]);

  const reset = useCallback(() => {
    setAmountInput("");
    setMetodo(PAYMENT_METHODS[0]);
    setIsOpenMetodo(false);
  }, []);

  return {
    amountInput,
    setAmountInput,
    metodo,
    setMetodo,
    isOpenMetodo,
    setIsOpenMetodo,
    isBsMethod,
    paidUSD,
    paidBS,
    reset,
  };
}
