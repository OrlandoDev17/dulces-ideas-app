/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// Hooks
import { useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { useTasaBCV } from "@/hooks/useTasaBCV";
import { useSessions } from "@/hooks/useSessions";
// Services
import { getVenezuelaTime, formatVenezuelaDate } from "@/services/FechaYHora";
// Framer Motion
import { motion, AnimatePresence } from "motion/react";
// Animations
import { staggerContainer, slideInLeft } from "@/lib/animations";
import { Cake, Loader2, Clock, Wallet, PackageCheck } from "lucide-react";
import { Button } from "@/components/common/Button";
import { EmptyOrders } from "@/components/orders/EmptyOrders";
import { AddOrderModal } from "@/components/orders/AddOrderModal";
import { OrderCard } from "@/components/orders/OrderCard";
import { MixedPaymentModal } from "@/components/ventas/MixedPaymentModal";
import { ConfirmActionModal } from "@/components/common/ConfirmActionModal";
import { usePosData } from "@/hooks/usePosData";

export default function OrdersPage() {
  const [isOpen, setIsOpen] = useState(false);
  const { activeSessionId } = useSessions();
  const { activeOrders, deleteOrder, completeOrderPayment, deliverOrder } =
    useOrders(activeSessionId);
  const { tasa } = useTasaBCV();
  const { paymentMethods } = usePosData();
  const [filterStatus, setFilterStatus] = useState<
    "pending" | "paid" | "delivered"
  >("pending");

  // Estados para Modales
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDeliverModalOpen, setIsDeliverModalOpen] = useState(false);

  const fechaHoy = formatVenezuelaDate(getVenezuelaTime());

  const handleOpenModal = () => {
    setIsOpen(!isOpen);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas cancelar este encargo?")) {
      await deleteOrder.mutateAsync(id);
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
        payments: payments.map(p => ({
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
    const paidUsd = order.order_payments?.reduce(
      (acc: number, p: any) =>
        acc + (p.currency?.toLowerCase() === "usd" ? p.amount_ref : p.amount_bs / tasa),
      0,
    ) || 0;
    const totalUsd = order.total_amount_usd;
    const remainingUsd = Math.max(0, totalUsd - paidUsd);
    return remainingUsd * tasa;
  };

  const filteredOrders =
    activeOrders?.filter((o: any) => o.status === filterStatus) || [];

  const statuses = [
    { id: "pending", label: "Pendientes", icon: <Clock size={16} /> },
    { id: "paid", label: "Pagados", icon: <Wallet size={16} /> },
    { id: "delivered", label: "Entregados", icon: <PackageCheck size={16} /> },
  ];

  return (
    <motion.div
      className="flex flex-col gap-2 w-full md:gap-4 md:max-w-7xl md:mx-auto p-2 md:p-6 min-h-[90vh]"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.header
        variants={slideInLeft}
        className="flex flex-row items-center justify-between gap-1 mb-2 md:mb-6"
      >
        <div className="flex flex-col items-start gap-1">
          <h1 className="text-2xl font-bold text-primary-800 tracking-tight">
            Panel de Encargos
          </h1>
          <h2 className="text-sm md:text-base text-primary-300 font-bold uppercase">
            {fechaHoy}
          </h2>
        </div>

        <Button style="primary" onClick={handleOpenModal}>
          Nuevo encargo
          <Cake />
        </Button>
      </motion.header>

      <section className="flex-1 w-full">
        {!activeOrders ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary-500" size={40} />
          </div>
        ) : activeOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <EmptyOrders onClick={handleOpenModal} />
          </div>
        ) : (
          <section className="flex flex-col gap-8">
            <header className="flex bg-zinc-100/80 backdrop-blur-md p-2 rounded-[24px] w-fit border border-zinc-200/50 gap-2 relative shadow-inner">
              {statuses.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setFilterStatus(s.id as any)}
                  className={`relative px-8 py-3.5 text-sm font-black transition-all duration-300 rounded-[18px] z-10 flex items-center gap-2.5 ${
                    filterStatus === s.id
                      ? "text-primary-800 scale-105"
                      : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200/50"
                  }`}
                >
                  <span
                    className={`${filterStatus === s.id ? "text-primary-500" : "text-zinc-300"}`}
                  >
                    {s.icon}
                  </span>
                  {s.label}
                  {filterStatus === s.id && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-white rounded-[18px] shadow-[0_4px_12px_rgba(0,0,0,0,05)] border border-zinc-200/50 -z-10"
                      transition={{
                        type: "spring",
                        bounce: 0.15,
                        duration: 0.5,
                      }}
                    />
                  )}
                </button>
              ))}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order: any) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onDelete={handleDelete}
                      onCompletePayment={() => handleCompletePayment(order)}
                      onDeliver={() => handleDeliver(order)}
                      tasa={tasa}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="col-span-full py-20 text-center"
                  >
                    <p className="text-zinc-400 font-bold italic">
                      No hay encargos en este estado.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        )}
      </section>

      <AddOrderModal isOpen={isOpen} onClose={handleOpenModal} />

      {/* Modal de Pago Mixto */}
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

      {/* Modal de Confirmación de Entrega */}
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
    </motion.div>
  );
}
