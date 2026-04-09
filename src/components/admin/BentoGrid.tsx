/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "motion/react";
import { ReportCard } from "./ReportCard";
import { BestSellers } from "./BestSellers";
import { PaymentMethodChart } from "./PaymentMethodChart";

interface BentoGridProps {
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
  topProducts: any[];
  paymentMethods: any[];
  range: "7d" | "30d";
  dateRange: { start: Date; end: Date } | null;
}

export function BentoGrid({
  chartData,
  totals,
  totalsByCurrency,
  selectedOption,
  percentageChange,
  topProducts,
  paymentMethods,
  dateRange,
}: BentoGridProps) {
  return (
    <motion.section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-auto lg:auto-rows-fr gap-4 flex-1 min-h-0 mt-6">
      <ReportCard
        chartData={chartData}
        totals={totals}
        totalsByCurrency={totalsByCurrency}
        selectedOption={selectedOption}
        percentageChange={percentageChange}
        dateRange={dateRange}
      />
      <BestSellers topProducts={topProducts} selectedOption={selectedOption} />
      <PaymentMethodChart data={paymentMethods} />
    </motion.section>
  );
}
