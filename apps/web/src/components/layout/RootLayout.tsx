"use client";

// Components
import { Sidebar } from "./Sidebar";

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 max-w-9/12 mx-auto py-6">{children}</main>
    </div>
  );
}
