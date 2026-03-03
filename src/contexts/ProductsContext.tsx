import { useState, createContext, useContext, useCallback } from "react";
import axios from "axios";
import type { Category } from "@/lib/types";

interface ProductsContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined,
);

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setCategories(response.data);
    } catch (err: unknown) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Error al cargar los productos");
      } else {
        setError("Error al cargar los productos");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ProductsContext.Provider
      value={{ categories, loading, error, fetchProducts }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts debe usarse dentro de un ProductsProvider");
  }
  return context;
}
