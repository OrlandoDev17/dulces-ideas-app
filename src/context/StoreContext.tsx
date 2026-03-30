/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useState, useEffect } from "react";
import { storesApi } from "@/api/store";

interface Store {
  id: string;
  name: string;
  is_demo: boolean;
}

interface StoreContextType {
  activeStore: Store | null;
  isLoading: boolean;
  loginToStore: (
    passcode: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logoutFromStore: () => void;
}

export const StoreContext = createContext<StoreContextType | undefined>(
  undefined,
);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeStore, setActiveStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedStore = sessionStorage.getItem("active_store");
    if (savedStore) {
      setActiveStore(JSON.parse(savedStore));
    }
    setIsLoading(false);
  }, []);

  const loginToStore = async (passcode: string) => {
    try {
      setIsLoading(true);
      const storeData = await storesApi.validatePasscode(passcode);

      setActiveStore(storeData);
      sessionStorage.setItem("active_store", JSON.stringify(storeData));
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Error de conexion",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logoutFromStore = () => {
    setActiveStore(null);
    sessionStorage.removeItem("active_store");
  };

  return (
    <StoreContext.Provider
      value={{ activeStore, isLoading, loginToStore, logoutFromStore }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore debe usarse dentro de StoreProvider");
  }
  return context;
};
