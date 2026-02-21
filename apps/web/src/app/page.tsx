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
import { FinancialSummary } from "@/components/ventas/recent-sales/FinancialSummary";
import { AddCierreModal } from "@/components/ventas/recent-sales/AddCierreModal";
import { AnimatePresence } from "motion/react";

// Constants
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import type { CartItem, Cierre, Product, Sale } from "@/lib/types";
import { RecentSales } from "@/components/ventas/RecentSales";

export default function VentasPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Rule 5.10: Use Lazy State Initialization
  const [sales, setSales] = useState<Sale[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sales");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const [cierres, setCierres] = useState<Cierre[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cierres");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const [showCierreModal, setShowCierreModal] = useState(false);

  const { tasa } = useTasaBCV();

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

  const updateSale = (updatedSale: Sale) => {
    setSales((prev) => {
      const newSales = prev.map((s) =>
        s.id === updatedSale.id ? updatedSale : s,
      );
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
        "¿Estás seguro de que deseas limpiar todo el historial de ventas y cierres?",
      )
    ) {
      setSales([]);
      setCierres([]);
      localStorage.removeItem("sales");
      localStorage.removeItem("cierres");
    }
  };

  const addCierre = (monto: number) => {
    const nuevoCierre: Cierre = {
      id: crypto.randomUUID(),
      monto,
      fecha: new Date().toISOString(),
    };
    setCierres((prev) => {
      const newCierres = [...prev, nuevoCierre];
      localStorage.setItem("cierres", JSON.stringify(newCierres));
      return newCierres;
    });
  };

  return (
    <div className="flex flex-col gap-2 2xl:gap-4 p-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl 2xl:text-4xl font-black text-zinc-800 tracking-tight">
          Panel de Ventas
        </h1>
        <h2 className="text-sm 2xl:text-lg text-zinc-400 font-bold uppercase tracking-widest tabular-nums">
          {fechaHoy}
        </h2>
      </header>
      <section className="flex flex-col gap-8 mt-4">
        {/* Sección: Tasa de Cambio y Control de Divisas */}
        <div className="w-full">
          <BCVCard />
        </div>

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

        {/* Sección: Resumen Financiero del Día (Ingresos y Cierres) */}
        <div className="w-full">
          <FinancialSummary
            sales={sales}
            cierres={cierres}
            onAddCierre={() => setShowCierreModal(true)}
          />
        </div>
      </section>

      <RecentSales
        sales={sales}
        cierres={cierres}
        onDeleteSale={deleteSale}
        onUpdateSale={updateSale}
        onClearAll={clearSales}
      />

      {/* Modal para agregar cierres */}
      <AnimatePresence>
        {showCierreModal && (
          <AddCierreModal
            onClose={() => setShowCierreModal(false)}
            onConfirm={addCierre}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
