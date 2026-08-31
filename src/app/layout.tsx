import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vaikuntha ERP — El Sistema Operativo para Negocios de Servicios",
  description: "Resuelve la rotación de personal y la curva de aprendizaje mediante Workspaces y Empoderamiento Progresivo. Desktop, Móvil Staff, Tótem Kiosko y Balanzas IoT.",
  keywords: ["ERP para salones", "Software de belleza", "WFM", "Workspaces", "Facturación SUNAT PSE", "Punto de Venta Salón", "Gestión de Estilistas"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
