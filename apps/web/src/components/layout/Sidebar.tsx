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
    <aside className="hidden md:flex flex-col gap-12 p-4 w-72 h-screen z-100 bg-white border-r-2 border-primary">
      <header className="flex items-center gap-2">
        <CakeSlice className="text-cream p-2 bg-primary rounded-xl" size={48} />
        <h3 className="text-primary font-bold text-xl">Dulces Ideas</h3>
      </header>
      <nav>
        <ul className="flex flex-col gap-4">
          {NAV_LINKS.map(({ id, label, href, icon: Icon }) => (
            <li key={id}>
              <Link
                className={`flex items-center gap-4 p-3.5 rounded-xl transition-colors duration-200 ${
                  isActive(href)
                    ? "bg-primary text-cream"
                    : "text-zinc-600 hover:bg-zinc-200 hover:text-primary"
                }`}
                href={href}
              >
                <Icon className="size-7" />
                <span className="text-lg font-semibold">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
