/**
 * Genera un ID único compatible con entornos no seguros (HTTP) y móviles.
 * Prioriza crypto.randomUUID() si está disponible, de lo contrario usa un fallback.
 */
export const generateId = (): string => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    Date.now().toString(36)
  );
};
