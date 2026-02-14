import {
  BarChart3,
  Cake,
  CakeSlice,
  CupSoda,
  LayoutDashboard,
  Store,
} from "lucide-react";
import type { NavLink, ProductSelector } from "./types";
import { BEBIDAS, POSTRES, TORTAS_COMPLETAS } from "./Mock";

export const NAV_LINKS: NavLink[] = [
  {
    id: "ventas",
    label: "Ventas",
    href: "/",
    icon: Store,
  },
  {
    id: "admin",
    label: "Administración",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    id: "encargos",
    label: "Encargos",
    href: "/encargos",
    icon: Cake,
  },
  {
    id: "reportes",
    label: "Reportes",
    href: "/reportes",
    icon: BarChart3,
  },
];

export const PRODUCT_CATEGORIES: ProductSelector[] = [
  {
    id: "postres",
    title: "Postres",
    icon: CakeSlice,
    quantity: 0,
    products: POSTRES,
  },
  {
    id: "tortas_completas",
    title: "Tortas Completas",
    icon: Cake,
    quantity: 0,
    products: TORTAS_COMPLETAS,
  },
  {
    id: "bebidas",
    title: "Bebidas",
    icon: CupSoda,
    quantity: 0,
    products: BEBIDAS,
  },
];

export const PAYMENT_METHODS = [
  { id: "pm", label: "Bs - Pago Móvil" },
  { id: "bs", label: "Bs - Efectivo" },
  { id: "pv", label: "Bs - Punto de Venta" },
  { id: "usd", label: "USD - Divisas" },
  { id: "mx", label: "Pago Mixto" },
];
