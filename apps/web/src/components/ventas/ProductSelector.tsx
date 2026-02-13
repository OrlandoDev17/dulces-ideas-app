"use client";

// Hooks
import { useState } from "react";
// Components
import { OptionDropdown } from "@/components/common/OptionDropdown";
// Icons
import { Plus, ChevronDown } from "lucide-react";
// Types
import type {
  ProductSelector as ProductSelectorType,
  Product,
} from "@/lib/types";

interface Props extends ProductSelectorType {
  onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductSelector({
  title,
  icon: Icon,
  products,
  onAddToCart,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const handleAdd = () => {
    if (selectedProduct && quantity > 0) {
      onAddToCart(selectedProduct, quantity);
      setQuantity(1);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full bg-white p-4 rounded-2xl border border-zinc-100 shadow-md relative">
      {/* Cabecera del Selector */}
      <header className="flex items-center gap-2 text-primary font-bold text-lg">
        {Icon && <Icon className="size-8" />}
        <h3>{title}</h3>
      </header>

      {/* Controles */}
      <div className="flex gap-2 items-center">
        {/* Dropdown Personalizado */}
        <div className="relative flex-1">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between bg-zinc-50 border border-primary rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer transition-all duration-200 text-left"
          >
            <span className="truncate">
              {selectedProduct
                ? `${selectedProduct.name} (${selectedProduct.price})`
                : "-- Seleccionar --"}
            </span>
            <ChevronDown
              size={18}
              className={`text-primary transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

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

        {/* Input de Cantidad */}
        <input
          type="number"
          value={quantity}
          min={1}
          onChange={(e) =>
            setQuantity(Math.max(1, parseInt(e.target.value) || 1))
          }
          className="w-14 bg-white border border-primary rounded-xl px-2 py-2.5 text-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
        />

        {/* Botón Añadir */}
        <button
          onClick={handleAdd}
          disabled={!selectedProduct}
          className="bg-slate-100 p-2.5 rounded-xl text-slate-600 hover:bg-primary hover:text-white transition-colors cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}
