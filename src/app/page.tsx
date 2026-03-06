"use client";

// Hooks
import { useState } from "react";
import { useTasaBCV } from "@/hooks/useTasaBCV";
import { usePosData } from "@/hooks/usePosData";
import { useSales } from "@/hooks/useSales";
import { useSession } from "@/context/SessionContext";
// Services
import { getVenezuelaTime, formatVenezuelaDate } from "@/services/FechaYHora";
// Components
import { BCVCard } from "@/components/ventas/BCVCard";
import {
  ProductSelector,
  ProductSelectorSkeleton,
} from "@/components/ventas/ProductSelector";
import { ActiveSale } from "@/components/ventas/active-sale/ActiveSale";
import { FinancialSummary } from "@/components/ventas/recent-sales/FinancialSummary";
import { AddCierreModal } from "@/components/ventas/recent-sales/AddCierreModal";
import { RecentSales } from "@/components/ventas/RecentSales";
// Icons
import { CakeSlice, Cake, CupSoda } from "lucide-react";
// Framer Motion
import { motion } from "motion/react";
// Animations
import { fadeUp, staggerContainer, slideInLeft } from "@/lib/animations";
// Types
import type { CartItem, Cierre, Product, Sale } from "@/lib/types";
import { LucideIcon } from "lucide-react";

export default function VentasPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cierres, setCierres] = useState<Cierre[]>([]);
  const [showCierreModal, setShowCierreModal] = useState(false);

  // Hook de sesión y ventas sincronizado
  const { currentSessionId } = useSession();
  const {
    recentSales,
    createSale,
    updateSale,
    deleteSale,
    archiveSales,
    deleteAllRecent,
  } = useSales(currentSessionId);

  const { productCategories, paymentMethods } = usePosData();
  const { tasa } = useTasaBCV();
  const fechaHoy = formatVenezuelaDate(getVenezuelaTime());

  const currentPaymentMethods = paymentMethods || [];

  // Mapeo de iconos
  const getCategoryIcon = (label: string): LucideIcon => {
    const icons: Record<string, LucideIcon> = {
      "Postres / Porciones": CakeSlice,
      "Tortas Completas": Cake,
      Bebidas: CupSoda,
    };
    return icons[label] || CakeSlice;
  };

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
      return [...prev, { ...product, id: String(product.id), quantity }];
    });
  };

  // --- FUNCIONES DE ACCIÓN ---

  // 1. Registrar Venta (Adaptada a la nueva estructura relacional)
  const handleRegisterSale = (saleData: Sale) => {
    if (!currentSessionId) {
      alert("No hay una sesión de caja activa.");
      return;
    }

    // Estructuramos el payload para el hook createSale
    createSale.mutate(
      {
        total_bs: saleData.totalBs || 0,
        total_usd: saleData.totalUsd || 0,
        tasa_bcv: tasa || 0,
        items: cart,
        payments: saleData.payments || [],
        delivery: saleData.delivery,
        delivery_name: saleData.delivery_name,
        delivery_amount: saleData.delivery_amount,
      },
      {
        onSuccess: () => {
          setCart([]);
        },
      },
    );
  };

  // 2. Actualizar Venta
  const handleUpdateSale = (updatedSale: Sale) => {
    const { id, ...updates } = updatedSale;
    updateSale.mutate({ id, updates });
  };

  // 3. Eliminar Venta
  const handleDeleteSale = (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta venta permanentemente?")) {
      deleteSale.mutate(id);
    }
  };

  // 4. Limpiar Todo (Borrado físico de la sesión actual)
  const handleClearAllRecent = () => {
    if (
      confirm(
        "⚠️ ¡ATENCIÓN! Esto eliminará permanentemente todas las ventas de esta sesión SIN guardarlas en el historial. ¿Continuar?",
      )
    ) {
      deleteAllRecent.mutate();
    }
  };

  // 5. Archivar Día (Historial / Cierre de turno)
  const handleArchiveDay = () => {
    if (
      confirm("¿Deseas cerrar el turno? Las ventas se moverán al historial.")
    ) {
      archiveSales.mutate();
    }
  };

  // --- GESTIÓN DE CIERRES (Temporalmente Local) ---
  const addCierre = (monto: number) => {
    const nuevoCierre: Cierre = {
      id: crypto.randomUUID(),
      monto,
      fecha: new Date().toISOString(),
    };
    setCierres((prev) => [...prev, nuevoCierre]);
  };

  const updateCierre = (updatedCierre: Cierre) => {
    setCierres((prev) =>
      prev.map((c) => (c.id === updatedCierre.id ? updatedCierre : c)),
    );
  };

  const deleteCierre = (id: string) => {
    setCierres((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <motion.div
      className="flex flex-col gap-2 w-full md:gap-4 md:max-w-7xl md:mx-auto p-2 md:p-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.header
        variants={slideInLeft}
        className="flex flex-col items-center md:items-start gap-1"
      >
        <h1 className="text-2xl font-bold text-primary-800 tracking-tight">
          Panel de Ventas
        </h1>
        <h2 className="text-sm md:text-base text-primary-300 font-bold uppercase">
          {fechaHoy}
        </h2>
      </motion.header>

      <section className="flex flex-col gap-4 md:gap-8 mt-4">
        <motion.div variants={fadeUp} className="w-full">
          <BCVCard />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {!productCategories
            ? Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  variants={fadeUp}
                  className="col-span-1"
                >
                  <ProductSelectorSkeleton />
                </motion.div>
              ))
            : productCategories.map((cat) => (
                <motion.div
                  key={cat.label}
                  variants={fadeUp}
                  className="col-span-1"
                >
                  <ProductSelector
                    title={cat.label}
                    icon={getCategoryIcon(cat.label)}
                    products={cat.options}
                    onAddToCart={addToCart}
                  />
                </motion.div>
              ))}
        </motion.div>

        {cart.length > 0 && (
          <ActiveSale
            items={cart}
            tasa={tasa || 0}
            paymentMethods={currentPaymentMethods}
            onRemoveItem={(id) =>
              setCart((prev) => prev.filter((item) => item.id !== id))
            }
            onRegister={handleRegisterSale}
            setCart={setCart}
          />
        )}

        <motion.div variants={fadeUp} className="w-full">
          <FinancialSummary
            sales={recentSales || []}
            cierres={cierres}
            onAddCierre={() => setShowCierreModal(true)}
            onUpdateCierre={updateCierre}
            onDeleteCierre={deleteCierre}
          />
        </motion.div>
      </section>

      <RecentSales
        sales={recentSales || []}
        cierres={cierres}
        paymentMethods={currentPaymentMethods}
        onDeleteSale={handleDeleteSale}
        onUpdateSale={handleUpdateSale}
        onClearAll={handleClearAllRecent}
        onArchiveDay={handleArchiveDay}
      />

      <AddCierreModal
        isOpen={showCierreModal}
        onClose={() => setShowCierreModal(false)}
        onConfirm={addCierre}
      />
    </motion.div>
  );
}
