import { ComponentType } from "react";

export interface NavLink {
  id: string;
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

export interface Product {
  name: string;
  price: number;
  currency: string;
}

export interface ProductSelector {
  id?: string;
  title: string;
  icon: ComponentType<{ className?: string }>;
  quantity?: number;
  products: Product[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  currency: string;
}

export interface Payment {
  id: string;
  method: string;
  amountBs: number;
  amountRef: number;
}

export interface Sale {
  id: string;
  items: CartItem[];
  totalUSD: number;
  totalBS: number;
  metodo: string;
  fecha: string;
  delivery: boolean;
  deliveryName?: string;
  deliveryAmount?: number;
  payments?: Payment[];
  type?: "regular" | "order_payment";
  description?: string;
  orderId?: string;
}

export interface OrderPayment {
  id: string;
  amountBs: number;
  amountRef: number;
  method: string;
  fecha: string;
}

export type OrderStatus = "espera" | "parcial" | "pagado" | "entregado";

export interface Order {
  id: string;
  clienteNombre: string;
  clienteTelefono: string;
  productoNombre: string;
  totalUSD: number;
  totalBS: number;
  fechaInicio: string;
  fechaEntrega: string;
  delivery: boolean;
  pagos: OrderPayment[];
  estado: OrderStatus;
}

export interface Cierre {
  id: string;
  monto: number;
  fecha: string;
}

export interface Session {
  id: string;
  name: string;
}
