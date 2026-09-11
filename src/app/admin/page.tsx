"use client";

import { motion } from "motion/react";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { formatVenezuelaDate, getVenezuelaTime } from "@/services/FechaYHora";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { RevenueSummary } from "@/components/admin/RevenueSummary";
import { ProductSalesChart } from "@/components/admin/ProductSalesChart";
import { useAnalytics } from "@/hooks/api/useAnalytics";
import { usePosData } from "@/hooks/api/usePosData";
import { exportAdminReportToPDF } from "@/services/pdfService";
import { useStore } from "@/context/StoreContext";

const OPTIONS = [
  { label: "Esta Semana", value: "thisWeek" as const },
  { label: "Ultimos 7 dias", value: "last7d" as const },
];

function AdminSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
      {/* Revenue skeleton */}
      <div className="md:col-span-2 p-5 rounded-2xl bg-white shadow-lg border border-zinc-100">
        <div className="flex items-start justify-between mb-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-100" />
              <div className="h-4 w-20 rounded bg-zinc-100" />
            </div>
            <div className="h-3 w-32 rounded bg-zinc-50 ml-10" />
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="h-4 w-12 rounded bg-zinc-100" />
            <div className="h-3 w-24 rounded bg-zinc-50" />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 h-24 rounded-xl bg-zinc-50" />
          <div className="flex-1 h-24 rounded-xl bg-zinc-50" />
          <div className="w-28 h-24 rounded-xl bg-zinc-50" />
        </div>
      </div>

      {/* Products skeleton */}
      <div className="md:col-span-2 p-5 rounded-2xl bg-white shadow-lg border border-zinc-100 min-h-[320px]">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-zinc-100" />
          <div className="h-4 w-36 rounded bg-zinc-100" />
        </div>
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="h-3.5 w-28 rounded bg-zinc-100" />
                <div className="h-3.5 w-16 rounded bg-zinc-50" />
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [selectedOption, setSelectedOption] = useState<{
    label: string;
    value: "thisWeek" | "last7d";
  }>(OPTIONS[0]);

  const { productCategories } = usePosData();
  const { activeStore } = useStore();

  const {
    totals,
    totalsByCurrency,
    isLoading,
    topProducts,
    percentageChange,
    dateRange,
  } = useAnalytics(selectedOption.value);

  const handleExportPDF = () => {
    exportAdminReportToPDF({
      selectedOption,
      dateRange: dateRange || { start: new Date(), end: new Date() },
      totals,
      totalsByCurrency,
      topProducts,
      productCategories,
      storeName: activeStore?.name || "Tienda",
    });
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4 min-h-screen w-full md:max-w-5xl md:mx-auto p-4 md:p-6 pb-24 md:pb-6"
    >
      <motion.header
        variants={fadeUp}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex flex-col gap-1">
          <h1 className="text-xl sm:text-2xl font-bold text-primary-800 tracking-tight">
            Panel de Reportes
          </h1>
          <p className="text-sm text-primary-300 font-semibold">
            {formatVenezuelaDate(getVenezuelaTime())}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-zinc-100 rounded-xl p-1">
            {OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedOption(opt)}
                className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                  selectedOption.value === opt.value
                    ? "bg-white text-primary-700 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <Button
            style="primary"
            onClick={handleExportPDF}
            className="rounded-xl text-sm"
          >
            Exportar PDF
          </Button>
        </div>
      </motion.header>

      {isLoading ? (
        <AdminSkeleton />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <motion.div variants={fadeUp} className="md:col-span-2">
            <RevenueSummary
              totals={totals}
              totalsByCurrency={totalsByCurrency}
              percentageChange={percentageChange}
              dateRange={dateRange}
              selectedOption={selectedOption}
            />
          </motion.div>

          <motion.div variants={fadeUp} className="md:col-span-2">
            <ProductSalesChart products={topProducts} />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
