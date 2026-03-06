/**
 * Utilidades de formateo estandarizadas.
 * Importa SIEMPRE desde este archivo para garantizar consistencia visual.
 */

// ─── Helpers numéricos ─────────────────────────────────────────────────────

/**
 * Redondea un número a exactamente 2 decimales (evita aritmética de punto flotante).
 * Ejemplo: 2550.005 → 2550.01
 */
export const roundTo2 = (n: number): number => Math.round(n * 100) / 100;

// ─── Formateo de moneda ────────────────────────────────────────────────────

/**
 * Formatea un monto en Bolívares con separadores de miles venezolanos.
 * Ejemplo: 2550 → "2.550,00"
 *          12345.6 → "12.345,60"
 */
export const fmtBs = (amount: number): string =>
  roundTo2(amount).toLocaleString("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/**
 * Formatea un monto en dólares con 2 decimales fijos.
 * Ejemplo: 12.5 → "12.50"
 */
export const fmtUSD = (amount: number): string => roundTo2(amount).toFixed(2);

// ─── Formateo de fechas ────────────────────────────────────────────────────

/**
 * Formatea una fecha a un formato legible corto (Día, Mes abreviado).
 */
export const formatDate = (dateString: string | Date) =>
  new Intl.DateTimeFormat("es-VE", {
    day: "2-digit",
    month: "short",
  }).format(new Date(dateString));

// ─── Aliases para compatibilidad (no usar en código nuevo) ─────────────────

/** @deprecated Usa `fmtBs` en código nuevo. */
export const formatBS = fmtBs;
/** @deprecated Usa `fmtUSD` en código nuevo. */
export const formatUSD = fmtUSD;
