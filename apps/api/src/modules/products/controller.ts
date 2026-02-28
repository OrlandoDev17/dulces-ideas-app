import type { Request, Response } from "express";
import { prisma } from "../../config/prisma";

export const ProductsController = {
  async listGrouped(_req: Request, res: Response) {
    try {
      const categories = await prisma.category.findMany({
        include: {
          products: {
            where: { active: true },
            orderBy: { price: "asc" },
          },
        },
        orderBy: { name: "asc" },
      });

      const formatted = categories.map((cat) => ({
        label: cat.name,
        options: cat.products.map((p) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          currency: p.currency,
        })),
      }));

      // Orden manual solicitado por el usuario (Basado en los nombres exactos de la DB)
      const customOrder = [
        "Postres / Porciones",
        "Tortas Completas",
        "Bebidas",
      ];

      formatted.sort((a, b) => {
        const indexA = customOrder.indexOf(a.label);
        const indexB = customOrder.indexOf(b.label);

        // Si ambos están en el orden personalizado
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        // Si solo A está en el orden personalizado, va primero
        if (indexA !== -1) return -1;
        // Si solo B está en el orden personalizado, va primero
        if (indexB !== -1) return 1;
        // Si ninguno está, orden alfabético
        return a.label.localeCompare(b.label);
      });

      res.json(formatted);
    } catch (error) {
      res.status(500).json({ error: "Error al cargar catálogo de productos" });
    }
  },

  async listMethods(_req: Request, res: Response) {
    try {
      const methods = await prisma.paymentMethod.findMany({
        orderBy: { id: "asc" },
      });
      res.json(methods);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener métodos de pago" });
    }
  },
};
