"use client";

import { BottomNav } from "./BottomNav";
// Components
import { Sidebar } from "./Sidebar";
import { SessionProvider } from "@/contexts/SessionContext";

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 pb-24 md:pb-0 md:pl-64">{children}</main>
        <BottomNav />
      </div>
    </SessionProvider>
  );
}
