/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "motion/react";
import { DonutChart } from "@tremor/react";
import { CreditCard, Banknote, Smartphone, Wallet, CircleDollarSign } from "lucide-react";

const valueFormatter = (number: number) =>
  `Bs. ${new Intl.NumberFormat("es-VE").format(number)}`;

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "PAGO MÓVIL": Smartphone,
  "DIVISAS": CreditCard,
  "EFECTIVO Bs": Banknote,
  "EFECTIVO USD": Wallet,
};

const COLORS = ["emerald", "amber", "cyan", "violet", "rose"];
const BAR_COLORS = ["#10b981", "#f59e0b", "#06b6d4", "#8b5cf6", "#f43f5e"] as const;

export function PaymentMethodChart({ data }: any) {
  const total = data.reduce((acc: number, item: any) => acc + item.value, 0);
  const maxValue = Math.max(...data.map((item: any) => item.value), 1);

  const formatBs = new Intl.NumberFormat("es-VE", {
    style: "currency",
    currency: "VES",
    maximumFractionDigits: 0,
  });

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="col-span-2 row-span-1 p-4 rounded-3xl bg-gradient-to-br from-slate-50 to-white shadow-xl shadow-primary-500/30 border border-slate-100/80 flex flex-col"
    >
      <header className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-emerald-100">
            <CircleDollarSign size={14} className="text-emerald-600" />
          </div>
          <h3 className="font-bold tracking-wide text-slate-800 text-xs">
            Métodos de Pago
          </h3>
        </div>
        <span className="text-[10px] font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-full shadow-sm border border-slate-100">
          {data.length} activos
        </span>
      </header>

      <div className="flex-1 flex items-center gap-3 min-h-0">
        <div className="relative flex-shrink-0 flex items-center justify-center">
          <DonutChart
            className="h-28 w-28 relative z-10"
            data={data}
            category="value"
            index="name"
            valueFormatter={valueFormatter}
            colors={COLORS}
            showLabel={false}
            variant="donut"
            showAnimation={true}
            animationDuration={1200}
            showTooltip={true}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
            <span className="text-base font-black text-slate-800 leading-none">
              {formatBs.format(total).replace("Bs.", "")}
            </span>
            <span className="text-[8px] font-medium text-slate-400 uppercase tracking-wider">
              Total
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
          {data.map((item: any, index: number) => {
            const IconComponent = ICONS[item.name] || CreditCard;
            const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
            const barWidth = (item.value / maxValue) * 100;
            const colorIndex = index % COLORS.length;

            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.08 }}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/60 transition-colors"
              >
                <div 
                  className="p-1 rounded" 
                  style={{ backgroundColor: `${BAR_COLORS[colorIndex]}20`, color: BAR_COLORS[colorIndex] }}
                >
                  <IconComponent size={11} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-600 uppercase truncate">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-bold text-slate-800 ml-2">
                      {valueFormatter(item.value)}
                    </span>
                  </div>
                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden mt-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ delay: 0.3 + index * 0.08, duration: 0.7, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: BAR_COLORS[colorIndex] }}
                    />
                  </div>
                </div>
                <span className="text-[9px] font-semibold text-slate-400 w-8 text-right tabular-nums">
                  {percentage}%
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.article>
  );
}
