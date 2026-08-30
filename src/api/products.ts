import { supabase } from "@/shared/config/supabase";
import type { InventoryProduct, ProductCategory } from "@/shared/types";

export const productsApi = {
  async getProductsByCategory() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true);

    if (error) throw error;

    const orderedLabels = [
      "Postres / Porciones",
      "Tortas Completas",
      "Bebidas",
    ];

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

  // --- Inventario CRUD ---

  async getProductsByStore(storeId: string): Promise<InventoryProduct[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", storeId)
      .eq("is_active", true)
      .order("category")
      .order("name");

    if (error) throw error;
    return data;
  },

  async createProduct(
    product: Omit<InventoryProduct, "id" | "created_at">
  ): Promise<InventoryProduct> {
    const { data, error } = await supabase
      .from("products")
      .insert({
        name: product.name,
        price: product.price,
        currency: product.currency,
        category: product.category,
        store_id: product.store_id,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProduct(
    id: string,
    updates: Partial<Pick<InventoryProduct, "name" | "price" | "currency">>
  ): Promise<InventoryProduct> {
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from("products")
      .update({ is_active: false })
      .eq("id", id);

    if (error) throw error;
  },
};
