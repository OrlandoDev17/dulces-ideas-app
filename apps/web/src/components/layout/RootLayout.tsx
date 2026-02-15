"use client";

// Components
import { Sidebar } from "./Sidebar";

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 2xl:ml-72 px-4 2xl:px-12 py-2">
        {children}
      </main>
    </div>
  );
}
