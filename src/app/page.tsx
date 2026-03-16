"use client";

// Hooks
import { useMemo, useState } from "react";
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
import { ArchiveDayModal } from "@/components/ventas/recent-sales/ArchiveDayModal";
import { ConfirmDeleteModal } from "@/components/common/ConfirmDeleteModal";
import { SuccessModal } from "@/components/common/SuccessModal";
import { RecentSales } from "@/components/ventas/RecentSales";
// Icons
import { CakeSlice, Cake, CupSoda } from "lucide-react";
// Framer Motion
import { motion } from "motion/react";
// Animations
import { fadeUp, staggerContainer, slideInLeft } from "@/lib/animations";
// Types
import { CartItem, Cierre, Payment, Product, Sale } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export default function VentasPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cierres, setCierres] = useState<Cierre[]>([]);
  const [showCierreModal, setShowCierreModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

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

    // Feedback inmediato (Optimístico)
    setCart([]);
    setShowSuccessModal(true);

    // Estructuramos el payload para el hook createSale
    createSale.mutate({
      total_bs: saleData.totalBs || 0,
      total_usd: saleData.totalUsd || 0,
      tasa_bcv: tasa || 0,
      items: cart,
      payments: saleData.payments || [],
      delivery: saleData.delivery,
      delivery_name: saleData.delivery_name,
      delivery_amount: saleData.delivery_amount,
    });
  };

  // 2. Actualizar Venta
  const handleUpdateSale = (updatedSale: Sale, usdPaymentRef?: number) => {
    const { id, ...updates } = updatedSale;
    updateSale.mutate({ id, updates, usdPaymentRef });
  };

  // 3. Eliminar Venta
  const handleDeleteSale = (id: string) => {
    setPendingDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteSale = () => {
    if (pendingDeleteId) {
      deleteSale.mutate(pendingDeleteId, {
        onSuccess: () => {
          setShowDeleteModal(false);
          setPendingDeleteId(null);
        },
      });
    }
  };

  // 4. Limpiar Todo (Borrado físico de la sesión actual)
  const handleClearAllRecent = () => {
    setShowClearAllModal(true);
  };

  const confirmClearAll = () => {
    deleteAllRecent.mutate(undefined, {
      onSuccess: () => {
        setShowClearAllModal(false);
      },
    });
  };

  // 5. Archivar Día (Historial / Cierre de turno)
  const handleArchiveDay = () => {
    setShowArchiveModal(true);
  };

  const confirmArchiveDay = () => {
    archiveSales.mutate(undefined, {
      onSuccess: () => {
        setShowArchiveModal(false);
      },
    });
  };

  const cierreResumen = useMemo(() => {
    if (!recentSales) return { totalBs: 0, totalUsd: 0, count: 0 };

    return (recentSales as Sale[]).reduce(
      (acc, sale: Sale) => {
        const payments: Payment[] = sale.sale_payments || sale.payments || [];

        const saleTotals = payments.reduce<{ bs: number; usd: number }>(
          (pAcc, p: Payment) => {
            const methodId = p.method_id || p.methodId;
            const amountBs = p.amount_bs || p.amountBs || 0;
            const amountUsd = p.amount_ref || p.amountRef || 0;

            if (
              methodId === "pm" ||
              methodId === "bs" ||
              methodId === "ves" ||
              methodId === "pv" ||
              methodId === "punto"
            ) {
              return { ...pAcc, bs: pAcc.bs + amountBs };
            }
            if (methodId === "usd" || methodId === "divisas") {
              return { ...pAcc, usd: pAcc.usd + amountUsd };
            }
            return pAcc;
          },
          { bs: 0, usd: 0 },
        );

        return {
          totalBs: acc.totalBs + saleTotals.bs,
          totalUsd: acc.totalUsd + saleTotals.usd,
          count: acc.count + 1,
        };
      },
      { totalBs: 0, totalUsd: 0, count: 0 },
    );
  }, [recentSales]);

  // --- GESTIÓN DE CIERRES (Temporalmente Local) ---
  const addCierre = (monto: number) => {
    const nuevoCierre: Cierre = {
      id: generateId(),
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

      <ArchiveDayModal
        isOpen={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
        onConfirm={confirmArchiveDay}
        summary={cierreResumen}
        sales={recentSales || []}
        isPending={archiveSales.isPending}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setPendingDeleteId(null);
        }}
        onConfirm={confirmDeleteSale}
        title="¿Eliminar Venta?"
        message="Esta acción es permanente y no se podrá recuperar la información de esta venta."
        isPending={deleteSale.isPending}
      />

      <ConfirmDeleteModal
        isOpen={showClearAllModal}
        onClose={() => setShowClearAllModal(false)}
        onConfirm={confirmClearAll}
        title="¿Limpiar Todo?"
        message="⚠️ ¡ATENCIÓN! Esto eliminará permanentemente TODAS las ventas de esta sesión sin guardarlas en el historial."
        isPending={deleteAllRecent.isPending}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="¡Venta Exitosa!"
        message="La venta se ha registrado correctamente en la base de datos."
      />
    </motion.div>
  );
}
