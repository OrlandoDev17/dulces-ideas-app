"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SessionContextType {
  currentSessionId: string | null;
  setCurrentSessionId: (id: string | null) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Intentar recuperar de localStorage al cargar
  useEffect(() => {
    const saved = localStorage.getItem("active_session_id");
    if (saved) {
      Promise.resolve().then(() => {
        setCurrentSessionId(saved);
      });
    }
  }, []);

  // Guardar en localStorage cuando cambie
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
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
