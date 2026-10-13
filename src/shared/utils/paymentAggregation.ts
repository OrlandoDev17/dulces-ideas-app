import type { PaymentMethod, Sale } from "@/shared/types";

/**
 * Determina si un id de método de pago corresponde a Pago Móvil,
 * ya sea el genérico ("pm") o una cuenta específica ("pm_johnnie").
 */
export const isPagoMovilId = (id?: string | null): boolean => {
  if (!id) return false;
  const normalized = id.toLowerCase();
  return normalized === "pm" || normalized.startsWith("pm_");
};

/**
 * Resuelve el nombre visible de una cuenta de Pago Móvil a partir de su id.
 * "pm" -> "Pago Móvil" | "pm_johnnie" -> "Johnnie"
 */
export const getPmAccountLabel = (
  id: string,
  paymentMethods: PaymentMethod[],
): string => {
  if (id === "pm") return "Pago Móvil";
  const method = paymentMethods.find((m) => m.id === id);
  if (method) {
    const label = method.name
      .replace(/^Bs\.?\s*[-–—]?\s*Pago Móvil\s*/i, "")
      .replace(/^\((.*)\)$/, "$1")
      .trim();
    if (label) return label;
  }
  // Fallback: id legible cuando el método no está en la lista
  const raw = id.replace(/^pm_/, "");
  return raw.charAt(0).toUpperCase() + raw.slice(1).replace(/_/g, " ");
};

/**
 * Nombre completo del método tal como está en la BD (para tooltips).
 */
export const getFullMethodName = (
  id: string,
  paymentMethods: PaymentMethod[],
): string => {
  const method = paymentMethods.find((m) => m.id === id);
  return method?.name || id || "N/A";
};

/**
 * Etiqueta corta para badges de pago.
 * "Bs - Pago Móvil (Johnnie)" -> "PM Johnnie" | "Punto de Venta" -> "Punto"
 */
export const getShortMethodLabel = (
  id: string,
  paymentMethods: PaymentMethod[],
): string => {
  const normalized = (id || "").toLowerCase();
  if (isPagoMovilId(id)) {
    return normalized === "pm"
      ? "PM"
      : `PM ${getPmAccountLabel(normalized, paymentMethods)}`;
  }
  if (normalized === "punto" || normalized === "pv") return "Punto";
  if (normalized === "ves" || normalized === "bs") return "Efectivo";
  if (normalized === "usd" || normalized === "divisas") return "USD";
  if (normalized === "mx" || normalized === "mixto") return "Mixto";
  const name = getFullMethodName(id, paymentMethods);
  return name.replace(/^Bs\.?\s*[-–—]?\s*/i, "").trim() || id;
};

export interface PmAccountAmount {
  accountId: string;
  label: string;
  amountBs: number;
}

export interface MethodSummary {
  /** Desglose de Pago Móvil por cuenta (incluye la genérica "pm" si hay ventas legacy) */
  pmByAccount: PmAccountAmount[];
  /** Total Pago Móvil (todas las cuentas + genérico) */
  pmTotal: number;
  /** Punto de Venta */
  pvBs: number;
  /** Efectivo */
  efBs: number;
  /** Divisas (USD, en monto de referencia) */
  usdTotal: number;
  /** Total Bolívares = Pago Móvil + Punto + Efectivo */
  totalBs: number;
}

/**
 * Agrega los pagos de un conjunto de ventas por método de pago,
 * desglosando Pago Móvil por cuenta. Aplica la misma lógica de
 * descuento de delivery que ya existía:
 * prioridad PM -> Punto -> Efectivo -> Divisas.
 *
 * Fuente única de verdad para el panel de ingresos diarios y el PDF.
 */
