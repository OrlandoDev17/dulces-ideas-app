"use client";

// Contexts
import { useSession } from "@/contexts/SessionContext";
// Hooks
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
// Components
import Link from "next/link";
import { DropdownButton } from "../common/DropdownButton";
import { OptionDropdown } from "../common/OptionDropdown";
import { CreateSessionModal } from "./CreateSessionModal";
// Constants
import { NAV_LINKS } from "@/lib/constants";
// Icons
import { CakeSlice, Plus, Store } from "lucide-react";

export function Sidebar() {
  // Estados
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Pathname
  const path = usePathname();

  // Context
  const {
    sessions,
    currentSession,
    loading,
    error,
    createSession,
    fetchSession,
    setCurrentSession,
  } = useSession();

  useEffect(() => {
    fetchSession();
  }, []);

  const handleCreateSession = async (name: string) => {
    const session = await createSession(name);
    if (session) {
      setIsModalOpen(false);
    }
  };

  const isActive = (href: string) => path === href;

  return (
    <aside className="fixed left-0 top-0 hidden md:flex flex-col gap-10 p-4 w-64 min-h-screen z-100 bg-white border-r-2 border-primary-500">
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
            <Store size={18} className="text-primary-500 shrink-0" />
            <span className="truncate">
              {currentSession?.name || "Selecciona una sesión"}
            </span>
          </DropdownButton>

          <div className="absolute bottom-full left-0 mb-2 w-full">
            <OptionDropdown
              isOpen={isDropdownOpen}
              setIsOpen={setIsDropdownOpen}
              options={sessions}
              getLabel={(s) => s.name}
              onSelect={(s) => setCurrentSession(s)}
            />
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="group flex items-center justify-center gap-2 p-4 bg-primary-50 rounded-2xl border-2 border-dashed border-primary-200 text-primary-600 font-bold hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all duration-300"
        >
          <Plus className="size-5 transition-transform group-hover:rotate-90" />
          <span>Nueva Sesión</span>
        </button>
      </footer>

      <CreateSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCreateSession}
        loading={loading}
        error={error}
      />
    </aside>
  );
}
