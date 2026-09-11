"use client";

import { motion } from "motion/react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  DollarSign,
  CalendarRange,
  ShoppingBag,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface RevenueSummaryProps {
  totals: { bs: number; usd: number; count: number };
  totalsByCurrency: { bs: number; usd: number; bsEqUsd: number };
  percentageChange: number;
  dateRange: { start: Date; end: Date } | null;
  selectedOption: { label: string; value: string };
}

const formatBs = new Intl.NumberFormat("es-VE", {
  style: "currency",
  currency: "VES",
  maximumFractionDigits: 0,
});

const formatUsd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function RevenueSummary({
  totals,
  totalsByCurrency,
  percentageChange,
  dateRange,
  selectedOption,
}: RevenueSummaryProps) {
  const isPositive = percentageChange >= 0;

  const dateRangeText = dateRange
    ? `${format(dateRange.start, "d MMM", { locale: es })} - ${format(dateRange.end, "d MMM", { locale: es })}`
    : "Sin datos";

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="col-span-1 p-5 rounded-2xl bg-white shadow-lg shadow-primary-500/10 border border-zinc-100"
    >
      <header className="flex items-start justify-between mb-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600">
              <Wallet size={16} strokeWidth={2.2} />
            </span>
            <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-wider">
              Ingresos
            </h3>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 ml-10">
            <CalendarRange size={11} />
            {dateRangeText}
          </span>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span
            className={`flex items-center gap-1 font-bold text-sm ${isPositive ? "text-emerald-600" : "text-rose-600"}`}
          >
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {isPositive ? "+" : ""}
            {percentageChange.toFixed(1)}%
          </span>
          <span className="text-[11px] font-medium text-zinc-400">
            {selectedOption.value === "thisWeek"
              ? "vs semana anterior"
              : "vs 7 dias anteriores"}
          </span>
        </div>
      </header>

      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        <motion.div
          whileHover={{ y: -2 }}
          className="flex-1 px-4 py-3.5 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-50/50 border border-emerald-100/60"
        >
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={13} className="text-emerald-600" />
            <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase">
              Bolivares
            </span>
          </div>
          <span className="text-2xl font-black text-zinc-800 tracking-tight block">
            {formatBs.format(totalsByCurrency.bs)}
          </span>
          <span className="text-[11px] text-zinc-500 font-medium">
            Eq. ~{formatUsd.format(totalsByCurrency.bsEqUsd)}
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="flex-1 px-4 py-3.5 rounded-xl bg-gradient-to-br from-primary-50 to-primary-50/50 border border-primary-100/60"
        >
          <div className="flex items-center gap-2 mb-2">
            <Wallet size={13} className="text-primary-600" />
            <span className="text-[10px] font-bold text-primary-600 tracking-wider uppercase">
              Divisas (USD)
            </span>
          </div>
          <span className="text-2xl font-black text-zinc-800 tracking-tight block">
            {formatUsd.format(totalsByCurrency.usd)}
          </span>
          <span className="text-[11px] text-zinc-500 font-medium">
            Caja chica
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="flex items-center justify-center px-4 py-3.5 rounded-xl bg-gradient-to-br from-zinc-50 to-white border border-zinc-100"
        >
          <div className="flex flex-col items-center gap-1">
            <ShoppingBag size={18} className="text-zinc-400" />
            <span className="text-2xl font-black text-zinc-800 tracking-tight">
              {totals.count}
            </span>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Ventas
            </span>
          </div>
        </motion.div>
      </div>
    </motion.article>
  );
}
