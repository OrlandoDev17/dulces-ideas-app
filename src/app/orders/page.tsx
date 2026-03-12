"use client";

// Services
import { getVenezuelaTime, formatVenezuelaDate } from "@/services/FechaYHora";
// Framer Motion
import { motion } from "motion/react";
// Animations
import { staggerContainer, slideInLeft } from "@/lib/animations";
// Icons
import { Cake, Cookie, IceCream, Plus, HelpCircle } from "lucide-react";
import { Button } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";

export default function OrdersPage() {
  const fechaHoy = formatVenezuelaDate(getVenezuelaTime());

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

        <Button style="primary">
          Nuevo encargo
          <Cake />
        </Button>
      </motion.header>

      <section className="flex-1 flex flex-col items-center justify-center -mt-12">
        <EmptyState
          title="No hay encargos registrados todavía"
          description="Tu agenda de pedidos está lista para llenarse de dulces momentos. Comienza gestionando tu primer encargo personalizado hoy mismo."
          subIcons={[Cake, Cookie, IceCream]}
          primaryAction={{
            label: "Agregar Primer Encargo",
            icon: Plus,
            onClick: () => console.log("Nuevo encargo"),
          }}
          secondaryAction={{
            label: "Ver Guía de Uso",
            icon: HelpCircle,
            onClick: () => console.log("Ver guía"),
          }}
        />
      </section>
    </motion.div>
  );
}
