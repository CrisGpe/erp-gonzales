import React from "react";
import { ManualsViewer } from "@/components/ManualsViewer";
import { BookOpen, Sparkles, Video, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Centro de Documentación & Manuales Oficiales v1.0 — Vaikuntha ERP",
  description: "Manuales operativos oficiales por rol, checklists de apertura y cierre, y videos demostrativos sincronizados con la arquitectura de Vaikuntha ERP.",
};

export default function ManualesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
          <BookOpen className="w-3.5 h-3.5 text-slate-600" />
          <span>Procedimientos Operativos Estándar (SOP v1.0)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-slate-950 tracking-tight">
          Centro de Documentación & Manuales por Rol
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Guías completas para inducción de personal, protocolos de mostrador, rutinas en estación móvil y supervisión de sede, sincronizadas directamente con la bóveda oficial de Obsidian.
        </p>
      </div>

      {/* Manuals Viewer Component */}
      <ManualsViewer />

    </div>
  );
}
