"use client";

import React, { useState } from "react";
import { 
  CheckSquare, Square, Play, BookOpen, Sparkles, 
  Layers, Clock, ShieldCheck, ChevronRight, Video, FileText 
} from "lucide-react";
import { MANUALES_DATA, ManualDoc } from "@/data/manualesData";

export function ManualsViewer() {
  const [activeManualId, setActiveManualId] = useState<string>("soporte");
  const [completedChecks, setCompletedChecks] = useState<Record<string, boolean>>({});

  const activeManual = MANUALES_DATA.find((m) => m.id === activeManualId) || MANUALES_DATA[2];

  const toggleCheck = (id: string) => {
    setCompletedChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8">
      
      {/* Selector de los 6 Roles Canónicos */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {MANUALES_DATA.map((manual) => {
          const isActive = manual.id === activeManualId;
          return (
            <button
              key={manual.id}
              type="button"
              onClick={() => setActiveManualId(manual.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition shrink-0 cursor-pointer ${
                isActive
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:border-slate-300"
              }`}
            >
              <span>{manual.icono}</span>
              <span>{manual.numero}. {manual.rol}</span>
            </button>
          );
        })}
      </div>

      {/* Contenedor Principal del Manual Activo */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
        
        {/* Cabecera del Manual */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">{activeManual.icono}</span>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                Procedimiento Operativo Oficial (SOP v1.0)
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                Nivel {activeManual.nivelAcceso}
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {activeManual.titulo}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {activeManual.subtitulo}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto shrink-0 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-100 text-xs">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600 font-medium">
              Tiempo de Lectura: <strong>{activeManual.duracionEstimadaMin} min</strong>
            </span>
          </div>
        </div>

        {/* Video Demostrativo Embebido / Simulado */}
        <div className="bg-slate-950 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-2 max-w-lg">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                Video Demostrativo Guiado
              </span>
            </div>
            <h3 className="text-lg font-black text-white">
              Walkthrough en Video: Operación del Rol {activeManual.rol}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Descubre en menos de {activeManual.duracionEstimadaMin} minutos cómo desenvolverse en este perfil en situaciones reales de salón o centro de servicios.
            </p>
          </div>

          <button
            type="button"
            onClick={() => alert(`Iniciando reproducción de video tutorial para el rol: ${activeManual.rol}`)}
            className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-black shadow-md transition flex items-center gap-2.5 cursor-pointer shrink-0"
          >
            <Play className="w-4 h-4 fill-current text-emerald-600" />
            <span>Ver Demostración en Video</span>
          </button>
        </div>

        {/* Filosofía & Propósito */}
        <div className="bg-emerald-50/50 border border-emerald-200/70 rounded-2xl p-5 space-y-1.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <h4 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider">
              Filosofía & Causa Raíz
            </h4>
          </div>
          <p className="text-xs text-emerald-900/80 leading-relaxed">
            {activeManual.filosofia}
          </p>
        </div>

        {/* Checklists Operativos */}
        <div className="space-y-4">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-slate-700" />
            <span>Checklists Operativos de Apertura & Cierre</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeManual.checklists.map((chk, idx) => (
              <div key={idx} className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                <h5 className="text-xs font-extrabold text-slate-800">
                  {chk.titulo}
                </h5>
                <ul className="space-y-2">
                  {chk.items.map((item, itemIdx) => {
                    const checkKey = `${activeManual.id}-${idx}-${itemIdx}`;
                    const isChecked = !!completedChecks[checkKey];
                    return (
                      <li
                        key={itemIdx}
                        onClick={() => toggleCheck(checkKey)}
                        className="flex items-start gap-2.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer select-none"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        )}
                        <span className={isChecked ? "line-through text-slate-400" : ""}>
                          {item}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Módulos Clave Paso a Paso */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-700" />
            <span>Procedimientos Operativos Paso a Paso</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeManual.modulosClave.map((mod, modIdx) => (
              <div key={modIdx} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                <div>
                  <h5 className="text-xs font-extrabold text-slate-900">
                    {mod.nombre}
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {mod.descripcion}
                  </p>
                </div>

                <ol className="space-y-1.5 pt-2 border-t border-slate-100">
                  {mod.pasos.map((paso, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {pIdx + 1}
                      </span>
                      <span>{paso}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
