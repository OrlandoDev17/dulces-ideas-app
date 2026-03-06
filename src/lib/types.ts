import { ComponentType } from "react";

export interface NavLink {
  id: string;
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

export interface Product {
  id: number | string;
  name: string;
  price: number;
  currency: string;
}

export interface Category {
  label: string;
  options: Product[];
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
  name?: string;
  price: number;
  quantity: number;
  currency?: string;
  product_id?: string;
  price_at_moment?: number;
}

export interface Payment {
  id: string;
  methodId: string;
  amountBs: number;
  amountRef: number;
  currency: "VES" | "USD";
  method_id?: string;
  amount_bs?: number;
  amount_ref?: number;
}

export interface Sale {
  id: string;
  items?: CartItem[];
  totalUsd?: number;
  totalBs?: number;
  totalBS?: number; // legacy/local
  totalUSD?: number; // legacy/local
  tasa_bcv?: number;
  metodo?: string;
  method_id?: string; // from supabase
  fecha?: string;
  delivery: boolean;
  delivery_name?: string | null;
  deliveryName?: string | null; // legacy/local
  delivery_amount?: number | null;
  deliveryAmount?: number | null; // legacy/local
  payments?: Payment[];
  is_archived?: boolean;
  status?: string;
  type?: "regular" | "order_payment";
  description?: string;
  orderId?: string;
  session_id?: string | null;
  sale_items?: CartItem[];
  sale_payments?: Payment[];
  total_bs?: number;
  total_usd?: number;
  created_at?: string;
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
  id?: string;
  name: string;
  is_open: boolean;
  created_at?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  currency: "VES" | "USD";
}
