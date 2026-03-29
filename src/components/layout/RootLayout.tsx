"use client";

// Components
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

// React Query
import { ReactNode, useState } from "react";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createIDBPersister } from "@/lib/Persister";
import { SessionProvider } from "@/context/SessionContext";
import { StoreProvider } from "@/context/StoreContext";
import { LoginModal } from "./LoginModal";
import { useStore } from "@/context/StoreContext";
import { motion, AnimatePresence } from "motion/react";
import { Cake } from "lucide-react";

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
      <StoreProvider>
        <SessionProvider>
          <AppContent>{children}</AppContent>
        </SessionProvider>
      </StoreProvider>
    </PersistQueryClientProvider>
  );
}

function AppContent({ children }: { children: ReactNode }) {
  const { activeStore, isLoading } = useStore();
  const [isLoginOpen, setIsLoginOpen] = useState(true);

  return (
    <div className="relative min-h-screen">
      {/* Background Content - blurred when not authenticated or loading */}
      <div
        className={`flex transition-all duration-700 h-screen ${
          !activeStore || isLoading ? "blur-2xl scale-105 overflow-hidden" : ""
        }`}
      >
        <Sidebar />
        <main className="flex-1 pb-24 md:pb-0 md:pl-64 2xl:pl-72 overflow-auto">
          {children}
        </main>
        <BottomNav />
      </div>

      {/* Auth Layer */}
      <AnimatePresence mode="wait">
        {!activeStore && !isLoading && (
          <LoginModal
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Loading Layer - Premium Loader */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-1000 flex items-center justify-center bg-white/20 backdrop-blur-md"
          >
            <div className="relative">
              {/* Outer Glow */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-primary-200 rounded-full blur-3xl"
              />

              {/* Main Spinner */}
              <div className="relative flex flex-col items-center gap-6">
                <div className="relative p-6 bg-white rounded-3xl shadow-2xl border border-primary-100">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 border-4 border-t-primary-600 border-r-transparent border-b-transparent border-l-transparent rounded-3xl"
                  />
                  <Cake className="w-12 h-12 text-primary-600" />
                </div>

                <div className="flex flex-col items-center gap-1 text-center">
                  <h2 className="text-xl font-black text-primary-900 tracking-tight">
                    Dulces Ideas
                  </h2>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{
                          y: [0, -4, 0],
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                        className="w-1.5 h-1.5 bg-primary-600 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
