"use client";

// Components
import { Sidebar } from "./Sidebar";

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:pl-64">{children}</main>
    </div>
  );
}
