"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { usePosData } from "@/hooks/api/usePosData";
import { Package, Search, TrendingUp } from "lucide-react";
import type { ProductSale } from "@/hooks/api/useAnalytics";

interface ProductSalesChartProps {
  products: ProductSale[];
}

const formatUsd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const BAR_COLORS = [
  "from-emerald-400 to-emerald-500",
  "from-primary-400 to-primary-500",
  "from-amber-400 to-amber-500",
  "from-cyan-400 to-cyan-500",
  "from-violet-400 to-violet-500",
  "from-rose-400 to-rose-500",
  "from-teal-400 to-teal-500",
  "from-orange-400 to-orange-500",
  "from-indigo-400 to-indigo-500",
  "from-pink-400 to-pink-500",
];

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 text-zinc-300">
      <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-50 border border-zinc-100">
        <Package size={28} strokeWidth={1.5} className="text-zinc-200" />
      </span>
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-bold text-zinc-400">Sin datos</p>
        <p className="text-xs text-zinc-300 text-center max-w-40">
          No hay ventas registradas en este periodo
        </p>
      </div>
    </div>
  );
}

export function ProductSalesChart({ products }: ProductSalesChartProps) {
  const { productCategories, isLoading: isLoadingPos } = usePosData();
  const shouldReduceMotion = useReducedMotion();
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const maxUnits = useMemo(
    () => (products.length ? Math.max(...products.map((p) => p.units), 1) : 1),
    [products],
  );

  const totalUnits = useMemo(
    () => products.reduce((sum, p) => sum + p.units, 0),
    [products],
  );

  const totalRevenue = useMemo(
    () => products.reduce((sum, p) => sum + p.revenue, 0),
    [products],
  );

  const productNameLookup = useMemo(() => {
    const map = new Map<string, string>();
    if (productCategories?.length) {
      for (const category of productCategories) {
        for (const p of category.options) {
          map.set(String(p.id), p.name);
        }
      }
    }
    return map;
  }, [productCategories]);

  const resolvedProducts = useMemo(() => {
    return products.map((p) => ({
      ...p,
      displayName: productNameLookup.get(p.id) || p.name || `ID\u00a0${p.id}`,
    }));
  }, [products, productNameLookup]);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return resolvedProducts;
    const q = search.toLowerCase();
    return resolvedProducts.filter((p) =>
      p.displayName.toLowerCase().includes(q),
    );
  }, [resolvedProducts, search]);

  const displayedProducts = useMemo(() => {
    if (search.trim()) return filteredProducts;
    return showAll ? filteredProducts : filteredProducts.slice(0, 10);
  }, [filteredProducts, search, showAll]);

  const hasMore = !search.trim() && filteredProducts.length > 10;

  const isLoading = isLoadingPos || !productCategories?.length;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
      className="col-span-1 p-5 rounded-2xl bg-white shadow-lg shadow-primary-500/10 border border-zinc-100 flex flex-col min-h-[320px]"
    >
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 text-primary-600">
            <TrendingUp size={16} strokeWidth={2.2} />
          </span>
          <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-wider">
            Productos Vendidos
          </h3>
        </div>

        {totalUnits > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-zinc-400">
              Total: <span className="text-zinc-600">{totalUnits} u.</span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-600">
              {formatUsd.format(totalRevenue)}
            </span>
          </div>
        )}
      </header>

      {/* Buscador */}
      <div className="relative mb-4">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-zinc-200 bg-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
        />
      </div>

      <div className="flex-1 overflow-y-auto pretty-scrollbar">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2 animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="h-3.5 w-24 rounded bg-zinc-100" />
                  <div className="h-3.5 w-10 rounded bg-zinc-100 ml-auto" />
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-100" />
              </div>
            ))}
          </div>
        ) : displayedProducts.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <ul className="flex flex-col gap-3">
              {displayedProducts.map((product, index) => {
                const percentage = Math.round(
                  (product.units / maxUnits) * 100,
                );
                const colorClass =
                  BAR_COLORS[(search.trim() ? index : index) % BAR_COLORS.length];

                return (
                  <motion.li
                    key={product.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { delay: index * 0.03, duration: 0.3 }
                    }
                    className="flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-zinc-700 truncate">
                        {product.displayName}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-zinc-500 tabular-nums">
                          {product.units} u.
                        </span>
                        {product.revenue > 0 && (
                          <span className="text-xs font-bold text-emerald-600 tabular-nums">
                            {formatUsd.format(product.revenue)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : {
                                duration: 0.8,
                                delay: index * 0.05,
                                ease: "easeOut",
                              }
                        }
                        className={`h-full rounded-full bg-linear-to-r ${colorClass}`}
                      />
                    </div>
                  </motion.li>
                );
              })}
            </ul>

            {hasMore && (
              <button
                onClick={() => setShowAll(true)}
                className="mt-3 w-full py-2 text-xs font-semibold text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all"
              >
                Ver todos ({filteredProducts.length})
              </button>
            )}
          </>
        )}
      </div>
    </motion.article>
  );
}
