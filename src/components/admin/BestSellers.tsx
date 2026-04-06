/* eslint-disable react-hooks/immutability */
"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { usePosData } from "@/hooks/api/usePosData";
import { Product } from "@/shared/types";
import { Medal, BarChart2, Package, TrendingUp } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface TopProduct {
  id: string;
  units: number;
}

interface BestSellersProps {
  topProducts: TopProduct[];
  selectedOption: { label: string; value: "7d" | "30d" };
}

interface RankStyle {
  label: string;
  badge: string;
  bar: string;
  glow: string;
  unitLabel: string;
}

// ---------------------------------------------------------------------------
// Rank badge config — warm earth tones aligned with app palette
// ---------------------------------------------------------------------------
const RANK_CONFIG: RankStyle[] = [
  {
    label: "1.er lugar",
    badge: "bg-amber-100 text-amber-700 ring-1 ring-amber-300/60",
    bar: "from-amber-400 to-amber-500",
    glow: "shadow-amber-400/40",
    unitLabel: "bg-amber-50 text-amber-700 border-amber-200/60",
  },
  {
    label: "2.o lugar",
    badge: "bg-slate-100 text-slate-600 ring-1 ring-slate-300/50",
    bar: "from-slate-400 to-slate-500",
    glow: "shadow-slate-400/25",
    unitLabel: "bg-slate-50 text-slate-600 border-slate-200/60",
  },
  {
    label: "3.er lugar",
    badge: "bg-orange-100 text-orange-700 ring-1 ring-orange-300/50",
    bar: "from-orange-400 to-orange-500",
    glow: "shadow-orange-400/25",
    unitLabel: "bg-orange-50 text-orange-700 border-orange-200/60",
  },
  {
    label: "4.o lugar",
    badge: "bg-primary-100 text-primary-600 ring-1 ring-primary-200/60",
    bar: "from-primary-400 to-primary-500",
    glow: "shadow-primary-400/20",
    unitLabel: "bg-primary-50 text-primary-600 border-primary-200/60",
  },
  {
    label: "5.o lugar",
    badge: "bg-primary-50 text-primary-500 ring-1 ring-primary-200/40",
    bar: "from-primary-300 to-primary-400",
    glow: "shadow-primary-300/15",
    unitLabel: "bg-primary-50 text-primary-500 border-primary-100/60",
  },
];

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 320, damping: 26 },
  },
};

const skeletonVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const skeletonItemVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4 },
  },
};

// ---------------------------------------------------------------------------
// Sub-component: Skeleton loader
// ---------------------------------------------------------------------------
function SkeletonList() {
  return (
    <motion.ol
      variants={skeletonVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4"
      aria-label="Cargando productos más vendidos"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.li
          key={i}
          variants={skeletonItemVariants}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-primary-100 animate-pulse shrink-0" />
            <div className="h-3.5 w-24 rounded-md bg-primary-100 animate-pulse" />
          </div>
          <div className="h-1.5 w-full rounded-full bg-primary-100 animate-pulse" />
        </motion.li>
      ))}
    </motion.ol>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: Empty state
