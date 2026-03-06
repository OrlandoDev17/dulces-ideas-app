import { fmtBs, fmtUSD } from "@/lib/formatters";

interface Props {
  totalToPayBs: number;
  remainingBs: number;
  isComplete: boolean;
  tasa: number;
}

/**
 * Muestra el resumen de montos en el modal de pago mixto.
 * Incluye el total a pagar y el balance restante con indicadores de color.
 * Ahora muestra tanto en Bolívares como en Divisas (USD).
 */
export function PaymentSummary({
  totalToPayBs,
  remainingBs,
  isComplete,
  tasa,
}: Props) {
  const totalUSD = totalToPayBs / tasa;
  const remainingUSD = remainingBs / tasa;

  return (
    <section className="grid grid-cols-2 gap-4">
      {/* Tarjeta de Total */}
      <div className="bg-primary-50 border border-primary-700/30 rounded-2xl flex flex-col gap-1 py-1 items-center justify-center text-center">
        <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-primary/60">
          Total a Pagar
        </span>
        <div className="flex flex-col leading-tight">
          <strong className="text-base md:text-lg text-primary font-black">
            Bs. {fmtBs(totalToPayBs)}
          </strong>
          <span className="text-[10px] text-primary/70 font-bold tabular-nums">
            ${fmtUSD(totalUSD)} USD
          </span>
        </div>
      </div>

      {/* Tarjeta de Balance dinámico (Restante/Excedente) */}
      <div
        className={`py-1 rounded-2xl flex flex-col gap-1 items-center justify-center text-center border transition-colors ${
          isComplete
            ? "bg-green-50 border-green-200"
            : remainingBs > 0
              ? "bg-orange-50 border-orange-200"
              : "bg-red-50 border-red-200"
        }`}
      >
        <span
          className={`text-[8px] md:text-[10px] font-bold uppercase tracking-wider ${
            isComplete
              ? "text-green-600"
              : remainingBs > 0
                ? "text-orange-600"
                : "text-red-600"
          }`}
        >
          {remainingBs > 0
            ? "Restante"
            : remainingBs < 0
              ? "Excedente"
              : "Completado"}
        </span>
        <div className="flex flex-col leading-tight">
          <strong
            className={`text-base md:text-lg font-black ${
              isComplete
                ? "text-green-700"
                : remainingBs > 0
                  ? "text-orange-700"
                  : "text-red-700"
            }`}
          >
            Bs. {fmtBs(Math.abs(remainingBs))}
          </strong>
          {!isComplete && (
            <span
              className={`text-[10px] font-bold tabular-nums ${
                remainingBs > 0 ? "text-orange-600/70" : "text-red-600/70"
              }`}
            >
              ${fmtUSD(Math.abs(remainingUSD))} USD
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
