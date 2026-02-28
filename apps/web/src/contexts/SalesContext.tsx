import { useState, createContext, useContext, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { Sale } from "@/lib/types";

interface SalesContextType {
  sales: Sale[];
  loading: boolean;
  error: string | null;
  fetchRecentSales: (sessionId: string) => Promise<void>;
  registerSale: (sale: Sale, sessionId: string) => Promise<boolean>;
}

const SalesContext = createContext<SalesContextType | null>(null);

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/sales`;

export function SalesProvider({ children }: { children: React.ReactNode }) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentSales = useCallback(async (sessionId: string) => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/recent/${sessionId}`);
      setSales(response.data);
      console.log(response.data);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.error || err.message);
      } else {
        setError(String(err));
      }
      console.error("Error fetching recent sales:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const registerSale = useCallback(async (sale: Sale, sessionId: string) => {
    setLoading(true);
    setError(null);
    try {
      // Backend expects: session_id, totalUSD, totalBS, tasa_bcv, items, payments
      const payload = {
        session_id: sessionId,
        totalUSD: sale.totalUSD,
        totalBS: sale.totalBS,
        tasa_bcv: sale.tasa_bcv,
        items: sale.items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        payments: sale.payments
          ? sale.payments.map((p) => ({
              method_id: p.method,
              amountBs: p.amountBs,
              amountRef: p.amountRef,
            }))
          : [
              {
                method_id: sale.metodo,
                amountBs: sale.totalBS,
                amountRef: sale.totalUSD,
              },
            ],
      };

      await axios.post(API_URL, payload);
      setSales((prev) => [sale, ...prev]);
      await fetchRecentSales(sessionId);
      return true;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.error || err.message);
      } else {
        setError(String(err));
      }
      console.error("Error registering sale:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <SalesContext.Provider
      value={{
        sales,
        loading,
        error,
        fetchRecentSales,
        registerSale,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
}

export function useSalesContext() {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error(
      "useSalesContext debe ser utilizado dentro de un SalesProvider",
    );
  }
  return context;
}
