import { Router } from "express";
import { SalesController } from "../modules/sales/controller";
import { ProductsController } from "../modules/products/controller";
import { SessionsController } from "../modules/sessions/controller";

const router = Router();

// Catálogos para el Frontend
router.get("/products", ProductsController.listGrouped);
router.get("/payment-methods", ProductsController.listMethods);

// Flujo de Ventas e Ingresos
router.post("/sales", SalesController.create); // Registrar Venta + Caja
router.get("/sales/recent/:sessionId", SalesController.getRecent); // Historial
router.get("/sales/balance/:sessionId", SalesController.getBalance); // Cuadritos de ingresos

// Gestión de Cajas
router.get("/sessions", SessionsController.list);
router.post("/sessions", SessionsController.create);

export default router;
