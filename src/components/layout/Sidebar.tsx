/* eslint-disable react-hooks/set-state-in-effect */
"use client";

// Hooks
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSessions } from "@/hooks/useSessions";
import { useSession } from "@/context/SessionContext";
// Components
import Link from "next/link";
import { Button } from "../common/Button";
import { DropdownButton } from "../common/DropdownButton";
import { OptionDropdown } from "../common/OptionDropdown";
import { CreateSessionModal } from "./CreateSessionModal";
// Constants
import { NAV_LINKS } from "@/lib/constants";
// Icons
import { CakeSlice, Loader, Plus, Store } from "lucide-react";
import { Session } from "@/lib/types";

export function Sidebar() {
  // Estados
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Pathname
  const path = usePathname();

  // 1. Integracion de React Query
  const { sessions, isLoading, createSession } = useSessions();
  const { currentSessionId, setCurrentSessionId } = useSession();

  const currentSession =
    sessions.find((s) => s.id === currentSessionId) || null;

  // 2. Persistencia local de la sesion seleccionada
  useEffect(() => {
    if (!currentSessionId && sessions.length > 0) {
      // Si no hay nada seleccionado, tomamos la primera por defecto
      setCurrentSessionId(sessions[0].id || null);
    }
  }, [sessions, currentSessionId, setCurrentSessionId]);

  const handleSelectSession = (session: Session) => {
    setCurrentSessionId(session.id || null);
    setIsDropdownOpen(false);
  };

  const handleCreateSession = async (name: string) => {
    try {
      const newSession = await createSession(name);
      handleSelectSession(newSession);
      setIsModalOpen(false);
    } catch {
      throw new Error("Error al crear la sesion");
    }
  };

  const isActive = (href: string) => path === href;

  return (
    <aside
      className="fixed left-0 top-0 hidden md:flex flex-col gap-10 p-4 w-64 2xl:w-72 min-h-screen z-50 bg-white 
    border-r-2 border-primary-500"
    >
      <header className="flex items-center gap-2">
        <CakeSlice
          className="size-10 text-primary-50 p-2 bg-primary-600 rounded-xl"
          aria-hidden="true"
        />
        <h2 className="text-primary-600 font-bold text-lg">Dulces Ideas</h2>
      </header>

      <nav aria-label="Navegación principal">
        <ul className="flex flex-col gap-4">
          {NAV_LINKS.map(({ id, label, href, icon: Icon }) => (
            <li key={id}>
              <Link
                className={`flex items-center gap-4 p-3.5 rounded-xl transition-all duration-300 group hover-lift ${
                  isActive(href)
                    ? "bg-primary-600 text-primary-50 shadow-lg shadow-primary-600/20"
                    : "text-zinc-500 hover:bg-primary-50/50 hover:text-primary-600"
                }`}
                href={href}
              >
                <Icon
                  className="size-6 transition-transform group-hover:scale-110"
                  aria-hidden="true"
                />
                <span className="font-bold">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <footer className="mt-auto flex flex-col gap-4">
        <div className="relative">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 mb-1 block">
            Sesión Activa
          </label>
          <DropdownButton isOpen={isDropdownOpen} setIsOpen={setIsDropdownOpen}>
            {isLoading ? (
              <Loader
                size={18}
                className="size-4 animate-spin text-primary-500"
              />
            ) : (
              <Store size={18} className="text-primary-500 shrink-0" />
            )}
            <span className="truncate">
              {currentSession?.name ||
                (isLoading ? "Cargando..." : "Sin sesión")}
            </span>
          </DropdownButton>

          <OptionDropdown
            isOpen={isDropdownOpen}
            setIsOpen={setIsDropdownOpen}
            options={sessions}
            getLabel={(s) => s.name}
            onSelect={handleSelectSession}
            className="bottom-full mb-2 w-full"
            direction="up"
          />
        </div>

        <Button
          style="dashed"
          onClick={() => setIsModalOpen(true)}
          className="group w-full"
        >
          <Plus className="size-5 transition-transform group-hover:rotate-90" />
          <span>Nueva Sesión</span>
        </Button>
      </footer>

      <CreateSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCreateSession}
      />
    </aside>
  );
}
