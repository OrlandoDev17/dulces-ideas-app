"use client";

import { motion } from "motion/react";
import {
  TrendingUp,
  DollarSign,
  Package,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { fmtBs, fmtUSD } from "@/lib/formatters";
import type { Sale } from "@/lib/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  summary: {
    totalBs: number;
    totalUsd: number;
    count: number;
  };
  sales: Sale[];
  isPending: boolean;
}

export function ArchiveDayModal({
  isOpen,
  onClose,
  onConfirm,
  summary,
  sales,
  isPending,
}: Props) {
  // Calculamos distribución por método para la mini gráfica
  const methodDist = sales.reduce((acc: Record<string, number>, sale) => {
    const payments = sale.sale_payments || [];
    if (payments.length > 0) {
      payments.forEach((p) => {
        const m = p.method_id || p.methodId;
        acc[m] = (acc[m] || 0) + (p.amount_bs || p.amountBs || 0);
      });
    } else {
      const m = sale.method_id || sale.metodo || "unknown";
      acc[m] = (acc[m] || 0) + (sale.total_bs || sale.totalBs || 0);
    }
    return acc;
  }, {});

  const totalValue = Object.values(methodDist).reduce((a, b) => a + b, 0) || 1;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cierre de Caja"
      description="Revisa el resumen antes de finalizar el día"
      icon={TrendingUp}
      footer={
        <div className="flex flex-col gap-3">
          <Button
            style="primary"
            onClick={onConfirm}
            disabled={isPending}
            className="py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary-500/20"
          >
            {isPending ? "Procesando..." : "Confirmar Cierre"}
            <CheckCircle2 size={18} />
          </Button>
          <button
            onClick={onClose}
            disabled={isPending}
            className="py-3 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            Cancelar
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-8">
        {/* Grid de Totales */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-50 p-4 rounded-3xl border border-zinc-100">
            <div className="flex items-center gap-2 text-primary-500 mb-2">
              <DollarSign size={16} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                Total Bolívares
              </span>
            </div>
            <p className="text-xl font-black text-zinc-800 tabular-nums">
              {fmtBs(summary.totalBs)}
            </p>
          </div>
          <div className="bg-zinc-50 p-4 rounded-3xl border border-zinc-100">
            <div className="flex items-center gap-2 text-green-500 mb-2">
              <TrendingUp size={16} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                Total Divisas
              </span>
            </div>
            <p className="text-xl font-black text-zinc-800 tabular-nums">
              ${fmtUSD(summary.totalUsd)}
            </p>
          </div>
          <div className="col-span-2 bg-zinc-50 p-4 rounded-3xl border border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 text-primary-600 rounded-xl">
                <Package size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400 leading-none mb-1">
                  Operaciones
                </p>
                <p className="text-lg font-black text-zinc-800 leading-none">
                  {summary.count} Ventas
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mini Gráfica de Métodos */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 px-1">
            Distribución de Pagos
          </h3>
          <div className="flex flex-col gap-2">
            {Object.entries(methodDist).map(([method, amount], i) => {
              const percentage = (amount / totalValue) * 100;
              return (
                <div key={method} className="flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] font-bold text-zinc-500 px-1">
                    <span className="uppercase">{method}</span>
                    <span className="tabular-nums">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                  <div className="h-3 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
                      className="h-full bg-primary-500 rounded-full shadow-[0_0_10px_rgba(var(--primary-500),0.3)]"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Advertencia */}
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3">
          <AlertTriangle className="text-amber-500 shrink-0" size={20} />
          <p className="text-[11px] font-bold text-amber-800 leading-relaxed">
            Al cerrar el día, las ventas se moverán al historial permanente y no
            podrán editarse desde este panel.
          </p>
        </div>
      </div>
    </Modal>
  );
}
