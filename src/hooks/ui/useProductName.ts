"use client";

import { useCallback } from "react";
import { usePosData } from "@/hooks/api/usePosData";
import type { Product } from "@/shared/types";

/**
 * Hook reutilizable para obtener el nombre de un producto por su ID.
 * Busca en todas las categorías disponibles en el POS.
 */
export function useProductName() {
  const { productCategories } = usePosData();

  const getProductName = useCallback(
    (id: string | number): string => {
      if (!productCategories) return "Cargando...";

      const searchId = String(id);

      for (const category of productCategories) {
        const product = category.options.find(
          (p: Product) => String(p.id) === searchId,
        );
        if (product) return product.name;
      }

      return `ID: ${id}`;
    },
    [productCategories],
  );

  return { getProductName };
}