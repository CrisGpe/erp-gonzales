"use client";

import React, { useState } from "react";
import { 
  Check, Sparkles, Building2, Armchair, Receipt, 
  Monitor, Scale, ArrowRight, MessageCircle 
} from "lucide-react";

export function PricingCalculator() {
  const [sedes, setSedes] = useState(1);
  const [sillones, setSillones] = useState(6);
  const [anual, setAnual] = useState(true);
  const [addonSunat, setAddonSunat] = useState(true);
  const [addonKiosk, setAddonKiosk] = useState(false);
  const [addonBalanza, setAddonBalanza] = useState(true);

  // Cálculo de Precios Base (PEN)
  // Base por sede: S/ 180 / mes (incluye 3 sillones, soporte ilimitado, workspaces)
  // Sillón adicional: S/ 25 / mes
  const baseSede = sedes * 180;
  const sillonesExtra = Math.max(0, sillones - (sedes * 3)) * 25;
  const costoSunat = addonSunat ? sedes * 60 : 0;
  const costoKiosk = addonKiosk ? sedes * 45 : 0;
  const costoBalanza = addonBalanza ? sedes * 50 : 0;

  const subtotalMensual = baseSede + sillonesExtra + costoSunat + costoKiosk + costoBalanza;
  const totalMensual = anual ? Math.round(subtotalMensual * 0.8) : subtotalMensual;
  const totalUSD = Math.round(totalMensual / 3.75);

  const handleShareWhatsapp = () => {
    const texto = `Hola, he realizado una cotización en vaikuntha.pe:%0A- Sedes: ${sedes}%0A- Sillones / Puestos: ${sillones}%0A- Facturación SUNAT: ${addonSunat ? 'Sí' : 'No'}%0A- Módulo Kiosko: ${addonKiosk ? 'Sí' : 'No'}%0A- Balanza IoT: ${addonBalanza ? 'Sí' : 'No'}%0A- Facturación: ${anual ? 'Anual (-20% dcto)' : 'Mensual'}%0A*Total Estimado: S/ ${totalMensual} / mes* ($${totalUSD} USD).%0AMe gustaría coordinar la contratación y aprovisionamiento.`;
    window.open(`https://wa.me/51987654321?text=${texto}`, "_blank");
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xs max-w-4xl mx-auto space-y-10">
      
      {/* Header & Toggle Anual */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
            Cotizador Transparente
          </span>
          <h3 className="text-xl font-black text-slate-900 mt-2">
            Calcula tu Plan según el Tamaño de tu Operación
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Cero costos ocultos por usuario. Solo pagas por sedes y estaciones físicas activas.
          </p>
        </div>

        {/* Switch Facturación */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setAnual(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              !anual ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Mensual
          </button>
          <button
            type="button"
            onClick={() => setAnual(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              anual ? "bg-emerald-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>Anual</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-700 text-emerald-100 font-extrabold uppercase">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Slider 1: Sedes */}
        <div className="space-y-3 bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <label className="text-xs font-bold text-slate-800">
                Número de Sedes Físicas
              </label>
            </div>
            <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100">
              {sedes} {sedes === 1 ? "Sede" : "Sedes"}
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={sedes}
            onChange={(e) => {
              const val = Number(e.target.value);
              setSedes(val);
              if (sillones < val * 3) setSillones(val * 3);
            }}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
            <span>1 Sede</span>
            <span>5 Sedes</span>
            <span>10+ Sedes</span>
          </div>
        </div>

        {/* Slider 2: Sillones / Estaciones */}
        <div className="space-y-3 bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Armchair className="w-4 h-4 text-emerald-600" />
              <label className="text-xs font-bold text-slate-800">
                Puestos de Trabajo (Sillones / Cabinas)
              </label>
            </div>
            <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100">
              {sillones} Estaciones
            </span>
          </div>

          <input
            type="range"
            min={sedes * 2}
            max="40"
            step="1"
            value={sillones}
            onChange={(e) => setSillones(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
            <span>{sedes * 2} Mínimo</span>
            <span>20 Estaciones</span>
            <span>40+ Estaciones</span>
          </div>
        </div>

      </div>

      {/* Módulos Adicionales (Checkboxes) */}
      <div className="space-y-3">
        <span className="text-xs font-extrabold text-slate-900 block">
          Módulos de Hardware & Fiscalidad:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          
          <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
            addonSunat ? "bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-400/20" : "bg-white border-slate-200 hover:border-slate-300"
          }`}>
            <input
              type="checkbox"
              checked={addonSunat}
              onChange={(e) => setAddonSunat(e.target.checked)}
              className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <div>
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                SUNAT PSE Oficial
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Boletas y Facturas ilimitadas con hash SHA-256. (+S/ 60/mes)
              </span>
            </div>
          </label>

          <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
            addonBalanza ? "bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-400/20" : "bg-white border-slate-200 hover:border-slate-300"
          }`}>
            <input
              type="checkbox"
              checked={addonBalanza}
              onChange={(e) => setAddonBalanza(e.target.checked)}
              className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <div>
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-emerald-600" />
                Balanzas IoT en Gramos
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Tara y pesaje en vivo de fórmulas químicas en taller. (+S/ 50/mes)
              </span>
            </div>
          </label>

          <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
            addonKiosk ? "bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-400/20" : "bg-white border-slate-200 hover:border-slate-300"
          }`}>
            <input
              type="checkbox"
              checked={addonKiosk}
              onChange={(e) => setAddonKiosk(e.target.checked)}
              className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <div>
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Monitor className="w-3.5 h-3.5 text-emerald-600" />
                Tótem Kiosko Lobby
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Check-in DNI, bar de cortesía y marcación PIN. (+S/ 45/mes)
              </span>
            </div>
          </label>

        </div>
      </div>

      {/* Resumen de Precio & Call to Action */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider">
            Inversión Mensual Estimada
          </span>
          <div className="flex items-baseline justify-center md:justify-start gap-2">
            <span className="text-4xl font-black tracking-tight text-white">
              S/ {totalMensual.toLocaleString("es-PE")}
            </span>
            <span className="text-slate-400 text-xs font-bold">
              / mes {anual && "(facturado anualmente)"}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Aprox. <strong>${totalUSD} USD / mes</strong>. Incluye soporte continuo, actualizaciones del motor y aprovisionamiento con Kit Maestro Excel.
          </p>
        </div>

        <button
          type="button"
          onClick={handleShareWhatsapp}
          className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Enviar Cotización por WhatsApp</span>
        </button>
      </div>

    </div>
  );
}
