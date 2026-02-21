interface Props {
  totalBS: number;
  totalUSD: number;
  tasa: number;
  isDelivery?: boolean;
  deliveryAmount?: number;
}

export function TotalToPay({
  totalBS,
  totalUSD,
  tasa,
  isDelivery,
  deliveryAmount = 0,
}: Props) {
  const finalTotalBS = totalBS + deliveryAmount;
  const finalTotalUSD = totalUSD + deliveryAmount / tasa;

  return (
    <article
      className="flex flex-col gap-4 p-4 rounded-2xl bg-zinc-50/50 border border-zinc-200 
          shadow-lg shadow-primary/40 relative overflow-hidden"
    >
      {/* Decoración de ticket */}
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary/20 to-transparent" />

      {isDelivery && deliveryAmount > 0 && (
        <section
          className="flex flex-col gap-2 border-b border-primary/10 pb-4 mb-2"
          aria-label="Desglose de costos"
        >
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <span>Subtotal Productos</span>
            <span className="tabular-nums text-zinc-600">
              Bs.{" "}
              {totalBS?.toLocaleString("es-VE", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <span>Servicio Delivery</span>
            <span className="tabular-nums text-zinc-600">
              Bs.{" "}
              {deliveryAmount?.toLocaleString("es-VE", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </section>
      )}

      <div className="flex justify-between items-end relative z-10">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            Total a pagar
          </span>
          <strong className="text-3xl font-black text-primary tracking-tighter leading-none">
            Bs.{" "}
            {finalTotalBS?.toLocaleString("es-VE", {
              minimumFractionDigits: 2,
            })}
          </strong>
        </div>
        <div className="text-right flex flex-col items-end gap-1.5">
          <span className="block text-sm font-black text-zinc-500 tabular-nums">
            ${finalTotalUSD.toFixed(2)} USD
          </span>
          <small className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter bg-white px-2 py-1 rounded-md border border-zinc-100 shadow-sm">
            Tasa: {tasa}
          </small>
        </div>
      </div>
    </article>
  );
}
