import {
  Plus,
  Banknote,
  Smartphone,
  DollarSign,
  CreditCard,
} from "lucide-react";
import { DropdownButton } from "@/components/common/DropdownButton";
import { OptionDropdown } from "@/components/common/OptionDropdown";
import { PaymentMethod } from "@/lib/types";
import { useRef } from "react";

interface Props {
  amount: number | "";
  setAmount: (v: number | "") => void;
  selectedMethod: PaymentMethod;
  setSelectedMethod: (v: PaymentMethod) => void;
  isOpenMethod: boolean;
  setIsOpenMethod: (v: boolean) => void;
  paymentOptions: PaymentMethod[];
  onAdd: () => void;
}

/**
 * Obtiene el icono correspondiente al método de pago.
 */
const getMethodIcon = (id: string) => {
  const mid = id.toLowerCase();
  if (mid.includes("bs") || mid.includes("efectivo") || mid.includes("cash"))
    return <Banknote size={16} />;
  if (
    mid.includes("pm") ||
    mid.includes("movil") ||
    mid.includes("transferencia")
  )
    return <Smartphone size={16} />;
  if (mid.includes("usd") || mid.includes("zelle") || mid.includes("dolar"))
    return <DollarSign size={16} />;
  return <CreditCard size={16} />;
};

/**
 * Formulario para agregar una nueva línea de pago al pago mixto.
 */
export function PaymentForm({
  amount,
  setAmount,
  selectedMethod,
  setSelectedMethod,
  isOpenMethod,
  setIsOpenMethod,
  paymentOptions,
  onAdd,
}: Props) {
  const methodTriggerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="flex flex-col gap-3">
      <label className="text-xs font-bold uppercase text-zinc-400 tracking-wider ml-1">
        Agregar Pago
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Selector de Método */}
        <div className="w-full sm:w-1/2 relative" ref={methodTriggerRef}>
          <DropdownButton isOpen={isOpenMethod} setIsOpen={setIsOpenMethod}>
            {getMethodIcon(selectedMethod.id)}
            <span className="truncate">{selectedMethod.name}</span>
          </DropdownButton>
          <OptionDropdown
            isOpen={isOpenMethod}
            setIsOpen={setIsOpenMethod}
            options={paymentOptions}
            onSelect={setSelectedMethod}
            getLabel={(opt) => opt.name}
            getExtra={(opt) => (
              <span
                className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                  opt.currency === "USD"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {opt.currency}
              </span>
            )}
            triggerRef={methodTriggerRef}
          />
        </div>

        {/* Input de Monto y Botón Añadir */}
        <div className="flex items-center gap-2 w-full sm:w-1/2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs pointer-events-none">
              {selectedMethod.currency === "USD" ? "$" : "Bs"}
            </span>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full bg-primary-50 border border-primary-200 pl-8 pr-4 py-4 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary-500 transition-all font-mono"
              onKeyDown={(e) => e.key === "Enter" && onAdd()}
            />
          </div>
          <button
            onClick={onAdd}
            type="button"
            disabled={!amount || Number(amount) <= 0}
            className="p-2.5 bg-primary-500 text-primary-50 rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Agregar pago"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
