import React from "react";
import { SandboxLauncher } from "@/components/SandboxLauncher";
import { Sparkles, Play, Shield, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Sandbox Demo en Vivo (1-Clic) — Vaikuntha ERP",
  description: "Prueba Vaikuntha ERP en tiempo real sin registros. Selecciona entre Administrador, Soporte, Staff, Kiosko o Superadmin con datos simulados reales.",
};

export default function SandboxPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
          <Play className="w-3.5 h-3.5 fill-current text-emerald-600" />
          <span>Acceso Inmediato sin Fricción</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-slate-950 tracking-tight">
          Prueba el Sandbox Demo en Vivo
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Haz clic en cualquiera de los 5 roles canónicos para abrir una sesión interactiva en nuestro entorno de pruebas de Vercel con clientes, servicios y agenda precargada.
        </p>
      </div>

      {/* Launcher Component */}
      <SandboxLauncher />

    </div>
  );
}
