"use client";

// Hooks
import { useState } from "react";
// Services
import { getVenezuelaTime, formatVenezuelaDate } from "@/services/FechaYHora";
// Framer Motion
import { motion } from "motion/react";
// Animations
import { staggerContainer, slideInLeft } from "@/lib/animations";
// Icons
import { Cake } from "lucide-react";
import { Button } from "@/components/common/Button";
import { EmptyOrders } from "@/components/orders/EmptyOrders";
import { AddOrderModal } from "@/components/orders/AddOrderModal";

export default function OrdersPage() {
  const [isOpen, setIsOpen] = useState(false);

  const fechaHoy = formatVenezuelaDate(getVenezuelaTime());

  const handleOpenModal = () => {
    setIsOpen(!isOpen);
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

      <section className="flex-1 flex flex-col items-center justify-center -mt-12">
        <EmptyOrders onClick={handleOpenModal} />
      </section>

      <AddOrderModal isOpen={isOpen} onClose={handleOpenModal} />
    </motion.div>
  );
}
