"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  X,
  Plus,
  Trash2,
  DollarSign,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Banknote,
  Smartphone,
} from "lucide-react";
import { PAYMENT_METHODS } from "@/lib/constants";
import type { Payment } from "@/lib/types";
import { OptionDropdown } from "../common/OptionDropdown";
import { DropdownButton } from "../common/DropdownButton";
import { Button } from "../common/Button";

interface Props {
  onClose: () => void;
  totalToPayBs: number;
  tasa: number;
  onConfirm: (payments: Payment[]) => void;
}

export function MixedPaymentModal({
  onClose,
  totalToPayBs,
  tasa,
  onConfirm,
}: Props) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [amount, setAmount] = useState<number | "">("");
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0]);
  const [isOpenMethod, setIsOpenMethod] = useState(false);

  // Filter out "Pago Mixto" from options to avoid recursion
  const paymentOptions = useMemo(
    () => PAYMENT_METHODS.filter((m) => m.id !== "mx"),
    [],
  );

  const totalRegisteredBs = useMemo(
    () => payments.reduce((acc, p) => acc + p.amountBs, 0),
    [payments],
  );

  const remainingBs = totalToPayBs - totalRegisteredBs;
  const isComplete = Math.abs(remainingBs) < 100; // Float precision tolerance

  const handleAddPayment = () => {
    const val = Number(amount);
    if (!val || val <= 0) return;

    // Determine values based on currency
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
      id: crypto.randomUUID(), // Unique ID for key
      method: selectedMethod.id,
      amountBs,
      amountRef,
    };

    setPayments([...payments, newPayment]);
    setAmount(""); // Reset input
  };

  const removePayment = (id: string) => {
    setPayments(payments.filter((p) => p.id !== id));
  };

  const handleConfirm = () => {
    if (isComplete) {
      onConfirm(payments);
    }
  };

  // Helper to get icon
  const getMethodIcon = (id: string) => {
    switch (id) {
      case "bs":
        return <Banknote size={16} />;
      case "pm":
        return <Smartphone size={16} />; // Pago movil
      case "usd":
        return <DollarSign size={16} />;
      default:
        return <CreditCard size={16} />;
    }
  };

  const getMethodLabel = (id: string) => {
    return PAYMENT_METHODS.find((p) => p.id === id)?.label || id;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <header className="bg-zinc-50 border-b border-zinc-100 p-5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-zinc-800">Pago Mixto</h2>
            <p className="text-xs text-zinc-500 font-medium mt-0.5">
              Registra múltiples métodos de pago
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-200 rounded-full transition-colors text-zinc-400 hover:text-zinc-600"
          >
            <X size={20} />
          </button>
        </header>

        {/* Body */}
        <div className="p-6 flex flex-col gap-6 overflow-y-auto">
          {/* Totales */}
          <section className="grid grid-cols-2 gap-4">
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex flex-col gap-1 items-center justify-center text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-primary/60">
                Total a Pagar
              </span>
              <strong className="text-2xl text-primary font-black">
                Bs.{" "}
                {totalToPayBs.toLocaleString("es-VE", {
                  minimumFractionDigits: 2,
                })}
              </strong>
            </div>
            <div
              className={`p-4 rounded-2xl flex flex-col gap-1 items-center justify-center text-center border ${
                isComplete
                  ? "bg-green-50 border-green-200"
                  : remainingBs > 0
                    ? "bg-orange-50 border-orange-200"
                    : "bg-red-50 border-red-200"
              }`}
            >
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isComplete
                    ? "text-green-600"
                    : remainingBs > 0
                      ? "text-orange-600"
                      : "text-red-600"
                }`}
              >
                {remainingBs > 0
                  ? "Restante"
                  : remainingBs < 0
                    ? "Excedente"
                    : "Completado"}
              </span>
              <strong
                className={`text-2xl font-black ${
                  isComplete
                    ? "text-green-700"
                    : remainingBs > 0
                      ? "text-orange-700"
                      : "text-red-700"
                }`}
              >
                Bs.{" "}
                {Math.abs(remainingBs).toLocaleString("es-VE", {
                  minimumFractionDigits: 2,
                })}
              </strong>
            </div>
          </section>

          {/* Formulario de Agregar */}
          {!isComplete && (
            <section className="flex flex-col gap-3">
              <label className="text-xs font-bold uppercase text-zinc-400 tracking-wider ml-1">
                Agregar Pago
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="w-full sm:w-1/2 relative">
                  <DropdownButton
                    isOpen={isOpenMethod}
                    setIsOpen={setIsOpenMethod}
                  >
                    {getMethodIcon(selectedMethod.id)}
                    <span className="truncate">{selectedMethod.label}</span>
                  </DropdownButton>
                  <OptionDropdown
                    isOpen={isOpenMethod}
                    setIsOpen={setIsOpenMethod}
                    options={paymentOptions}
                    onSelect={setSelectedMethod}
                    getLabel={(opt) => opt.label}
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-1/2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs pointer-events-none">
                      {selectedMethod.id === "usd" ? "$" : "Bs"}
                    </span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) =>
                        setAmount(
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                      className="w-full bg-zinc-50 border border-zinc-200 pl-8 pr-4 py-2.5 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                      onKeyDown={(e) => e.key === "Enter" && handleAddPayment()}
                    />
                  </div>
                  <button
                    onClick={handleAddPayment}
                    disabled={!amount || Number(amount) <= 0}
                    className="p-2.5 bg-zinc-900 text-white rounded-xl hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Lista de Pagos */}
          <section className="flex flex-col gap-3 min-h-[120px]">
            <label className="text-xs font-bold uppercase text-zinc-400 tracking-wider ml-1 flex justify-between items-center">
              <span>Pagos Registrados</span>
              <span className="bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-md text-[10px]">
                {payments.length}
              </span>
            </label>

            <ul className="flex flex-col gap-2">
              <AnimatePresence mode="popLayout">
                {payments.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-8 text-zinc-300 gap-2 border-2 border-dashed border-zinc-100 rounded-2xl"
                  >
                    <CreditCard size={32} />
                    <span className="text-sm font-medium">
                      No hay pagos registrados
                    </span>
                  </motion.div>
                ) : (
                  payments.map((p) => (
                    <motion.li
                      key={p.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center justify-between p-3 bg-white border border-zinc-100 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${p.method === "usd" ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"}`}
                        >
                          {getMethodIcon(p.method)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-zinc-700">
                            {getMethodLabel(p.method)}
                          </span>
                          <span className="text-xs text-zinc-400">
                            {p.method === "usd"
                              ? `Bs. ${p.amountBs.toLocaleString("es-VE", { minimumFractionDigits: 2 })}`
                              : `Ref: $${p.amountRef.toFixed(2)}`}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-zinc-700">
                          {p.method === "usd"
                            ? `$ ${p.amountRef.toFixed(2)}`
                            : `Bs. ${p.amountBs.toLocaleString("es-VE", {
                                minimumFractionDigits: 2,
                              })}`}
                        </span>
                        <button
                          onClick={() => removePayment(p.id)}
                          className="p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.li>
                  ))
                )}
              </AnimatePresence>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <footer className="p-5 border-t border-zinc-100 bg-zinc-50 flex gap-3">
          <Button style="secondary" onClick={onClose} className="w-1/3">
            Cancelar
          </Button>
          <Button
            style="primary"
            onClick={handleConfirm}
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
