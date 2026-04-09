import { supabase } from "@/shared/config/supabase";

export const productsApi = {
  async getProductsByCategory() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true);

    if (error) throw error;

    // 1. Definimos el orden exacto que pediste
    const orderedLabels = [
      "Postres / Porciones",
      "Tortas Completas",
      "Bebidas",
    ];

    // 2. Mapeamos en ese orden
    const formattedData = orderedLabels.map((label) => ({
      label: label,
      options: data.filter((p) => p.category === label),
    }));

    return formattedData;
  },

  async getPaymentMethods() {
    const { data, error } = await supabase
      .from("payment_methods")
      .select("*")
      .order("name", { ascending: false });

    if (error) throw error;
    return data;
  },
};
