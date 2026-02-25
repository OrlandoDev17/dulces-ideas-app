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
import { RecentSales } from "@/components/ventas/RecentSales";
// Constants
import { PRODUCT_CATEGORIES } from "@/lib/constants";
// Types
import type { CartItem, Cierre, Product, Sale } from "@/lib/types";

export default function VentasPage() {
  // Estado del carrito
  const [cart, setCart] = useState<CartItem[]>([]);

  // Rule 5.10: Usar inicialización perezosa para el estado de ventas
  const [sales, setSales] = useState<Sale[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sales");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  // Rule 5.10: Usar inicialización perezosa para el estado de cierres
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

  // Funcion para añadir productos al carrito
  const addToCart = (product: Product, quantity: number) => {
    setCart((prev) => {
      // Si existe el producto en el carrito, aumentar la cantidad
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

  // Funcion para registrar ventas
  const registerSale = (sale: Sale) => {
    setSales((prev) => {
      const newSales = [...prev, sale];
      localStorage.setItem("sales", JSON.stringify(newSales));
      return newSales;
    });
  };

  // Funcion para actualizar ventas
  const updateSale = (updatedSale: Sale) => {
    setSales((prev) => {
      const newSales = prev.map((s) =>
        s.id === updatedSale.id ? updatedSale : s,
      );
      localStorage.setItem("sales", JSON.stringify(newSales));
      return newSales;
    });
  };

  // Funcion para eliminar ventas
  const deleteSale = (id: string) => {
    setSales((prev) => {
      const newSales = prev.filter((s) => s.id !== id);
      localStorage.setItem("sales", JSON.stringify(newSales));
      return newSales;
    });
  };

  // Funcion para limpiar todo el historial de ventas y cierres
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

  // Funcion para agregar cierres
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

  // Funcion para actualizar cierres
  const updateCierre = (updatedCierre: Cierre) => {
    setCierres((prev) => {
      const newCierres = prev.map((c) =>
        c.id === updatedCierre.id ? updatedCierre : c,
      );
      localStorage.setItem("cierres", JSON.stringify(newCierres));
      return newCierres;
    });
  };

  // Funcion para eliminar cierres
  const deleteCierre = (id: string) => {
    setCierres((prev) => {
      const newCierres = prev.filter((c) => c.id !== id);
      localStorage.setItem("cierres", JSON.stringify(newCierres));
      return newCierres;
    });
  };

  return (
    <div className="flex flex-col gap-2 w-full md:gap-4 md:max-w-7xl md:mx-auto p-2 md:p-6">
      <header className="flex flex-col items-center md:items-start gap-1">
        <h1 className="text-2xl font-bold text-primary-800 tracking-tight">
          Panel de Ventas
        </h1>
        <h2 className="text-sm md:text-base text-primary-300 font-bold uppercase">
          {fechaHoy}
        </h2>
      </header>
      <section className="flex flex-col gap-4 md:gap-8 mt-4">
        {/* Sección: Tasa de Cambio y Control de Divisas */}
        <div className="w-full">
          <BCVCard />
        </div>

        {/* Lista de categorias de productos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRODUCT_CATEGORIES.map((cat) => (
            <div key={cat.id} className="col-span-1">
              <ProductSelector
                title={cat.title}
                icon={cat.icon}
                products={cat.products}
                onAddToCart={addToCart}
              />
            </div>
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
            onUpdateCierre={updateCierre}
            onDeleteCierre={deleteCierre}
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
      <AddCierreModal
        isOpen={showCierreModal}
        onClose={() => setShowCierreModal(false)}
        onConfirm={addCierre}
      />
    </div>
  );
}
