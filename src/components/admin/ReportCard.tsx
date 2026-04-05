/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "motion/react";
import { AreaChart } from "@tremor/react";
import { CustomChartTooltip } from "./CustomChartTooltip";
import { TrendingUp, TrendingDown, RefreshCw, Wallet, DollarSign } from "lucide-react";

interface ReportCardProps {
  chartData: any[];
  totals: {
    bs: number;
    usd: number;
  };
  totalsByCurrency: {
    bs: number;
    usd: number;
    bsEqUsd: number;
  };
  selectedOption: {
    label: string;
    value: "7d" | "30d";
  };
  percentageChange: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

export function ReportCard({
  chartData,
  totalsByCurrency,
  selectedOption,
  percentageChange,
}: ReportCardProps) {
  const isPositive = percentageChange >= 0;

  const formatBs = new Intl.NumberFormat("es-VE", {
    style: "currency",
    currency: "VES",
  });

  const formatUsd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <motion.article className="col-span-3 row-span-2 p-6 rounded-3xl bg-white shadow-xl shadow-slate-200/50 flex flex-col justify-between">
      <header className="flex items-center justify-between">
        <h3 className="uppercase font-bold tracking-wide text-slate-800">
          Ingresos Totales
        </h3>
        <div className="flex flex-col items-end">
          <span
            className={`flex items-center gap-1 font-bold ${isPositive ? "text-emerald-600" : "text-rose-600"}`}
          >
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {isPositive ? "+" : ""}
            {percentageChange.toFixed(1)}%
          </span>
          <span className="text-sm font-medium text-slate-400">
            vs.{" "}
            {selectedOption.label === "Últimos 7 días"
              ? "Semana anterior"
              : "Mes anterior"}
          </span>
        </div>
      </header>
      
      <div className="flex-1 flex flex-col justify-between">
        <motion.header
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex items-stretch justify-start gap-5 mt-6"
        >
          {/* Card Bs */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="px-5 py-4 border border-slate-100 rounded-3xl bg-white flex flex-col justify-between shadow-sm min-w-[220px] w-1/3 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500 tracking-wider">
                <Wallet size={14} className="text-slate-400" />
                EN BS.
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Punto + Pago Móvil</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-800 tracking-tight">
                {formatBs.format(totalsByCurrency.bs)}
              </span>
              <span className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                <RefreshCw size={12} className="text-slate-400" /> 
                Eq. a ~{formatUsd.format(totalsByCurrency.bsEqUsd)}
              </span>
            </div>
          </motion.div>

          {/* Card USD */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="px-5 py-4 border border-slate-100 rounded-3xl bg-white flex flex-col justify-between shadow-sm min-w-[220px] w-1/3 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-600/80 tracking-wider uppercase">
                <DollarSign size={14} />
                En USD
              </span>
              <span className="text-[10px] font-bold px-2 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-md">
                CASH / DIVISAS
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-800 tracking-tight">
                {formatUsd.format(totalsByCurrency.usd)}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 font-medium tracking-wide">
                Flujo directo en caja chica
              </span>
            </div>
          </motion.div>
        </motion.header>
        <div className="relative h-80 w-full">
          {/* Elementos para forzar a Tailwind a generar las clases dinamicas de Tremor */}
          <div className="hidden stroke-emerald-500 fill-emerald-500 bg-emerald-500 text-emerald-500"></div>
          <AreaChart
            className="h-full w-full mt-10"
            data={chartData}
            index="date"
            categories={["Ingresos"]}
            colors={["emerald"]}
            showXAxis={false}
            showYAxis={false}
            showGridLines={false}
            curveType="natural"
            showLegend={false}
            showAnimation={true}
            animationDuration={1500}
            showTooltip={true}
            customTooltip={CustomChartTooltip}
          />
        </div>
      </div>
    </motion.article>
  );
}
