/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

/* ========================================
   Imports
======================================== */
import { useState } from "react";
import { useOrders } from "@/hooks/api/useOrders";
import { useTasaBCV } from "@/hooks/ui/useTasaBCV";
import { useSessions } from "@/hooks/api/useSessions";
import { useStore } from "@/context/StoreContext";
import { usePosData } from "@/hooks/api/usePosData";
import { getVenezuelaTime, formatVenezuelaDate } from "@/services/FechaYHora";
import { motion, AnimatePresence } from "motion/react";
import { staggerContainer, slideInLeft } from "@/lib/animations";
import { Cake, Loader2, PackageCheck } from "lucide-react";
import { Button } from "@/components/common/Button";
import { EmptyOrders } from "@/components/orders/EmptyOrders";
import { AddOrderModal } from "@/components/orders/AddOrderModal";
import { OrderCard } from "@/components/orders/OrderCard";
import { OrderCalendar } from "@/components/orders/OrderCalendar";
import { MixedPaymentModal } from "@/components/pos/MixedPaymentModal";
import { ConfirmActionModal } from "@/components/common/ConfirmActionModal";

/* ========================================
   Constantes
======================================== */
const STATUS_TABS = [
  { value: "pending", label: "Pendientes" },
  { value: "paid", label: "Pagadas" },
  { value: "delivered", label: "Entregadas" },
];

/* ========================================
   Componente Principal
======================================== */
export default function OrdersPage() {
  /* ---- Estado ---- */
  const [isOpen, setIsOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("pending");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDeliverModalOpen, setIsDeliverModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  /* ---- Hooks ---- */
  const { activeStore } = useStore();
  const { activeSessionId } = useSessions();
  const { tasa } = useTasaBCV();
  const { paymentMethods } = usePosData();
  const storeId = activeStore?.id || null;
  const sessionId = activeSessionId;
  const { activeOrders, deleteOrder, completeOrderPayment, deliverOrder } =
    useOrders(sessionId, storeId);

  const fechaHoy = formatVenezuelaDate(getVenezuelaTime());

  /* ---- Handlers ---- */
  const handleOpenModal = () => setIsOpen(!isOpen);

  const handleDeleteClick = (id: string) => {
    setOrderToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (orderToDelete) {
      await deleteOrder.mutateAsync(orderToDelete);
      setIsDeleteModalOpen(false);
      setOrderToDelete(null);
    }
  };

  const handleCompletePayment = (order: any) => {
    setSelectedOrder(order);
    setIsPaymentModalOpen(true);
  };

  const handleDeliver = (order: any) => {
    setSelectedOrder(order);
    setIsDeliverModalOpen(true);
  };

  const onConfirmPayment = async (payments: any[]) => {
    try {
      await completeOrderPayment.mutateAsync({
        orderId: selectedOrder.id,
        payments: payments.map((p) => ({
          methodId: p.methodId,
          amountBs: p.amountBs,
          amountRef: p.amountRef,
          currency: p.currency,
        })),
        tasa,
      });
      setIsPaymentModalOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error al registrar el pago", error);
    }
  };

  const onConfirmDeliver = async () => {
    try {
      await deliverOrder.mutateAsync(selectedOrder.id);
      setIsDeliverModalOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error al entregar el pedido", error);
    }
  };

  const calculateRemainingBs = (order: any) => {
    if (!order) return 0;
    const paidUsd =
      order.order_payments?.reduce(
        (acc: number, p: any) =>
          acc +
          (p.currency?.toLowerCase() === "usd"
            ? p.amount_ref
            : p.amount_bs / tasa),
        0,
      ) || 0;
    const totalUsd = order.total_amount_usd;
    const remainingUsd = Math.max(0, totalUsd - paidUsd);
    return remainingUsd * tasa;
  };

  /* ---- Filtros ---- */
  const filteredOrders = (activeOrders || [])
    .filter((o: any) => {
      if (filterStatus === "pending") {
        return o.status === "pending" || o.status === "paid";
      }
      return o.status === filterStatus;
    })
    .sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  /* ========================================
     Render
  ========================================= */
  return (
    <motion.main
      className="flex flex-col gap-4 w-full md:max-w-[1400px] md:mx-auto p-2 md:p-6 min-h-[90vh]"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* ---- Header ---- */}
      <header className="flex flex-row items-center justify-between gap-1">
        <div className="flex flex-col items-start gap-1">
          <h1 className="text-2xl font-bold text-primary-800 tracking-tight">
            Panel de Encargos
          </h1>
          <p className="text-sm md:text-base text-primary-300 font-bold uppercase">
            {fechaHoy}
          </p>
        </div>

        <Button style="primary" onClick={handleOpenModal}>
          Nuevo encargo
          <Cake />
        </Button>
      </header>

      {/* ---- Contenido Principal ---- */}
      {!activeOrders ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary-500" size={40} />
        </div>
      ) : activeOrders.length === 0 ? (
        <section className="flex flex-col items-center justify-center py-20">
          <EmptyOrders onClick={handleOpenModal} />
        </section>
      ) : (
        <section className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* ---- Panel Izquierdo: Filtros + Cards ---- */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Filtros de estado */}

            <div className="flex flex-wrap items-center gap-2">
              {STATUS_TABS.map((tab) => {
                const isSelected = filterStatus === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setFilterStatus(tab.value)}
                    className={`
                        px-4 py-2 rounded-xl text-sm font-bold transition-all
                        ${
                          isSelected
                            ? "bg-primary-500 text-white shadow-md shadow-primary-500/30"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                        }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Lista de Encargos */}
            <AnimatePresence mode="popLayout">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order: any) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onDelete={handleDeleteClick}
                    onCompletePayment={() => handleCompletePayment(order)}
                    onDeliver={() => handleDeliver(order)}
                    tasa={tasa}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-20 text-center bg-white rounded-2xl border border-zinc-200/80"
                >
                  <p className="text-zinc-400 font-bold italic">
                    No hay encargos con estos filtros.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ---- Panel Derecho: Calendario ---- */}
          <aside className="lg:w-72 shrink-0">
            <motion.div variants={slideInLeft} className="sticky top-6">
              <OrderCalendar orders={activeOrders} />
            </motion.div>
          </aside>
        </section>
      )}

      {/* ========================================
         Modales
      ========================================= */}
      <AddOrderModal isOpen={isOpen} onClose={handleOpenModal} />

      {selectedOrder && (
        <MixedPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          totalToPayBs={calculateRemainingBs(selectedOrder)}
          tasa={tasa}
          paymentMethods={paymentMethods || []}
          onConfirm={onConfirmPayment}
        />
      )}

      <ConfirmActionModal
        isOpen={isDeliverModalOpen}
        onClose={() => setIsDeliverModalOpen(false)}
        onConfirm={onConfirmDeliver}
        title="Confirmar Entrega"
        message={`¿Estás seguro de marcar el pedido de ${selectedOrder?.customer_name} como ENTREGADO?`}
        confirmText="Sí, Entregar"
        type="success"
        icon={<PackageCheck size={32} />}
        isPending={deliverOrder.isPending}
      />

      <ConfirmActionModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setOrderToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Cancelar Encargo"
        message="¿Estás seguro de que deseas cancelar este encargo? Esta acción no se puede deshacer."
        confirmText="Sí, Cancelar"
        type="warning"
        isPending={deleteOrder.isPending}
      />
    </motion.main>
  );
}
