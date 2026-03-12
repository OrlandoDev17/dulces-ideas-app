import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function usePosData() {
  // 1. Traer productos y agruparlos
  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true);

      if (error) throw error;

      // Transformamos la lista plana en la estructura agrupada
      const categories = ["Postres / Porciones", "Tortas Completas", "Bebidas"];

      return categories.map((cat) => ({
        label: cat,
        options: data.filter((p) => p.category === cat),
      }));
    },
    // 1. Los datos son viejos de inmediato (fuerza a re-verificar)
    staleTime: 0,

    // 2. Si el usuario cambia de pestaña a Supabase y vuelve, que se actualice solo
    refetchOnWindowFocus: true,

    // 3. Mantén los productos en memoria 10 minutos por si navegas a otra parte
    gcTime: 1000 * 60 * 10,
  });

  // 2. Traer Metodos de pago
  const paymentMethodsQuery = useQuery({
    queryKey: ["payment_methods"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*");

      if (error) throw error;

      return data;
    },
  });

  return {
    productCategories: productsQuery.data,
    paymentMethods: paymentMethodsQuery.data,
    isLoading: productsQuery.isLoading || paymentMethodsQuery.isLoading,
  };
}
