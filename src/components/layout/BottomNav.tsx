"use client";

import { NAV_LINKS } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSessions } from "@/hooks/useSessions";
import { useSession } from "@/context/SessionContext";
import { useState } from "react";
import { Plus, Store, Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { CreateSessionModal } from "./CreateSessionModal";
import { Button } from "../common/Button";

export function BottomNav() {
  const path = usePathname();
  const { sessions, isLoading, createSession } = useSessions();
  const { currentSessionId, setCurrentSessionId } = useSession();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentSession = sessions.find((s) => s.id === currentSessionId);

  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
    setIsDrawerOpen(false);
  };

  const handleCreateSession = async (name: string) => {
    try {
      const newSession = await createSession(name);
      setCurrentSessionId(newSession.id || null);
      setIsModalOpen(false);
      setIsDrawerOpen(false);
    } catch {
      throw new Error("Error al crear la sesion");
    }
  };

  return (
    <>
      <nav className="md:hidden fixed bottom-2 left-1/2 -translate-x-1/2 w-[90%] h-16 z-80 bg-white/80 backdrop-blur-xl border-2 border-primary-500 rounded-2xl flex justify-around items-center shadow-2xl shadow-primary/20 p-2">
        {NAV_LINKS.map(({ id, label, href, icon: Icon }) => (
          <Link
            className={`flex flex-col items-center justify-center gap-1 w-full h-full rounded-xl transition-all duration-300 ${
              path === href
                ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30 -translate-y-1"
                : "text-zinc-400 hover:text-primary-600"
            }`}
            key={id}
            href={href}
          >
            <Icon className="size-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {label}
            </span>
          </Link>
        ))}

        <button
          onClick={() => setIsDrawerOpen(true)}
          className={`flex flex-col items-center justify-center gap-1 w-full h-full rounded-xl transition-all duration-300 ${
            isDrawerOpen
              ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
              : "text-zinc-400 hover:text-primary-600"
          }`}
        >
          <Store className="size-6" />
          <span className="text-[10px] font-bold uppercase tracking-wider truncate px-1">
            {currentSession?.name || "Sesión"}
          </span>
        </button>
      </nav>

      {/* Drawer para cambiar sesión */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-90"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-100 p-6 pb-12 shadow-2xl border-t border-primary-100"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-black text-primary-900 tracking-tight">
                    Tus Sesiones
                  </h3>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Cambia o crea una nueva
                  </p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 bg-zinc-100 rounded-full text-zinc-500 hover:bg-zinc-200"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto mb-6 pr-2">
                {isLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="size-8 text-primary-500 animate-spin" />
                    <p className="text-sm font-bold text-zinc-400">
                      Cargando sesiones...
                    </p>
                  </div>
                ) : (
                  sessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => handleSelectSession(session.id!)}
                      className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border-2 ${
                        currentSessionId === session.id
                          ? "bg-primary-50 border-primary-500 text-primary-900"
                          : "bg-white border-zinc-100 text-zinc-500 hover:border-primary-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-10 flex items-center justify-center rounded-xl transition-colors ${
                            currentSessionId === session.id
                              ? "bg-primary-600 text-white"
                              : "bg-zinc-100 text-zinc-400"
                          }`}
                        >
                          <Store className="size-5" />
                        </div>
                        <span className="font-bold tracking-tight">
                          {session.name}
                        </span>
                      </div>
                      {currentSessionId === session.id && (
                        <div className="px-3 py-1 bg-primary-600 text-white text-[10px] font-black uppercase rounded-full">
                          Activa
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>

              <Button
                style="primary"
                onClick={() => setIsModalOpen(true)}
                className="w-full h-14 rounded-2xl shadow-xl shadow-primary-600/20"
              >
                <Plus className="size-5" />
                <span>Nueva Sesión</span>
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CreateSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCreateSession}
      />
    </>
  );
}
