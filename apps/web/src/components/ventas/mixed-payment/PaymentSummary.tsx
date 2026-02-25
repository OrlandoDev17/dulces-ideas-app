interface Props {
  totalToPayBs: number;
  remainingBs: number;
  isComplete: boolean;
}

/**
 * Muestra el resumen de montos en el modal de pago mixto.
 * Incluye el total a pagar y el balance restante con indicadores de color.
 */
export function PaymentSummary({
  totalToPayBs,
  remainingBs,
  isComplete,
}: Props) {
  return (
    <section className="grid grid-cols-2 gap-4">
      {/* Tarjeta de Total */}
      <div className="bg-primary-50 border border-primary-700 rounded-2xl flex flex-col gap-1 items-center justify-center text-center">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary/60">
          Total a Pagar
        </span>
        <strong className="text-xl text-primary font-black">
          Bs.{" "}
          {totalToPayBs.toLocaleString("es-VE", { minimumFractionDigits: 2 })}
        </strong>
      </div>

      {/* Tarjeta de Balance dinámico (Restante/Excedente) */}
      <div
        className={`p-4 rounded-2xl flex flex-col gap-1 items-center justify-center text-center border transition-colors ${
          isComplete
            ? "bg-green-50 border-green-200"
            : remainingBs > 0
              ? "bg-orange-50 border-orange-200"
              : "bg-red-50 border-red-200"
        }`}
      >
        <span
          className={`text-[10px] font-bold uppercase tracking-wider ${
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
        <strong
          className={`text-xl font-black ${
            isComplete
              ? "text-green-700"
              : remainingBs > 0
                ? "text-orange-700"
                : "text-red-700"
          }`}
        >
          Bs.{" "}
          {Math.abs(remainingBs).toLocaleString("es-VE", {
            minimumFractionDigits: 2,
          })}
        </strong>
      </div>
    </section>
  );
}
