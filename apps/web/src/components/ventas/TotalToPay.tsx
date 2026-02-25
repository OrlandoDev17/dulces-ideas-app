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

  const finalTotalBsRoundedTo2 = Math.round(finalTotalBS * 100) / 100;

  return (
    <article
      className="flex flex-col gap-4 p-4 rounded-2xl bg-primary-50/20 border border-primary-500 
      shadow-lg shadow-primary-500/40 relative overflow-hidden"
    >
      {/* Decoración de ticket */}
      <div className="absolute top-0 left-0 w-full h-1" />

      <div className="flex justify-between items-center relative z-10">
        <div className="flex flex-col gap-1">
          <span className="text-[8px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            Total a pagar
          </span>
          <strong className="text-xl md:text-3xl font-black text-primary tracking-tighter leading-none">
            Bs.{" "}
            {finalTotalBsRoundedTo2?.toLocaleString("es-VE", {
              minimumFractionDigits: 2,
            })}
          </strong>
        </div>
        <div className="text-right flex flex-col items-end gap-1.5">
          <span className="block text-xs md:text-sm font-black text-zinc-500 tabular-nums">
            ${finalTotalUSD.toFixed(2)} USD
          </span>
          <small className="text-[8px] md:text-[10px] text-zinc-400 font-bold uppercase tracking-tighter bg-white px-2 py-1 rounded-md border border-zinc-100 shadow-sm">
            Tasa: {tasa}
          </small>
        </div>
      </div>
      {isDelivery && deliveryAmount > 0 && (
        <section
          className="flex flex-col gap-2 border-t-2 border-primary-500 pt-4"
          aria-label="Desglose de costos"
        >
          <div className="flex justify-between items-center text-sm font-bold text-primary-500">
            <span className="text-xs md:text-sm">Subtotal Productos</span>
            <span className="tabular-nums text-zinc-600">
              Bs.{" "}
              {totalBS?.toLocaleString("es-VE", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm font-bold text-primary-500">
            <span className="text-xs md:text-sm">Servicio Delivery</span>
            <span className="tabular-nums text-zinc-600">
              Bs.{" "}
              {deliveryAmount?.toLocaleString("es-VE", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </section>
      )}
    </article>
  );
}
