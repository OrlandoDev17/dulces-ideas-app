"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus, Trash2, X, ChevronDown, Calculator } from "lucide-react";
import { OptionDropdown } from "@/components/common/OptionDropdown";

export interface Payment {
  id: string;
  method: string;
  amountBs: number; // Siempre guardamos en Bs para el totalizador
  amountRef: number; // Referencia en USD para el recibo
}

interface Props {
  totalToPayBs: number;
  tasa: number;
  onConfirm: (payments: Payment[]) => void;
  onClose: () => void;
}

export function MixedPaymentModal({
  totalToPayBs,
  tasa,
  onConfirm,
  onClose,
}: Props) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isOpenMethods, setIsOpenMethods] = useState(false);

  const [currentMethod, setCurrentMethod] = useState({
    id: "pm",
    label: "Pago Móvil",
    isUsd: false,
  });
  const [inputValue, setInputValue] = useState<string>("");

  // Cálculos de estado
  const paidBs = useMemo(
    () => payments.reduce((acc, p) => acc + p.amountBs, 0),
    [payments],
  );
  const remainingBs = totalToPayBs - paidBs;
  const progressPercent = Math.min((paidBs / totalToPayBs) * 100, 100);

  const addPayment = () => {
    const numValue = parseFloat(inputValue);
    if (!numValue || numValue <= 0) return;

    const amountBs = currentMethod.isUsd ? numValue * tasa : numValue;
    const amountRef = currentMethod.isUsd ? numValue : numValue / tasa;

    // Validación para no pasarse del total (con margen de error por decimales)
    if (amountBs > remainingBs + 10) {
      alert("El monto supera el total restante");
      return;
    }

    setPayments([
      ...payments,
      {
        id: crypto.randomUUID(),
        method: currentMethod.label,
        amountBs,
        amountRef,
      },
    ]);
    setInputValue("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-zinc-100"
      >
        <header className="p-8 pb-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 p-2 hover:bg-zinc-100 rounded-full text-zinc-400"
          >
            <X size={20} />
          </button>
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
            <Calculator size={24} />
          </div>
          <h3 className="text-2xl font-black text-zinc-800 tracking-tight">
            Completar Pago
          </h3>

          {/* Barra de Progreso */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">
              <span>Progreso</span>
              <span>{progressPercent.toFixed(0)}%</span>
            </div>
            <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden p-0.5 border border-zinc-50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
              />
            </div>
            <p className="text-sm font-bold text-zinc-500">
              Faltan:{" "}
              <span className="text-primary font-black">
                Bs. {Math.max(0, remainingBs).toFixed(2)}
              </span>
            </p>
          </div>
        </header>

        <div className="px-8 pb-8 space-y-5">
          {/* Selector de Moneda/Método */}
          <div className="space-y-4 bg-zinc-50 p-5 rounded-2xl border border-zinc-100">
            <div className="relative">
              <button
                onClick={() => setIsOpenMethods(!isOpenMethods)}
                className="w-full flex justify-between items-center bg-white border border-zinc-200 p-3.5 rounded-2xl text-sm font-bold text-zinc-700 shadow-sm"
              >
                <span className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${currentMethod.isUsd ? "bg-green-500" : "bg-primary"}`}
                  />
                  {currentMethod.label}
                </span>
                <ChevronDown size={16} />
              </button>
              <OptionDropdown
                isOpen={isOpenMethods}
                setIsOpen={setIsOpenMethods}
                options={[
                  { id: "pm", label: "Pago Móvil", isUsd: false },
                  { id: "pdv", label: "Punto de Venta", isUsd: false },
                  { id: "bs", label: "Efectivo Bs", isUsd: false },
                  { id: "usd", label: "Efectivo Divisas ($)", isUsd: true },
                ]}
                onSelect={(m) => {
                  setCurrentMethod(m);
                  setInputValue("");
                }}
                getLabel={(m) => m.label}
              />
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-zinc-400">
                  {currentMethod.isUsd ? "$" : "Bs"}
                </span>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-white border border-zinc-200 pl-10 pr-4 py-4 rounded-2xl text-lg font-black outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                />
                {currentMethod.isUsd && inputValue && (
                  <span className="absolute -bottom-6 left-2 text-[10px] font-bold text-zinc-400 italic">
                    ≈ Bs. {(parseFloat(inputValue) * tasa).toFixed(2)}
                  </span>
                )}
              </div>
              <button
                onClick={addPayment}
                className="bg-primary text-white px-6 rounded-2xl font-black shadow-lg shadow-primary/30 active:scale-90 transition-all"
              >
                <Plus size={24} />
              </button>
            </div>
          </div>

          {/* Lista de Pagos Parciales */}
          <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-none">
            <AnimatePresence>
              {payments.map((p) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  key={p.id}
                  className="flex justify-between items-center p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm group"
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-zinc-400">
                      {p.method}
                    </span>
                    <span className="font-bold text-zinc-700 text-sm">
                      Bs. {p.amountBs.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-medium text-zinc-400">
                      ${p.amountRef.toFixed(2)}
                    </span>
                    <button
                      onClick={() =>
                        setPayments(payments.filter((x) => x.id !== p.id))
                      }
                      className="text-zinc-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <footer className="p-8 bg-zinc-50 border-t border-zinc-100">
          <button
            disabled={remainingBs > 10}
            onClick={() => onConfirm(payments)}
            className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 disabled:opacity-40 disabled:grayscale transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            Confirmar Registro
            <div className="bg-white/20 p-1 rounded-lg">
              <Plus size={20} />
            </div>
          </button>
        </footer>
      </motion.div>
    </div>
  );
}
