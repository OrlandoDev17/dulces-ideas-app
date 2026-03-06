"use client";

// Hooks
import { useState } from "react";
// Components
import { OptionDropdown } from "@/components/common/OptionDropdown";
// Icons
import { Plus, Minus } from "lucide-react";
// Types
// Types
import type {
  ProductSelector as ProductSelectorType,
  Product,
} from "@/lib/types";
import { DropdownButton } from "@/components/common/DropdownButton";

interface Props extends ProductSelectorType {
  onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductSelector({
  title,
  icon: Icon,
  products,
  onAddToCart,
}: Props) {
  // Estados
  const [isOpen, setIsOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<string>("1");

  // Función para añadir el producto al carrito
  const handleAdd = () => {
    const qtyNum = parseInt(quantity);
    if (selectedProduct && qtyNum > 0) {
      onAddToCart(selectedProduct, qtyNum);
      setQuantity("1");
      setSelectedProduct(null);
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

  return (
    <article
      className={`flex flex-col gap-3 w-full bg-white p-3 sm:p-4 rounded-2xl border border-zinc-200 shadow-lg shadow-primary-500/20 relative ${isOpen ? "z-30" : "z-10"}`}
    >
      {/* Cabecera del Selector */}
      <header className="flex items-center gap-2 text-primary-600 font-bold text-lg">
        {Icon && <Icon className="size-6" aria-hidden="true" />}
        <h3 className="text-sm">{title}</h3>
      </header>

      {/* Controles */}
      <div className="flex gap-2 items-center">
        {/* Dropdown Personalizado */}
        <div className={`relative flex-1 min-w-0`}>
          <DropdownButton isOpen={isOpen} setIsOpen={setIsOpen}>
            <span
              className="truncate text-xs flex-1 min-w-0 mr-1"
              title={selectedProduct ? selectedProduct.name : ""}
            >
              {selectedProduct
                ? `${selectedProduct.name} (${selectedProduct.price})`
                : "Seleccionar…"}
            </span>
          </DropdownButton>

          {/* Lista de Opciones Estilizada */}
          <OptionDropdown
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onSelect={setSelectedProduct}
            options={products}
            getLabel={(p) => p.name}
            getExtra={(p) => `${p.price} ${p.currency}`}
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
            aria-label={`Cantidad para ${title}`}
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
          aria-label={`Añadir ${selectedProduct?.name || "producto"} al carrito`}
          className="bg-primary-600 p-3.5 rounded-xl text-white hover:bg-primary-700 transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed shadow-md hover:shadow-primary-600/20"
        >
          <Plus size={18} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

export function ProductSelectorSkeleton() {
  return (
    <article className="flex flex-col gap-3 w-full h-[154px] bg-white p-3 sm:p-4 rounded-2xl border border-zinc-100 shadow-md animate-pulse">
      <header className="flex items-center gap-2">
        <div className="size-9 bg-zinc-300 rounded-xl" />
        <div className="h-5 w-32 bg-zinc-300 rounded-lg" />
      </header>

      <div className="flex gap-2 items-center mt-auto">
        {/* Dropdown placeholder */}
        <div className="flex-1 h-12 bg-zinc-200 rounded-xl border border-zinc-200 flex items-center px-4">
          <div className="h-3 w-24 bg-zinc-300 rounded" />
        </div>

        {/* Stepper placeholder */}
        <div className="h-12 w-28 bg-zinc-200 rounded-xl border border-zinc-200 flex items-center justify-between px-3">
          <div className="size-4 bg-zinc-300 rounded-full" />
          <div className="h-4 w-4 bg-zinc-300 rounded" />
          <div className="size-4 bg-zinc-300 rounded-full" />
        </div>

        {/* Button placeholder */}
        <div className="h-12 w-12 bg-zinc-300 rounded-xl flex items-center justify-center">
          <div className="size-5 bg-zinc-200/50 rounded-full" />
        </div>
      </div>
    </article>
  );
}
