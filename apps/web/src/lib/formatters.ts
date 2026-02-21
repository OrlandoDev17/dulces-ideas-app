/**
 * Utilidades de formateo estandarizadas para asegurar consistencia visual
 * y cumplimiento con las directrices de internacionalización (Intl).
 */

/**
 * Formatea una fecha a un formato legible corto (Día, Mes abreviado).
 */
export const formatDate = (dateString: string | Date) => {
  return new Intl.DateTimeFormat("es-VE", {
    day: "2-digit",
    month: "short",
  }).format(new Date(dateString));
};

/**
 * Formatea un monto en Bolívares.
 */
export const formatBS = (amount: number) => {
  return amount.toLocaleString("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Formatea un monto en Dólares.
 */
export const formatUSD = (amount: number) => {
  return amount.toFixed(2);
};
