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
// Icons
import { Cake, Loader2 } from "lucide-react";
import { Button } from "@/components/common/Button";
import { EmptyOrders } from "@/components/orders/EmptyOrders";
import { AddOrderModal } from "@/components/orders/AddOrderModal";
import { OrderCard } from "@/components/orders/OrderCard";

export default function OrdersPage() {
  const [isOpen, setIsOpen] = useState(false);
  const { activeSessionId } = useSessions();
  const { activeOrders, deleteOrder, completeOrderPayment } =
    useOrders(activeSessionId);
  const { tasa } = useTasaBCV();

  const fechaHoy = formatVenezuelaDate(getVenezuelaTime());

  const handleOpenModal = () => {
    setIsOpen(!isOpen);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas cancelar este encargo?")) {
      await deleteOrder.mutateAsync(id);
    }
  };

  const handleCompletePayment = async (id: string) => {
    // Aquí podrías abrir un modal de pago, por ahora simplificamos
    // o enviamos a una lógica de pago pendiente
    console.log("Complete payment for:", id);
  };

  const handleDeliver = async (id: string) => {
    await completeOrderPayment.mutateAsync({
      orderId: id,
      payments: [], // Si ya está pagado, no enviamos más pagos
      status: "delivered",
    });
  };

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {activeOrders.map((order: any) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onDelete={handleDelete}
                  onCompletePayment={handleCompletePayment}
                  onDeliver={handleDeliver}
                  tasa={tasa}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      <AddOrderModal isOpen={isOpen} onClose={handleOpenModal} />
    </motion.div>
  );
}
