/* eslint-disable react-hooks/set-state-in-effect */
"use client";

//Hooks
import { useEffect, useState } from "react";
import { useTasaBCV } from "@/hooks/useTasaBCV";
// Services
import { getVenezuelaTime, formatVenezuelaDate } from "@/services/FechaYHora";
// Components
import { BCVCard } from "@/components/ventas/BCVCard";
import { ProductSelector } from "@/components/ventas/ProductSelector";
import { ActiveSale } from "@/components/ventas/ActiveSale";
// Constants
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { CartItem, Product, Sale } from "@/lib/types";
import { RecentSales } from "@/components/ventas/RecentSales";

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    // Actualizar y guardar ventas en localStorage
    const storedSales = localStorage.getItem("sales");
    if (storedSales) {
      setSales(JSON.parse(storedSales));
    }
  }, []);

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

  const registerSale = (sale: Sale) => {
    setSales((prev) => {
      const newSales = [...prev, sale];
      localStorage.setItem("sales", JSON.stringify(newSales));
      return newSales;
    });
  };

  const deleteSale = (id: string) => {
    setSales((prev) => {
      const newSales = prev.filter((s) => s.id !== id);
      localStorage.setItem("sales", JSON.stringify(newSales));
      return newSales;
    });
  };

  const clearSales = () => {
    if (
      confirm(
        "¿Estás seguro de que deseas limpiar todo el historial de ventas?",
      )
    ) {
      setSales([]);
      localStorage.removeItem("sales");
    }
  };

  return (
    <div className="flex flex-col gap-2 2xl:gap-4 p-4 md:p-8 max-w-(--breakpoint-2xl) mx-auto w-full">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl 2xl:text-3xl font-bold text-zinc-800">
          Panel de Ventas
        </h1>
        <h4 className="text-sm 2xl:text-base text-zinc-500 font-medium">
          {fechaHoy}
        </h4>
      </header>
      <section className="flex flex-col gap-6 mt-4">
        <header className="flex justify-between items-center bg-white/50 p-4 rounded-2xl border border-zinc-100 backdrop-blur-sm">
          <BCVCard />
          <div className="flex flex-col items-end">
            <span className="text-xs font-black uppercase text-zinc-400 tracking-tighter">
              Última Tasa
            </span>
            <span className="text-sm 2xl:text-base text-green-600 font-bold">
              {ultimaActualizacion || "Cargando..."}
            </span>
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            onRegister={registerSale}
            setCart={setCart}
          />
        )}
      </section>
      <RecentSales
        sales={sales}
        onDeleteSale={deleteSale}
        onClearAll={clearSales}
      />
    </div>
  );
}
