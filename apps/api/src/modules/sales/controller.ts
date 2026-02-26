import type { Request, Response } from "express";
import { SalesService } from "./service";

export const SalesController = {
  async create(req: Request, res: Response) {
    try {
      const sale = await SalesService.registerFullSale(req.body);
      res
        .status(201)
        .json({ message: "Venta registrada con éxito", data: sale });
    } catch (error: any) {
      console.error("Error en SalesController.create:", error);
      res
        .status(500)
        .json({ error: "Error al procesar la venta", details: error.message });
    }
  },

  async getRecent(req: Request, res: Response) {
    try {
      const { sessionId } = req.params as { sessionId: string };
      const sales = await SalesService.getRecent(sessionId);
      res.json(sales);
    } catch (error: any) {
      res
        .status(500)
        .json({ error: "Error al obtener historial", details: error.message });
    }
  },

  async getBalance(req: Request, res: Response) {
    try {
      const { sessionId } = req.params as { sessionId: string };
      const balance = await SalesService.getBalance(sessionId);
      res.json(balance);
    } catch (error: any) {
      res
        .status(500)
        .json({ error: "Error al calcular balance", details: error.message });
    }
  },
};
