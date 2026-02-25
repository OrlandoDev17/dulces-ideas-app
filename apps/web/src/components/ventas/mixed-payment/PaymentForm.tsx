import {
  Plus,
  Banknote,
  Smartphone,
  DollarSign,
  CreditCard,
} from "lucide-react";
import { DropdownButton } from "../../common/DropdownButton";
import { OptionDropdown } from "../../common/OptionDropdown";

interface Props {
  amount: number | "";
  setAmount: (v: number | "") => void;
  selectedMethod: { id: string; label: string };
  setSelectedMethod: (v: { id: string; label: string }) => void;
  isOpenMethod: boolean;
  setIsOpenMethod: (v: boolean) => void;
  paymentOptions: { id: string; label: string }[];
  onAdd: () => void;
}

/**
 * Obtiene el icono correspondiente al método de pago.
 */
const getMethodIcon = (id: string) => {
  switch (id) {
    case "bs":
      return <Banknote size={16} />;
    case "pm":
      return <Smartphone size={16} />;
    case "usd":
      return <DollarSign size={16} />;
    default:
      return <CreditCard size={16} />;
  }
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
  return (
    <section className="flex flex-col gap-3">
      <label className="text-xs font-bold uppercase text-zinc-400 tracking-wider ml-1">
        Agregar Pago
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Selector de Método */}
        <div className="w-full sm:w-1/2 relative">
          <DropdownButton isOpen={isOpenMethod} setIsOpen={setIsOpenMethod}>
            {getMethodIcon(selectedMethod.id)}
            <span className="truncate">{selectedMethod.label}</span>
          </DropdownButton>
          <OptionDropdown
            isOpen={isOpenMethod}
            setIsOpen={setIsOpenMethod}
            options={paymentOptions}
            onSelect={setSelectedMethod}
            getLabel={(opt) => opt.label}
            maxHeight="max-h-[120px]"
          />
        </div>

        {/* Input de Monto y Botón Añadir */}
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
                setAmount(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full bg-primary-50 border border-primary-200 pl-8 pr-4 py-4 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary-500 transition-all font-mono"
              onKeyDown={(e) => e.key === "Enter" && onAdd()}
            />
          </div>
          <button
            onClick={onAdd}
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
