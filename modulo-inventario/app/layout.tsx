import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Módulo Inventario",
  description: "Sistema de gestión de inventario",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-background">{children}</body>
    </html>
  );
}
