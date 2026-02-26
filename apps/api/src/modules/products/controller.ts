import type { Request, Response } from "express";
import { prisma } from "../../config/prisma";

export const ProductsController = {
  async listGrouped(_req: Request, res: Response) {
    try {
      const categories = await prisma.category.findMany({
        include: {
          products: {
            where: { active: true },
            orderBy: { name: "asc" },
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

      res.json(formatted);
    } catch (error) {
      res.status(500).json({ error: "Error al cargar catálogo de productos" });
    }
  },

  async listMethods(_req: Request, res: Response) {
    try {
      const methods = await prisma.paymentMethod.findMany({
        orderBy: { name: "asc" },
      });
      res.json(methods);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener métodos de pago" });
    }
  },
};
