"use client";

// Services
import { getVenezuelaTime, formatVenezuelaDate } from "@/services/FechaYHora";
// Framer Motion
import { motion } from "motion/react";
// Animations
import { staggerContainer, slideInLeft, fadeUp } from "@/lib/animations";
// Icons
import { PlusCircle, ClipboardList, Cake } from "lucide-react";
import { Button } from "@/components/common/Button";

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

        <Button style="dashed">
          Nuevo encargo
          <Cake />
        </Button>
      </motion.header>

      <motion.div
        variants={fadeUp}
        className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 bg-white/40 hover:bg-white/60 backdrop-blur-md rounded-3xl border-2 border-dashed border-primary-300 hover:border-primary-500 transition-all cursor-pointer group shadow-sm hover:shadow-md"
      >
        <div className="size-20 bg-primary-50/50 group-hover:bg-primary-100 rounded-full flex items-center justify-center transition-colors duration-300">
          <ClipboardList className="size-10 text-primary-400 group-hover:text-primary-600 transition-colors duration-300" />
        </div>
        <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2 md:mb-3 tracking-tight group-hover:text-primary-800 transition-colors duration-300">
          Sin encargos registrados
        </h3>
        <p className="text-slate-500 text-center max-w-sm text-lg leading-relaxed group-hover:text-slate-600 transition-colors duration-300">
          Aún no hay encargos en progreso. Haz clic aquí o en &quot;Nuevo
          Encargo&quot; para registrar el primero.
        </p>
      </motion.div>
    </motion.div>
  );
}
