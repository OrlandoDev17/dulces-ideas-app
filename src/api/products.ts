import { supabase } from "@/shared/config/supabase";
import type { InventoryProduct, PaymentMethod } from "@/shared/types";

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

  /**
   * Crea una nueva cuenta de Pago Móvil como un método de pago
   * con id `pm_<slug>` y nombre "Bs - Pago Móvil (Nombre)".
   */
  async createPaymentAccount(name: string): Promise<PaymentMethod> {
    const cleanName = name.trim();
    const slugBase =
      cleanName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "") || "cuenta";

    let id = `pm_${slugBase}`;

    // Evitar colisión con cuentas existentes
    const { data: existing } = await supabase
      .from("payment_methods")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (existing) {
      id = `${id}_${Date.now().toString(36)}`;
    }

    const { data, error } = await supabase
      .from("payment_methods")
      .insert([{ id, name: `Bs - Pago Móvil (${cleanName})`, currency: "VES" }])
      .select()
      .single();

    if (error) throw error;
    return data as PaymentMethod;
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
