"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { Package, Pencil } from "lucide-react";
import type { InventoryProduct, ProductCategory } from "@/shared/types";

const CATEGORIES: ProductCategory[] = [
  "Postres / Porciones",
  "Tortas Completas",
  "Bebidas",
];

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    price: number;
    currency: "USD" | "VES";
    category: ProductCategory;
  }) => void;
  product?: InventoryProduct | null;
  isPending?: boolean;
}

export function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  product,
  isPending,
}: ProductFormModalProps) {
  const isEditing = !!product;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState<"USD" | "VES">("USD");
  const [category, setCategory] = useState<ProductCategory>("Postres / Porciones");

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(String(product.price));
      setCurrency(product.currency);
      setCategory(product.category);
    } else {
      setName("");
      setPrice("");
      setCurrency("USD");
      setCategory("Postres / Porciones");
    }
  }, [product, isOpen]);

  const handleSubmit = () => {
    if (!name.trim() || !price || Number(price) <= 0) return;
    onSubmit({
      name: name.trim(),
      price: Number(price),
      currency,
      category,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Editar Producto" : "Agregar Producto"}
      description={isEditing ? "Modifica los datos del producto" : "Agrega un nuevo producto al inventario"}
      icon={isEditing ? Pencil : Package}
      footer={
        <Button
          style="primary"
          onClick={handleSubmit}
          disabled={!name.trim() || !price || Number(price) <= 0 || isPending}
          isLoading={isPending}
        >
          {isEditing ? "Guardar Cambios" : "Agregar Producto"}
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-zinc-600">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Red Velvet"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-800 font-medium placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-sm font-bold text-zinc-600">Precio</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-800 font-medium placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-zinc-600">Moneda</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as "USD" | "VES")}
              className="px-4 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-800 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option value="USD">USD</option>
              <option value="VES">VES</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-zinc-600">Categoría</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ProductCategory)}
            className="px-4 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-800 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
}
