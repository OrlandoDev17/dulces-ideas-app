"use client";

// Hooks
import { usePathname } from "next/navigation";
// Components
import Link from "next/link";
//Constants
import { NAV_LINKS } from "@/lib/constants";
//Icons
import { CakeSlice } from "lucide-react";

export function Sidebar() {
  const path = usePathname();

  const isActive = (href: string) => path === href;

  return (
    <aside className="fixed left-0 top-0 hidden md:flex flex-col gap-12 p-4 w-64 2xl:w-72 h-screen z-100 bg-white border-r-2 border-primary-500">
      <header className="flex items-center gap-2">
        <CakeSlice
          className="size-10 2xl:size-12 text-primary-50 p-2 bg-primary-600 rounded-xl"
          aria-hidden="true"
        />
        <h2 className="text-primary-600 font-bold text-lg 2xl:text-xl">
          Dulces Ideas
        </h2>
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
                  className="size-5 2xl:size-7 transition-transform group-hover:scale-110"
                  aria-hidden="true"
                />
                <span className="text-base 2xl:text-lg font-bold">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
