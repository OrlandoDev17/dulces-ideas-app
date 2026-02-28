/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, createContext, useContext, useEffect } from "react";
import axios from "axios";
import type { Session } from "@/lib/types";

interface SessionContextType {
  sessions: Session[];
  currentSession: Session | null;
  loading: boolean;
  error: string | null;
  setCurrentSession: (session: Session) => void;
  fetchSession: () => Promise<void>;
  createSession: (name: string) => Promise<Session | null>;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/sessions`;

  // Cargar sesión persistida al iniciar
  useEffect(() => {
    const savedSession = localStorage.getItem("currentSession");
    if (savedSession) {
      try {
        setCurrentSession(JSON.parse(savedSession));
      } catch (e) {
        console.error("Error al cargar sesión de localStorage", e);
        localStorage.removeItem("currentSession");
      }
    }
  }, []);

  // Guardar sesión persistida cuando cambie
  const handleSetCurrentSession = (session: Session) => {
    setCurrentSession(session);
    localStorage.setItem("currentSession", JSON.stringify(session));
  };

  const fetchSession = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setSessions(response.data);
      console.log(response.data);
    } catch (error: any) {
      setError(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (name: string): Promise<Session | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(API_URL, { name });
      const newSession = response.data;
      setSessions((prev) => [newSession, ...prev]);
      handleSetCurrentSession(newSession);
      console.log(newSession);
      return newSession;
    } catch (error: any) {
      setError(error.response?.data?.error || error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SessionContext.Provider
      value={{
        sessions,
        currentSession,
        loading,
        error,
        fetchSession,
        createSession,
        setCurrentSession: handleSetCurrentSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession debe estar dentro de SessionProvider");
  }
  return context;
}
