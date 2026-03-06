"use client";

// Components
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";

// React Query
import { ReactNode, useState } from "react";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createIDBPersister } from "@/lib/Persister";
import { SessionProvider } from "@/context/SessionContext";

export function RootLayout({ children }: { children: ReactNode }) {
  // 1. Creamos el QueryClient con configuraciones de cache agresivas para offline
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: 1000 * 60 * 60 * 24,
            staleTime: 1000 * 60 * 5,
          },
        },
      }),
  );

  // 2. Definimos el persistidor
  const persister =
    typeof window !== "undefined" ? createIDBPersister() : undefined;

  // 3. Usamos el PersistQueryClientProvider en lugar del normal

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: persister! }}
    >
      <SessionProvider>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 pb-24 md:pb-0 md:pl-72">{children}</main>
          <BottomNav />
        </div>
      </SessionProvider>
    </PersistQueryClientProvider>
  );
}
