"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ProductList } from "./ProductList";
import type { InventoryProduct } from "@/shared/types";

interface CategorySectionProps {
  label: string;
  products: InventoryProduct[];
  icon: React.ReactNode;
  onEdit: (product: InventoryProduct) => void;
  onDelete: (product: InventoryProduct) => void;
  defaultOpen?: boolean;
}

export function CategorySection({
  label,
  products,
  icon,
  onEdit,
  onDelete,
  defaultOpen = false,
}: CategorySectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-4 hover:bg-zinc-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="size-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
            {icon}
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-black text-zinc-800">{label}</span>
            <span className="text-xs font-medium text-zinc-400">
              {products.length} producto{products.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-zinc-400"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <ProductList
                products={products}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
