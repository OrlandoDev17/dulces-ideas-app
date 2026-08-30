"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { useInventory } from "@/hooks/api/useInventory";
import { CategorySection } from "@/components/inventory/CategorySection";
import { ProductFormModal } from "@/components/inventory/ProductFormModal";
import { ConfirmDeleteModal } from "@/components/common/ConfirmDeleteModal";
import { Button } from "@/components/common/Button";
import { Plus, CakeSlice, Cake, CupSoda, Loader2 } from "lucide-react";
import type { InventoryProduct, ProductCategory } from "@/shared/types";

const CATEGORY_ICONS: Record<ProductCategory, React.ReactNode> = {
  "Postres / Porciones": <CakeSlice size={20} />,
  "Tortas Completas": <Cake size={20} />,
  "Bebidas": <CupSoda size={20} />,
};

export default function InventoryPage() {
  const {
    grouped,
    isLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    isCreating,
    isUpdating,
    isDeleting,
  } = useInventory();

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<InventoryProduct | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<InventoryProduct | null>(null);

  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product: InventoryProduct) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSubmit = (data: {
    name: string;
    price: number;
    currency: "USD" | "VES";
    category: ProductCategory;
  }) => {
    if (editingProduct) {
      updateProduct(
        { id: editingProduct.id, ...data },
        {
          onSuccess: () => {
            setShowForm(false);
            setEditingProduct(null);
          },
        }
      );
    } else {
      createProduct(data, {
        onSuccess: () => {
          setShowForm(false);
        },
      });
    }
  };

  const handleDelete = () => {
    if (!deletingProduct) return;
    deleteProduct(deletingProduct.id, {
      onSuccess: () => setDeletingProduct(null),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4 w-full md:max-w-7xl md:mx-auto p-2 md:p-6"
    >
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-800">
            Inventario
          </h1>
          <p className="text-sm font-medium text-zinc-400">
            Gestiona los productos de tu tienda
          </p>
        </div>
        <Button style="primary" onClick={handleCreate}>
          <Plus size={18} />
          <span className="hidden sm:inline">Agregar</span>
        </Button>
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-col gap-3">
        {(Object.keys(grouped) as ProductCategory[]).map((category) => (
          <CategorySection
            key={category}
            label={category}
            products={grouped[category]}
            icon={CATEGORY_ICONS[category]}
            onEdit={handleEdit}
            onDelete={setDeletingProduct}
            defaultOpen={category === "Postres / Porciones"}
          />
        ))}
      </motion.div>

      <ProductFormModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSubmit}
        product={editingProduct}
        isPending={isCreating || isUpdating}
      />

      <ConfirmDeleteModal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDelete}
        title="Eliminar Producto"
        message={`¿Estás seguro de eliminar "${deletingProduct?.name}"? Esta acción no se puede deshacer.`}
        isPending={isDeleting}
      />
    </motion.div>
  );
}
