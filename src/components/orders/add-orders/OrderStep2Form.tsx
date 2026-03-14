import { AnimatePresence, motion } from "motion/react";
import { useState, useRef } from "react";
import { CartItem, Payment, PaymentMethod, Product } from "@/lib/types";
import { OptionDropdown } from "@/components/common/OptionDropdown";
import { DropdownButton } from "@/components/common/DropdownButton";
import { DollarSign, Minus, Package, Plus, Search, Trash } from "lucide-react";

interface OrderStep2FormProps {
  products: Product[];
  cart: CartItem[];
  payments: Payment[];
  onAddToCart: (product: Product, quantity: number) => void;
  onRemoveFromCart: (id: string) => void;
  paymentOptions: PaymentMethod[];
  onAddPayment: (method: PaymentMethod, amount: number) => void;
  onRemovePayment: (id: string) => void;
  tasa: number;
}

export function OrderStep2Form({
  products,
  cart,
  payments,
  onAddToCart,
  onRemoveFromCart,
  paymentOptions,
  onAddPayment,
  onRemovePayment,
  tasa,
}: OrderStep2FormProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<string>("1");
  const [hasAdvance, setHasAdvance] = useState<boolean>(false);
  const [isOpenMethod, setIsOpenMethod] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
    paymentOptions[0],
  );
  const [amount, setAmount] = useState<number | string>("");

  const productTriggerRef = useRef<HTMLDivElement>(null);
  const methodTriggerRef = useRef<HTMLDivElement>(null);

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // --- CÁLCULOS ---
  const subtotalUsd = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const subtotalBs = subtotalUsd * tasa;

  const totalAdvancesUsd = payments.reduce(
    (acc, p) => acc + (p.amountRef || 0),
    0,
  );
  const totalAdvancesBs = payments.reduce(
    (acc, p) => acc + (p.amountBs || 0),
    0,
  );

  // Para el balance, convertimos todo a una sola moneda base (USD) para restar y luego mostramos ambos
  const remainingUsd = Math.max(
    0,
    subtotalUsd - totalAdvancesUsd - totalAdvancesBs / tasa,
  );
  const remainingBs = remainingUsd * tasa;

  // Función para añadir el producto al carrito
  const handleAdd = () => {
    const qtyNum = parseInt(quantity);
    if (selectedProduct && qtyNum > 0) {
      onAddToCart(selectedProduct, qtyNum);
      setQuantity("1");
      setSelectedProduct(null);
      setSearchTerm("");
    }
  };

  const increment = () => {
    setQuantity((prev) => {
      const val = parseInt(prev) || 0;
      return (val + 1).toString();
    });
  };

  const decrement = () => {
    setQuantity((prev) => {
      const val = parseInt(prev) || 1;
      if (val <= 1) return "1";
      return (val - 1).toString();
    });
  };

  const handleAddPaymentClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (amount && Number(amount) > 0) {
      onAddPayment(selectedMethod, Number(amount));
      setAmount("");
    }
  };

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col gap-4">
        {/* Controles */}
        <div className="flex gap-2 items-center relative">
          {/* Dropdown Personalizado */}
          <div className={`flex-1 min-w-0`} ref={productTriggerRef}>
            <DropdownButton
              isOpen={isOpenDropdown}
              setIsOpen={(val) => {
                setIsOpenDropdown(val);
                if (!val) setSearchTerm("");
              }}
            >
              {isOpenDropdown ? (
                <div className="flex items-center gap-2 w-full animate-in fade-in duration-200">
                  <Search size={12} className="text-primary-400 shrink-0" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Buscar..."
                    className="bg-transparent border-none outline-none w-full text-xs text-primary-900 placeholder:text-zinc-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && filteredProducts.length > 0) {
                        setSelectedProduct(filteredProducts[0]);
                        setIsOpenDropdown(false);
                        setSearchTerm("");
                      }
                    }}
                  />
                </div>
              ) : (
                <span
                  className="truncate text-xs flex-1 min-w-0 mr-1"
                  title={selectedProduct ? selectedProduct.name : ""}
                >
                  {selectedProduct
                    ? `${selectedProduct.name} (${selectedProduct.price})`
                    : "Seleccionar…"}
                </span>
              )}
            </DropdownButton>

            {/* Lista de Opciones Estilizada */}
            <OptionDropdown
              isOpen={isOpenDropdown}
              setIsOpen={setIsOpenDropdown}
              onSelect={(p) => {
                setSelectedProduct(p);
                setSearchTerm("");
                setIsOpenDropdown(false);
              }}
              options={filteredProducts}
              getLabel={(p) => p.name}
              getExtra={(p) => `${p.price} ${p.currency}`}
              maxHeight="max-h-[200px]"
              triggerRef={productTriggerRef}
            />
          </div>

          {/* Stepper de Cantidad */}
          <div className="flex items-center bg-zinc-50 border border-zinc-100 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={decrement}
              className="p-3 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors active:scale-90"
              aria-label="Disminuir cantidad"
            >
              <Minus size={14} />
            </button>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={quantity}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || /^[0-9\b]+$/.test(val)) {
                  setQuantity(val);
                }
              }}
              style={{ width: `${Math.max(1, quantity.length) + 1.5}ch` }}
              className="bg-transparent text-sm font-bold text-center focus:outline-none py-2"
            />
            <button
              onClick={increment}
              className="p-3 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors active:scale-90"
              aria-label="Aumentar cantidad"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Botón Añadir */}
          <button
            onClick={handleAdd}
            disabled={!selectedProduct}
            className="bg-primary-600 h-[52px] px-6 rounded-xl text-white hover:bg-primary-700 transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            <span className="text-xs font-bold hidden sm:inline">Añadir</span>
          </button>
        </div>

        {/* Lista de Productos (Carrito) */}
        <div className="bg-zinc-50/50 border border-zinc-100 rounded-[1.8rem] p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
             <div className="flex items-center gap-2 text-zinc-500">
               <Package size={14} />
               <h4 className="text-[10px] font-bold uppercase tracking-widest">Resumen de Productos</h4>
             </div>
             {cart.length > 0 && (
               <span className="bg-white px-2 py-0.5 rounded-full text-[9px] font-bold border border-zinc-100 text-zinc-400">
                 {cart.length} items
               </span>
             )}
          </div>
          
          <ul className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
            {cart.length > 0 ? (
              cart.map((item) => (
                <motion.li
                  layout
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={item.id}
                  className="bg-white p-3 rounded-2xl border border-zinc-100 flex items-center justify-between gap-3 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-50 text-primary-600 size-8 rounded-xl flex items-center justify-center text-xs font-black">
                      {item.quantity}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-zinc-800 leading-tight">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-medium">
                        Unit: ${item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-zinc-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => onRemoveFromCart(item.id)}
                      className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-95"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </motion.li>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 gap-2 opacity-40">
                <Package size={32} />
                <p className="text-xs font-bold italic">El carrito está vacío</p>
              </div>
            )}
          </ul>

          {/* Totales de Productos */}
          {cart.length > 0 && (
            <div className="flex flex-col gap-1 pt-2 border-t border-zinc-200">
              <div className="flex justify-between items-center text-zinc-500 text-xs font-semibold">
                <span>Subtotal Productos</span>
                <div className="text-right">
                  <p>${subtotalUsd.toFixed(2)}</p>
                  <p className="text-[10px] opacity-70">
                    Bs {subtotalBs.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-zinc-500 font-bold text-[11px] uppercase tracking-wider">
              Anticipos de la orden
            </h3>
            {payments.length > 0 && (
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                Total registrado: Bs {(totalAdvancesBs + (totalAdvancesUsd * tasa)).toLocaleString()} (${(totalAdvancesUsd + (totalAdvancesBs / tasa)).toFixed(2)})
              </span>
            )}
          </div>
          <ul className="flex flex-col gap-2 empty:hidden">
            {payments.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-2 px-3 py-2.5 border border-primary-100 rounded-xl bg-primary-50/30"
              >
                <div className="flex items-center gap-2.5">
                  <div className="bg-primary-100 p-2 rounded-lg text-primary-600">
                    <DollarSign size={14} />
                  </div>
                  <span className="text-xs font-bold text-zinc-700">
                    {paymentOptions.find((opt) => opt.id === p.methodId)
                      ?.name || "Método"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-primary-700">
                    {p.currency === "USD"
                      ? `$${p.amountRef?.toFixed(2)}`
                      : `Bs ${p.amountBs?.toLocaleString()}`}
                  </span>
                  <button
                    onClick={() => onRemovePayment(p.id)}
                    className="p-1 px-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Eliminar pago"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <fieldset className="flex flex-col gap-3 border-none p-0 m-0">
            <button
              type="button"
              onClick={() => setHasAdvance(!hasAdvance)}
              className={`w-full flex items-center justify-between border-2 rounded-xl px-4 py-3.5 text-sm font-black transition-all cursor-pointer ${
                hasAdvance
                  ? "bg-green-50 border-green-500 text-green-700 shadow-md shadow-green-100"
                  : "bg-white border-zinc-100 text-zinc-400 hover:border-zinc-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`p-1.5 rounded-lg ${hasAdvance ? "bg-green-500 text-white" : "bg-zinc-100 text-zinc-400"}`}
                >
                  <DollarSign size={16} />
                </div>
                Registrar Anticipo
              </div>
              <div
                className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${hasAdvance ? "bg-green-500" : "bg-zinc-200"}`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${hasAdvance ? "translate-x-4" : ""}`}
                />
              </div>
            </button>

            <AnimatePresence>
              {hasAdvance && (
                <motion.div
                  key="advance-payment-form"
                  initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                  animate={{ opacity: 1, height: "auto", overflow: "visible" }}
                  exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                >
                  <form className="flex items-center p-2 relative">
                    <div
                      className={`flex flex-col sm:flex-row gap-3 w-full ${isOpenMethod ? "z-50" : "z-10"}`}
                    >
                      {/* Selector de Método */}
                      <div className="w-full sm:w-1/2 relative" ref={methodTriggerRef}>
                        <DropdownButton
                          isOpen={isOpenMethod}
                          setIsOpen={setIsOpenMethod}
                        >
                          {selectedMethod.name}
                        </DropdownButton>
                        <OptionDropdown
                          isOpen={isOpenMethod}
                          setIsOpen={setIsOpenMethod}
                          options={paymentOptions}
                          onSelect={setSelectedMethod}
                          getLabel={(opt) => opt.name}
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
                              setAmount(
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value),
                              )
                            }
                            className="w-full bg-primary-50 border border-primary-200 pl-8 pr-4 py-4 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary-500 transition-all font-mono"
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleAddPaymentClick()
                            }
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddPaymentClick}
                          disabled={!amount || Number(amount) <= 0}
                          className="p-2.5 bg-primary-500 text-primary-50 rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                          title="Agregar pago"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </fieldset>
        </div>

        {/* Resumen Final de Saldos */}
        <div className="mt-2 bg-primary-600 rounded-2xl p-4 shadow-lg shadow-primary-900/20 text-white">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-end border-b border-primary-500/50 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                Saldo Restante
              </span>
              <div className="text-right">
                <p className="text-2xl font-black leading-none">
                  ${remainingUsd.toFixed(2)}
                </p>
                <p className="text-xs font-bold opacity-80 mt-1">
                  ~ Bs {remainingBs.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs font-bold">
              <div className="flex flex-col">
                <span className="opacity-70">VALOR TOTAL</span>
                <span>${subtotalUsd.toFixed(2)}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="opacity-70">ANTICIPOS</span>
                <span className="text-green-300">
                  -${(totalAdvancesUsd + totalAdvancesBs / tasa).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
