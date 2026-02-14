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

export interface Sale {
  id: string;
  items: CartItem[];
  totalUSD: number;
  totalBS: number;
  metodo: string;
  fecha: string;
  delivery: boolean;
}