// ---------------------------------------------------------------------------
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3 text-primary-300">
      <span
        className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-50 border border-primary-100"
        aria-hidden="true"
      >
        <Package size={28} strokeWidth={1.5} className="text-primary-200" />
      </span>
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-bold text-primary-400">Sin datos aún</p>
        <p className="text-xs text-primary-300 text-center text-pretty max-w-40">
          No hay ventas registradas en este período
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function BestSellers({ topProducts, selectedOption }: BestSellersProps) {
  const { productCategories, isLoading: isLoadingPos } = usePosData();
  const shouldReduceMotion = useReducedMotion();

  const maxUnits = useMemo(
    () =>
      topProducts.length ? Math.max(...topProducts.map((p) => p.units), 1) : 1,
    [topProducts],
  );

  const totalUnits = useMemo(
    () => topProducts.reduce((sum, p) => sum + p.units, 0),
    [topProducts],
  );

  const getProductName = useMemo(() => {
    const cache = new Map<string, string>();

    return (id: string | number): string => {
      const key = String(id);
      if (cache.has(key)) return cache.get(key)!;

      if (!productCategories?.length) {
        const fallback = `ID\u00a0${id}`;
        cache.set(key, fallback);
        return fallback;
      }

      for (const category of productCategories) {
        const found = category.options.find(
          (p: Product) => String(p.id) === key,
        );
        if (found) {
          cache.set(key, found.name);
          return found.name;
        }
      }

      const fallback = `ID\u00a0${id}`;
      cache.set(key, fallback);
      return fallback;
    };
  }, [productCategories]);

  const isLoading = isLoadingPos || !productCategories?.length;

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  return (
    <motion.article
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="col-span-1 row-span-2 flex flex-col rounded-3xl bg-white shadow-xl shadow-primary-500/30 border border-zinc-100 overflow-hidden"
    >
      {/* --- Header --- */}
      <header className="px-5 pt-5 pb-4 flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary-100 text-primary-600 shrink-0"
              aria-hidden="true"
            >
              <TrendingUp size={16} strokeWidth={2.2} />
            </span>
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary-800 truncate">
              Top 5 Más Vendidos
            </h3>
          </div>
          <p className="text-xs font-medium text-primary-300 ml-10 text-pretty">
            Tendencia en{"\u00a0"}
            <span className="text-primary-500 font-semibold">
              {selectedOption.label}
            </span>
          </p>
        </div>

        {totalUnits > 0 && (
          <span
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-600 text-xs font-semibold shrink-0 mt-0.5 tabular-nums"
            aria-label={`${totalUnits} unidades vendidas en total`}
          >
            <BarChart2 size={12} aria-hidden="true" />
            {totalUnits}
          </span>
        )}
      </header>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="flex-1 px-5 pb-5 overflow-y-auto overscroll-contain pretty-scrollbar">
        {isLoading ? (
          <SkeletonList />
        ) : topProducts.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.ol
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-4"
            aria-label="Ranking de productos más vendidos"
          >
            {topProducts.map((product, index) => {
              const rank = RANK_CONFIG[index] ?? RANK_CONFIG[4];
              const name = getProductName(product.id);
              const percentage = Math.round((product.units / maxUnits) * 100);
              const isTop = index === 0;

              return (
                <motion.li
                  key={product.id}
                  variants={itemVariants}
                  className="group flex flex-col gap-1.5"
                >
                  {/* Row: rank badge + name + units */}
                  <div className="flex items-center justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 transition-transform duration-200 group-hover:scale-110 ${rank.badge}`}
                        aria-label={rank.label}
                      >
                        {isTop ? (
                          <Medal
                            size={13}
                            strokeWidth={2.2}
                            aria-hidden="true"
                          />
                        ) : (
                          index + 1
                        )}
                      </span>
                      <p
                        className={`truncate min-w-0 transition-colors duration-200 ${
                          isTop
                            ? "font-bold text-sm text-primary-800"
                            : "font-semibold text-sm text-zinc-600 group-hover:text-zinc-800"
                        }`}
                        title={name}
                      >
                        {name}
                      </p>
                    </div>

                    <div
                      className={`flex items-baseline gap-0.5 shrink-0 px-2 py-0.5 rounded-md border tabular-nums font-variant-nums transition-transform duration-200 group-hover:scale-105 ${rank.unitLabel}`}
                      aria-label={`${product.units} unidades vendidas`}
                    >
                      <span className="text-xs font-black">
                        {product.units}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wide">
                        u.
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div
                    className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden"
                    role="meter"
                    aria-valuenow={percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${name}: ${percentage}% del líder`}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : {
                              duration: 0.9,
                              delay: index * 0.1,
                              ease: "easeOut",
                            }
                      }
                      className={`h-full rounded-full bg-linear-to-r ${rank.bar} shadow-sm ${rank.glow}`}
                    />
                  </div>
                </motion.li>
              );
            })}
          </motion.ol>
        )}
      </div>
    </motion.article>
  );
}
