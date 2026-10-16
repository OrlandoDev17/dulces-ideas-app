import { fmtBs, fmtUSD } from "@/shared/utils/formatters";

interface Props {
  totalToPayBs: number;
  remainingBs: number;
  isComplete: boolean;
  tasa: number;
  /**
   * Modo parcial (encargos): el "total" es el saldo actual y el restante es lo
   * que quedará pendiente. Un saldo pendiente es normal, no un error.
   */
  allowPartial?: boolean;
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
  allowPartial = false,
}: Props) {
  const totalUSD = totalToPayBs / tasa;
  const remainingUSD = remainingBs / tasa;

  // Etiquetas: en modo parcial hablamos de saldo del encargo.
  const totalLabel = allowPartial ? "Saldo actual" : "Total a Pagar";
  const balanceLabel =
    remainingBs > 0
      ? allowPartial
        ? "Quedará pendiente"
        : "Restante"
      : remainingBs < 0
        ? "Excedente"
        : "Completado";

  // Tono del balance: en modo parcial un saldo pendiente es esperado y se
  // muestra en tono neutro (ya no se marca como error naranja).
  const tone: "green" | "neutral" | "orange" | "red" = isComplete
    ? "green"
    : remainingBs > 0
      ? allowPartial
        ? "neutral"
        : "orange"
      : "red";

  const boxTone = {
    green: "bg-green-50 border-green-200",
    neutral: "bg-primary-50 border-primary-100",
    orange: "bg-orange-50 border-orange-200",
    red: "bg-red-50 border-red-200",
  }[tone];

  const labelTone = {
    green: "text-green-600",
    neutral: "text-primary-600",
    orange: "text-orange-600",
    red: "text-red-600",
  }[tone];

  const valueTone = {
    green: "text-green-700",
    neutral: "text-primary-700",
    orange: "text-orange-700",
    red: "text-red-700",
  }[tone];

  const subTone =
    tone === "orange"
      ? "text-orange-600/70"
      : tone === "red"
        ? "text-red-600/70"
        : tone === "neutral"
          ? "text-primary-600/70"
          : "text-green-600/70";

  return (
    <section className="grid grid-cols-2 gap-4">
      {/* Tarjeta de Total */}
      <div className="bg-primary-50 border border-primary-700/30 rounded-2xl flex flex-col gap-1 py-1 items-center justify-center text-center">
        <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-primary/60">
          {totalLabel}
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
        className={`py-1 rounded-2xl flex flex-col gap-1 items-center justify-center text-center border transition-colors ${boxTone}`}
      >
        <span
          className={`text-[8px] md:text-[10px] font-bold uppercase tracking-wider ${labelTone}`}
        >
          {balanceLabel}
        </span>
        <div className="flex flex-col leading-tight">
          <strong className={`text-base md:text-lg font-black ${valueTone}`}>
            Bs. {fmtBs(Math.abs(remainingBs))}
          </strong>
          {!isComplete && (
            <span
              className={`text-[10px] font-bold tabular-nums ${subTone}`}
            >
              ${fmtUSD(Math.abs(remainingUSD))} USD
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
