import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "@/api/products";
import { useStore } from "@/context/StoreContext";
import type { InventoryProduct, ProductCategory } from "@/shared/types";

export function useInventory() {
  const { activeStore } = useStore();
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ["inventory", activeStore?.id],
    queryFn: () => productsApi.getProductsByStore(activeStore!.id),
    enabled: !!activeStore?.id,
  });

  const createMutation = useMutation({
    mutationFn: (data: {
      name: string;
      price: number;
      currency: "USD" | "VES";
      category: ProductCategory;
    }) =>
      productsApi.createProduct({
        ...data,
        store_id: activeStore!.id,
        is_active: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", activeStore?.id] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...updates }: { id: string; name?: string; price?: number; currency?: "USD" | "VES" }) =>
      productsApi.updateProduct(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", activeStore?.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", activeStore?.id] });
    },
  });

  const products = productsQuery.data ?? [];

  const grouped = {
    "Postres / Porciones": products.filter((p) => p.category === "Postres / Porciones"),
    "Tortas Completas": products.filter((p) => p.category === "Tortas Completas"),
    "Bebidas": products.filter((p) => p.category === "Bebidas"),
  };

  return {
    products,
    grouped,
    isLoading: productsQuery.isLoading,
    createProduct: createMutation.mutate,
    updateProduct: updateMutation.mutate,
    deleteProduct: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
