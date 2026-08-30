"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { InventoryProduct } from "@/shared/types";

interface ProductListProps {
  products: InventoryProduct[];
  onEdit: (product: InventoryProduct) => void;
  onDelete: (product: InventoryProduct) => void;
}

export function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  if (products.length === 0) {
    return (
      <p className="text-zinc-400 text-sm font-medium py-4 text-center">
        No hay productos en esta categoría
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex items-center justify-between gap-3 px-4 py-3 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-colors"
        >
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-zinc-800 truncate">
              {product.name}
            </span>
            <span className="text-xs font-medium text-zinc-400">
              {product.currency} {product.price.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(product)}
              className="p-2 text-zinc-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Editar"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onDelete(product)}
              className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
