/* eslint-disable @typescript-eslint/no-explicit-any */

export const CustomChartTooltip = (props: any) => {
  const { payload, active, label } = props;
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;

  const formatBs = new Intl.NumberFormat("es-VE", {
    style: "currency",
    currency: "VES",
  });

  const formatUsd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="rounded-xl border border-dark/10 bg-white/90 backdrop-blur-md p-4 shadow-2xl shadow-dark/5 min-w-[220px] transform transition-all duration-300">
      <div className="flex items-center justify-between mb-4 border-b border-dark/5 pb-2">
        <span className="font-semibold text-dark/80 text-sm tracking-tight">
          {label}
        </span>
        <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-md uppercase tracking-wider">
          {data.Ventas} {data.Ventas === 1 ? "Venta" : "Ventas"}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center gap-4">
          <span className="text-xs text-dark/50 font-semibold tracking-wide">
            EN BS
          </span>
          <span className="text-sm font-black text-dark tracking-tight">
            {formatBs.format(data.Ingresos || 0)}
          </span>
        </div>

        <div className="flex justify-between items-center gap-4">
          <span className="text-xs text-emerald-600/70 font-bold tracking-wide">
            EN DIVISAS
          </span>
          <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md tracking-tight">
            {formatUsd.format(data.IngresosUSD || 0)}
          </span>
        </div>
      </div>
    </div>
  );
};