export function summarizeSalesByMethod(
  sales: Sale[],
  paymentMethods: PaymentMethod[] = [],
): MethodSummary {
  const pmMap = new Map<string, number>();
  let pvBs = 0;
  let efBs = 0;
  let usdTotal = 0;

  sales.forEach((sale) => {
    const payments = sale.sale_payments || [];
    const totalBs = sale.total_bs || sale.totalBs || 0;
    const totalUsd = sale.total_usd || sale.totalUsd || 0;
    const deliveryAmt = sale.delivery_amount || sale.deliveryAmount || 0;

    // Ingresos (Ajustados para no incluir delivery)
    if (payments.length > 0) {
      const pmAccounts = new Map<string, number>(); // orden de aparición
      let sPm = 0;
      let sPv = 0;
      let sEf = 0;
      let sUsd = 0;

      payments.forEach((p) => {
        const mId = (p.method_id || p.methodId || "").toLowerCase();
        const amtBs = p.amount_bs || p.amountBs || 0;
        const amtRef = p.amount_ref || p.amountRef || 0;

        if (isPagoMovilId(mId)) {
          const key = mId === "pm" ? "pm" : mId;
          pmAccounts.set(key, (pmAccounts.get(key) || 0) + amtBs);
          sPm += amtBs;
        } else if (mId === "punto" || mId === "pv") {
          sPv += amtBs;
        } else if (mId === "ves" || mId === "bs") {
          sEf += amtBs;
        } else if (mId === "usd") {
          sUsd += amtRef;
        }
      });

      // "No sumes el delivery nunca": resta con prioridad PM -> Punto -> Efectivo -> Divisas
      let toSubtract = deliveryAmt;
      if (toSubtract > 0 && sPm > 0) {
        // Dentro del PM, se resta siguiendo el orden de aparición de las cuentas
        let remaining = toSubtract;
        for (const [key, val] of pmAccounts) {
          if (remaining <= 0) break;
          const sub = Math.min(val, remaining);
          pmAccounts.set(key, val - sub);
          remaining -= sub;
        }
        sPm -= toSubtract - remaining;
        toSubtract = remaining;
      }

      if (toSubtract > 0 && sPv > 0) {
        const subPv = Math.min(sPv, toSubtract);
        sPv -= subPv;
        toSubtract -= subPv;
      }

      if (toSubtract > 0 && sEf > 0) {
        const subEf = Math.min(sEf, toSubtract);
        sEf -= subEf;
        toSubtract -= subEf;
      }

      if (toSubtract > 0 && sUsd > 0) {
        const tasa = sale.tasa_bcv || 1;
        const subUsd = Math.min(sUsd, toSubtract / tasa);
        sUsd -= subUsd;
      }

      pmAccounts.forEach((val, key) => {
        pmMap.set(key, (pmMap.get(key) || 0) + val);
      });
      pvBs += sPv;
      efBs += sEf;
      usdTotal += sUsd;
    } else {
      // Fallback para ventas sin desglose detallado
      const met = (sale.method_id || sale.metodo || "").toLowerCase();
      const tasa = sale.tasa_bcv || 1;
      const finalTotalBs = Math.max(0, totalBs - deliveryAmt);
      const finalTotalUsd = Math.max(0, totalUsd - deliveryAmt / tasa);

      if (isPagoMovilId(met)) {
        const key = met === "pm" ? "pm" : met;
        pmMap.set(key, (pmMap.get(key) || 0) + finalTotalBs);
      } else if (met === "punto" || met === "pv") {
        pvBs += finalTotalBs;
      } else if (met === "ves" || met === "bs") {
        efBs += finalTotalBs;
      } else if (met === "usd") {
        usdTotal += finalTotalUsd;
      }
    }
  });

  const pmByAccount = Array.from(pmMap.entries())
    .map(([accountId, amountBs]) => ({
      accountId,
      label: getPmAccountLabel(accountId, paymentMethods),
      amountBs,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "es"));

  const pmTotal = pmByAccount.reduce((acc, a) => acc + a.amountBs, 0);

  return {
    pmByAccount,
    pmTotal,
    pvBs,
    efBs,
    usdTotal,
    totalBs: pmTotal + pvBs + efBs,
  };
}
