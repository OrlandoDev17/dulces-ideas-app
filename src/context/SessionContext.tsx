/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useContext, useState, useEffect } from "react";
import { useStore } from "./StoreContext";

interface SessionContextType {
  currentSessionId: string | null;
  setCurrentSessionId: (id: string | null) => void;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { activeStore } = useStore();

  useEffect(() => {
    const savedSessionId = localStorage.getItem("active_session_id");

    if (activeStore?.id && savedSessionId) {
      setCurrentSessionId(savedSessionId);
    } else if (!activeStore?.id) {
      setCurrentSessionId(null);
      localStorage.removeItem("active_session_id");
    }

    setIsLoading(false);
  }, [activeStore?.id]);

  const handleSetCurrentSessionId = (id: string | null) => {
    setCurrentSessionId(id);
    if (id) {
      localStorage.setItem("active_session_id", id);
    } else {
      localStorage.removeItem("active_session_id");
    }
  };

  return (
    <SessionContext.Provider
      value={{
        currentSessionId,
        setCurrentSessionId: handleSetCurrentSessionId,
        isLoading,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context)
    throw new Error("useSession must be used within a SessionProvider");
  return context;
}
