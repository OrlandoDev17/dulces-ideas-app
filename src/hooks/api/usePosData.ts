import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/api/products";
import { useStore } from "@/context/StoreContext";

export function usePosData() {
  const { activeStore } = useStore();

  // Productos globales
  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: () => productsApi.getProductsByCategory(),
    enabled: !!activeStore?.id,
    staleTime: 1000 * 60 * 5, // 5 min
    gcTime: 1000 * 60 * 30, // 30 min
  });

  // Métodos de pago globales
  const paymentMethodsQuery = useQuery({
    queryKey: ["payment_methods"],
    queryFn: () => productsApi.getPaymentMethods(),
    enabled: !!activeStore?.id,
    staleTime: 1000 * 60 * 5, // 5 min
    gcTime: 1000 * 60 * 30, // 30 min
  });

  return {
    productCategories: productsQuery.data || [],
    paymentMethods: paymentMethodsQuery.data || [],
    isLoading: productsQuery.isLoading || paymentMethodsQuery.isLoading,
  };
}
