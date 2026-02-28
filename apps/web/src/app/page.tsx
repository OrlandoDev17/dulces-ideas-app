"use client";

// Contexts
import { useProducts } from "@/contexts/ProductsContext";
import { useSalesContext } from "@/contexts/SalesContext";
import { useSession } from "@/contexts/SessionContext";
// Hooks
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { useState, useEffect } from "react";
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
// Icons
import { CakeSlice, Cake, CupSoda } from "lucide-react";
// Types
import type { CartItem, Cierre, Product, Sale } from "@/lib/types";
import { LucideIcon } from "lucide-react";

export default function VentasPage() {
  // Estado del carrito
  const [cart, setCart] = useState<CartItem[]>([]);

  // Contextos conectados al backend
  const { currentSession } = useSession();
  const { sales, fetchRecentSales, registerSale } = useSalesContext();

  const [cierres, setCierres] = useState<Cierre[]>([]);

  // Estado de productos y metodos de pago
  const { categories, loading: loadingProducts, fetchProducts } = useProducts();
  const { paymentMethods, fetchPaymentMethods } = usePaymentMethods();

  useEffect(() => {
    fetchProducts();
    fetchPaymentMethods();
  }, [fetchProducts, fetchPaymentMethods]);

  useEffect(() => {
    if (currentSession?.id) {
      fetchRecentSales(currentSession.id);
    }
  }, [currentSession, fetchRecentSales]);

  const [showCierreModal, setShowCierreModal] = useState(false);

  const { tasa } = useTasaBCV();

  const fechaHoy = formatVenezuelaDate(getVenezuelaTime());

  // Mapeo de iconos para las categorías dinámicas
  const getCategoryIcon = (label: string): LucideIcon => {
    const icons: Record<string, LucideIcon> = {
      "Postres / Porciones": CakeSlice,
      "Tortas Completas": Cake,
      Bebidas: CupSoda,
    };
    return icons[label] || CakeSlice;
  };

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

  // Funcion para registrar ventas (Conectado al backend)
  const handleRegisterSale = async (sale: Sale) => {
    if (!currentSession?.id) {
      alert(
        "⚠️ Debes abrir una caja (sesión) en el panel de Admin para registrar ventas.",
      );
      return;
    }
    const success = await registerSale(sale, currentSession.id);
    if (!success) {
      alert("❌ Error al registrar la venta. Por favor, intenta de nuevo.");
    }
  };

  // Funcion para actualizar ventas (Requiere endpoint en backend)
  const updateSale = (updatedSale: Sale) => {
    console.warn(
      "Update sale not yet implemented in backend context",
      updatedSale,
    );
  };

  // Funcion para eliminar ventas (Requiere endpoint en backend)
  const deleteSale = (id: string) => {
    console.warn("Delete sale not yet implemented in backend context", id);
  };

  // Funcion para limpiar todo el historial de ventas y cierres
  const clearSales = () => {
    if (
      confirm(
        "¿Estás seguro de que deseas limpiar todo el historial de ventas y cierres?",
      )
    ) {
      setCierres([]);
      localStorage.removeItem("cierres");
      alert(
        "Cierres limpiados localmente. El historial de ventas está en la base de datos.",
      );
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

        {/* Lista de categorias de productos desglosada dinámicamente */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loadingProducts ? (
            <div className="col-span-full flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            categories.map((cat) => (
              <div key={cat.label} className="col-span-1">
                <ProductSelector
                  title={cat.label}
                  icon={getCategoryIcon(cat.label)}
                  products={cat.options}
                  onAddToCart={addToCart}
                />
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <ActiveSale
            items={cart}
            tasa={tasa || 0}
            paymentMethods={paymentMethods}
            onRemoveItem={(id) =>
              setCart((prev) => prev.filter((item) => item.id !== id))
            }
            onRegister={handleRegisterSale}
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
