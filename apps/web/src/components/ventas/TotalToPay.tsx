interface Props {
  totalBS: number;
  totalUSD: number;
  tasa: number;
}

export function TotalToPay({ totalBS, totalUSD, tasa }: Props) {
  return (
    <article
      className="flex flex-col gap-4 p-4 rounded-2xl bg-zinc-50/50 border border-zinc-200 
          shadow-lg shadow-primary/40 relative overflow-hidden"
    >
      {/* Decoración de ticket */}
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary/20 to-transparent" />

      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            Total a pagar
          </span>
          <strong className="text-2xl font-black text-primary tracking-tight">
            Bs.{" "}
            {totalBS?.toLocaleString("es-VE", {
              minimumFractionDigits: 2,
            })}
          </strong>
        </div>
        <div className="text-right flex flex-col items-end gap-1">
          <span className="block text-sm font-black text-zinc-600">
            ${totalUSD?.toFixed(2)} USD
          </span>
          <small className="text-[11px] text-zinc-400 font-bold uppercase tracking-tighter bg-white px-2 py-0.5 rounded border border-zinc-100">
            Tasa: {tasa}
          </small>
        </div>
      </div>
    </article>
  );
}
