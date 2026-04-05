/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "motion/react";
import { ReportCard } from "./ReportCard";

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
}

export function BentoGrid({
  chartData,
  totals,
  totalsByCurrency,
  selectedOption,
  percentageChange,
}: BentoGridProps) {
  return (
    <motion.section className="grid grid-cols-4 grid-rows-4 gap-6 mt-8 2xl:mt-12">
      {/* Card Principal */}
      <ReportCard
        chartData={chartData}
        totals={totals}
        totalsByCurrency={totalsByCurrency}
        selectedOption={selectedOption}
        percentageChange={percentageChange}
      />
    </motion.section>
  );
}
