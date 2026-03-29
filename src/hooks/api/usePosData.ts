import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/api/products";
import { useStore } from "@/context/StoreContext";

export function usePosData() {
  const { activeStore } = useStore();

  // Productos globales
  const productsQuery = useQuery({
    queryKey: ["products"], // Llave simple, ya que no cambia por tienda
    queryFn: () => productsApi.getProductsByCategory(),
    enabled: !!activeStore?.id,
    staleTime: 0, // 30 min (el catálogo no cambia seguido)
    gcTime: 0,
  });

  // Métodos de pago globales
  const paymentMethodsQuery = useQuery({
    queryKey: ["payment_methods"],
    queryFn: () => productsApi.getPaymentMethods(),
    enabled: !!activeStore?.id,
    staleTime: 0,
    gcTime: 0,
  });

  return {
    productCategories: productsQuery.data || [],
    paymentMethods: paymentMethodsQuery.data || [],
    isLoading: productsQuery.isLoading || paymentMethodsQuery.isLoading,
  };
}
