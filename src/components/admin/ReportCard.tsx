/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "motion/react";
import { AreaChart } from "@tremor/react";
import { CustomChartTooltip } from "./CustomChartTooltip";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  DollarSign,
  CalendarRange,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
  dateRange: { start: Date; end: Date } | null;
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
  dateRange,
}: ReportCardProps) {
  const isPositive = percentageChange >= 0;

  const dateRangeText = dateRange
    ? `${format(dateRange.start, "d MMM", { locale: es })} - ${format(dateRange.end, "d MMM", { locale: es })}`
    : "Sin datos";

  const formatBs = new Intl.NumberFormat("es-VE", {
    style: "currency",
    currency: "VES",
  });

  const formatUsd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <motion.article className="col-span-1 lg:col-span-3 row-span-1 lg:row-span-2 p-4 rounded-3xl bg-white shadow-xl shadow-primary-500/50 flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h3 className="uppercase font-bold tracking-wide text-slate-800 text-sm">
            Ingresos Totales
          </h3>
          <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
            <CalendarRange size={11} />
            {dateRangeText}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span
            className={`flex items-center gap-1 font-bold text-sm ${isPositive ? "text-emerald-600" : "text-rose-600"}`}
          >
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {isPositive ? "+" : ""}
            {percentageChange.toFixed(1)}%
          </span>
          <span className="text-xs font-medium text-slate-400">
            vs.{" "}
            {selectedOption.label === "Últimos 7 días"
              ? "Semana anterior"
              : "Mes anterior"}
          </span>
        </div>
      </header>

      <div className="flex-1 flex flex-col justify-between min-h-0">
        <motion.header
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-stretch justify-start gap-4 mt-3"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -2 }}
            className="px-4 py-3 border border-slate-100 rounded-xl bg-white flex flex-col justify-between shadow-sm sm:w-2/5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-2 mb-1">
              <Wallet size={13} className="text-primary-500" />
              <span className="text-[10px] font-bold text-primary-500 tracking-wider">
                EN BS.
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-800 tracking-tight">
                {formatBs.format(totalsByCurrency.bs)}
              </span>
              <span className="text-[11px] text-primary-500 font-medium">
                Eq. ~{formatUsd.format(totalsByCurrency.bsEqUsd)}
              </span>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -2 }}
            className="px-4 py-3 border border-slate-100 rounded-xl bg-white flex flex-col justify-between shadow-sm sm:w-2/5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-2 mb-1">
              <DollarSign size={13} className="text-emerald-600" />
              <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase">
                En USD
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-md ml-auto">
                CASH
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-primary-600 tracking-tight">
                {formatUsd.format(totalsByCurrency.usd)}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Caja chica
              </span>
            </div>
          </motion.div>
        </motion.header>

        <div className="relative flex-1 min-h-[150px] sm:min-h-[120px] mt-2">
          <div className="hidden stroke-emerald-500 fill-emerald-500 bg-emerald-500 text-emerald-500"></div>
          <AreaChart
            className="h-full w-full"
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
