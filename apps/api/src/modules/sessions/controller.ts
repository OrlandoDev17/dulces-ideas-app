import type { Request, Response } from "express";
import { prisma } from "../../config/prisma";

export const SessionsController = {
  async list(_req: Request, res: Response) {
    try {
      const sessions = await prisma.session.findMany({
        orderBy: { createdAt: "desc" },
      });
      res.json(sessions);
    } catch (error: any) {
      // ESTO imprimiría el error real en tu terminal (ej: "Table sessions not found")
      console.error("DEBUG PRISMA ERROR:", error);

      res.status(500).json({
        error: "Error al listar cajas/sesiones",
        message: error.message, // <--- Agrégalo temporalmente para ver el detalle en Postman
      });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { name } = req.body;
      if (!name)
        return res
          .status(400)
          .json({ error: "El nombre de la sesión es requerido" });

      const session = await prisma.session.create({
        data: { name },
      });
      res.status(201).json(session);
    } catch (error) {
      res.status(500).json({ error: "Error al crear nueva sesión" });
    }
  },
};
