"use client";

//Hooks
import { useState } from "react";
import { useTasaBCV } from "@/hooks/useTasaBCV";
// Services
import { getVenezuelaTime, formatVenezuelaDate } from "@/services/FechaYHora";
// Components
import { BCVCard } from "@/components/ventas/BCVCard";
import { ProductSelector } from "@/components/ventas/ProductSelector";
import { ActiveSale } from "@/components/ventas/ActiveSale";
// Constants
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { CartItem, Product } from "@/lib/types";

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const { ultimaActualizacion, tasa } = useTasaBCV();

  const fechaHoy = formatVenezuelaDate(getVenezuelaTime());

  const addToCart = (product: Product, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.name === product.name);
      if (existing) {
        return prev.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { ...product, id: crypto.randomUUID(), quantity }];
    });
  };
  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Panel de Ventas</h1>
        <h4>{fechaHoy}</h4>
      </header>
      <section className="flex flex-col gap-6 mt-4">
        <header className="flex justify-between items-center">
          <BCVCard />
          <span className="text-green-500">
            Actualizado: {ultimaActualizacion || "Cargando..."}
          </span>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRODUCT_CATEGORIES.map((cat) => (
            <ProductSelector
              key={cat.id}
              title={cat.title}
              icon={cat.icon}
              products={cat.products}
              onAddToCart={addToCart}
            />
          ))}
        </div>
        {cart.length > 0 && (
          <ActiveSale
            items={cart}
            tasa={tasa || 0}
            onRemoveItem={(id) =>
              setCart((prev) => prev.filter((item) => item.id !== id))
            }
            onRegister={() => {}}
          />
        )}
      </section>
    </div>
  );
}
