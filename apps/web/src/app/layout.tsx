import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { RootLayout as RootLayoutComponent } from "@/components/layout/RootLayout";

const montserrat = Montserrat({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dulces Ideas",
  description: "Gestion de ventas, encargos y reportes",
  icons: {
    icon: "/dulces-ideas-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${montserrat.className} antialiased`}>
        <RootLayoutComponent>{children}</RootLayoutComponent>
      </body>
    </html>
  );
}
