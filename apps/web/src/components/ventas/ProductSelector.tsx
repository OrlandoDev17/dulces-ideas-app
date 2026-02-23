"use client";

// Hooks
import { useState } from "react";
// Components
import { OptionDropdown } from "@/components/common/OptionDropdown";
// Icons
import { Plus } from "lucide-react";
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
  const [quantity, setQuantity] = useState<number>(1);

  // Función para añadir el producto al carrito
  const handleAdd = () => {
    if (selectedProduct && quantity > 0) {
      onAddToCart(selectedProduct, quantity);
      setQuantity(1);
      setSelectedProduct(null);
    }
  };

  return (
    <article
      className={`flex flex-col gap-3 w-full bg-white p-3 sm:p-4 rounded-2xl border border-zinc-200 
      shadow-lg shadow-primary-500/20 relative ${isOpen ? "z-30" : "z-10"}`}
    >
      {/* Cabecera del Selector */}
      <header className="flex items-center gap-2 text-primary-600 font-bold text-lg">
        {Icon && <Icon className="size-5 2xl:size-8" aria-hidden="true" />}
        <h3 className="text-sm 2xl:text-base">{title}</h3>
      </header>

      {/* Controles */}
      <div className="flex gap-1.5 sm:gap-2 items-center">
        {/* Dropdown Personalizado */}
        <div className={`relative flex-1 min-w-0`}>
          <DropdownButton isOpen={isOpen} setIsOpen={setIsOpen}>
            <span
              className="truncate text-xs 2xl:text-base flex-1 min-w-0 mr-1"
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

        {/* Input de Cantidad */}
        <input
          type="number"
          value={quantity}
          min={1}
          aria-label={`Cantidad para ${title}`}
          onChange={(e) =>
            setQuantity(Math.max(1, parseInt(e.target.value) || 1))
          }
          className="w-12 px-2 py-4 bg-white border border-primary-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all duration-200 tabular-nums"
        />

        {/* Botón Añadir */}
        <button
          onClick={handleAdd}
          disabled={!selectedProduct}
          aria-label={`Añadir ${selectedProduct?.name || "producto"} al carrito`}
          className="border-2 border-primary-500 p-3 rounded-xl text-zinc-600 hover:bg-primary-500 hover:text-white transition-colors cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-lg hover:shadow-primary/20"
        >
          <Plus size={20} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
