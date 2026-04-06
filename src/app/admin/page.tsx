/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "motion/react";
import {
  fadeUp,
  slideInLeft,
  slideInRight,
  staggerContainer,
} from "@/lib/animations";
import { formatVenezuelaDate, getVenezuelaTime } from "@/services/FechaYHora";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Loader2 } from "lucide-react";
import { BentoGrid } from "@/components/admin/BentoGrid";
import { useAnalytics } from "@/hooks/api/useAnalytics";

export default function AdminPage() {
  const [selectedOption, setSelectedOption] = useState<{
    label: string;
    value: "7d" | "30d";
  }>({
    label: "Últimos 7 días",
    value: "7d",
  });

  const OPTIONS = [
    {
      label: "Últimos 7 días",
      value: "7d",
    },
    {
      label: "Últimos 30 días",
      value: "30d",
    },
  ];

  const handleSelectedOption = (option: {
    label: string;
    value: "7d" | "30d";
  }) => {
    setSelectedOption(option);
  };

  const {
    chartData,
    totals,
    totalsByCurrency,
    percentageChange,
    isLoading,
    topProducts,
  } = useAnalytics(selectedOption.value);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-2 w-full md:gap-4 md:max-w-7xl md:mx-auto p-2 md:p-6"
    >
      <motion.header className="flex items-center justify-between">
        <motion.div
          variants={slideInLeft}
          className="flex flex-col items-center md:items-start gap-1"
        >
          <h1 className="text-2xl font-bold text-primary-800 tracking-tight">
            Panel de Reportes
          </h1>
          <h2 className="text-sm md:text-base text-primary-300 font-bold uppercase">
            {formatVenezuelaDate(getVenezuelaTime())}
          </h2>
        </motion.div>
        <motion.div variants={slideInRight}>
          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-6"
          >
            {OPTIONS.map((opt, index) => (
              <motion.li key={index} variants={fadeUp}>
                <button
                  onClick={() => handleSelectedOption(opt as any)}
                  className={`relative font-semibold text-lg transition-all duration-300 cursor-pointer ${selectedOption.value === opt.value ? "text-primary-600" : "text-dark/70 hover:text-primary-600 hover:-translate-y-1"}`}
                >
                  {opt.label}
                  {selectedOption.value === opt.value && (
                    <motion.span
                      layoutId="selectedOption"
                      transition={{ duration: 0.3 }}
                      className={`absolute -bottom-1 left-0 w-full h-1 rounded-lg bg-primary-600/60`}
                    />
                  )}
                </button>
              </motion.li>
            ))}
            <motion.li variants={fadeUp}>
              <Button style="primary" onClick={() => {}} className="rounded-lg">
                Exportar PDF
              </Button>
            </motion.li>
          </motion.ul>
        </motion.div>
      </motion.header>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin" size={40} />
        </div>
      ) : (
        <BentoGrid
          chartData={chartData}
          totals={totals}
          totalsByCurrency={totalsByCurrency}
          selectedOption={selectedOption}
          percentageChange={percentageChange}
          topProducts={topProducts}
        />
      )}
    </motion.div>
  );
}
