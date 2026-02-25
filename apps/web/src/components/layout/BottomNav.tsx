"use client";

import { NAV_LINKS } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const path = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full h-20 z-800 bg-white border-t-2 border-primary-500 flex justify-around items-center">
      {NAV_LINKS.map(({ id, label, href, icon: Icon }) => (
        <Link
          className={`flex flex-col items-center gap-1 hover:text-primary-700 transition-colors ${path === href ? "text-primary-700" : "text-zinc-500"}`}
          key={id}
          href={href}
        >
          <Icon className="size-7" />
          <span className="text-xs font-semibold">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
