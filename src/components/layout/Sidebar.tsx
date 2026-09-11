"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSessions } from "@/hooks/api/useSessions";
import { useSession } from "@/context/SessionContext";
import Link from "next/link";
import { Button } from "@/components/common/Button";
import { DropdownButton } from "@/components/common/DropdownButton";
import { OptionDropdown } from "@/components/common/OptionDropdown";
import { CreateSessionModal } from "@/components/layout/CreateSessionModal";
import { ConfirmDeleteModal } from "@/components/common/ConfirmDeleteModal";
import { CurrencyConverterModal } from "@/components/common/CurrencyConverterModal";
import { NAV_LINKS } from "@/shared/config/constants";
import {
  ArrowUpDown,
  CakeSlice,
  Loader,
  LogOut,
  Plus,
  Store,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { Session } from "@/shared/types";
import { useStore } from "@/context/StoreContext";

export function Sidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConverterOpen, setIsConverterOpen] = useState(false);

  const path = usePathname();
  const { sessions, isLoading, createSession, deleteSession, isDeleting } =
    useSessions();
  const {
    currentSessionId,
    setCurrentSessionId,
    isLoading: isSessionLoading,
  } = useSession();
  const { logoutFromStore, activeStore } = useStore();

  const currentSession =
    sessions.find((s) => s.id === currentSessionId) || null;

  useEffect(() => {
    if (!isSessionLoading && !currentSessionId && sessions.length > 0) {
      setCurrentSessionId(sessions[0].id || null);
    }
  }, [sessions, currentSessionId, setCurrentSessionId, isSessionLoading]);

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

  const handleDeleteSession = async () => {
    if (!currentSessionId) return;
    try {
      await deleteSession(currentSessionId);
      setCurrentSessionId(null);
      setIsDeleteModalOpen(false);
    } catch {
      alert("Error al eliminar la sesión");
    }
  };

  const isActive = (href: string) => path === href;

  return (
    <aside className="fixed left-0 top-0 hidden md:flex flex-col p-3 w-56 min-h-screen z-50 bg-white border-r-2 border-primary-500">
      {/* Header */}
      <header className="flex items-center gap-2 px-2 mb-2">
        <CakeSlice
          className="size-8 text-primary-50 p-1.5 bg-primary-600 rounded-lg"
          aria-hidden="true"
        />
        <h2 className="text-primary-600 font-bold text-sm truncate">
          {activeStore?.name}
        </h2>
      </header>

      {/* Nav */}
      <nav aria-label="Navegación principal" className="flex-1">
        <ul className="flex flex-col gap-3 mt-4">
          {NAV_LINKS.map(({ id, label, href, icon: Icon }) => (
            <li key={id}>
              <Link
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive(href)
                    ? "bg-primary-600 text-white shadow-md shadow-primary-600/20"
                    : "text-zinc-500 hover:bg-primary-50 hover:text-primary-600"
                }`}
                href={href}
              >
                <Icon className="size-5 shrink-0" aria-hidden="true" />
                <span className="font-semibold text-sm">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <footer className="flex flex-col gap-2 mt-2">
        {/* Session selector */}
        <div className="relative">
          <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1 mb-0.5 block">
            Sesión
          </label>
          <DropdownButton isOpen={isDropdownOpen} setIsOpen={setIsDropdownOpen}>
            {isLoading ? (
              <Loader size={14} className="animate-spin text-primary-500" />
            ) : (
              <Store size={14} className="text-primary-500 shrink-0" />
            )}
            <span className="truncate text-sm">
              {currentSession?.name ||
                (isLoading ? "Cargando..." : "Sin sesión")}
            </span>
            <ChevronDown size={12} className="ml-auto text-zinc-400" />
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

        {/* Action buttons row */}
        <div className="flex gap-1.5">
          <Button
            style="dashed"
            onClick={() => setIsModalOpen(true)}
            className="flex-1 h-8 text-xs"
          >
            <Plus className="size-3.5" />
            <span>Nueva</span>
          </Button>

          <button
            onClick={() => setIsConverterOpen(true)}
            className="flex items-center justify-center h-8 px-2 text-zinc-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all border border-zinc-100 hover:border-primary-200"
            title="Calculadora Divisas"
          >
            <ArrowUpDown className="size-3.5" />
          </button>

          {currentSessionId && (
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center justify-center h-8 px-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all border border-zinc-100 hover:border-red-200"
              title="Eliminar Sesión"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={logoutFromStore}
          className="flex items-center justify-center gap-2 py-2 w-full text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all font-semibold text-xs border border-transparent hover:border-red-100"
        >
          <LogOut className="size-3.5" />
          <span>Cerrar Sistema</span>
        </button>
      </footer>

      <CreateSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCreateSession}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteSession}
        title="¿Eliminar Sesión?"
        message="Esta acción eliminará permanentemente TODOS los datos de esta sesión incluyendo ventas, encargos y cierres. No se podrá recuperar."
        isPending={isDeleting}
      />

      <CurrencyConverterModal
        isOpen={isConverterOpen}
        onClose={() => setIsConverterOpen(false)}
      />
    </aside>
  );
}
