"use client";

import React, { useState } from "react";
import { 
  Play, ExternalLink, ShieldCheck, Check, Sparkles, 
  ArrowRight, Users, Laptop, Smartphone, Terminal, HelpCircle
} from "lucide-react";
import { SANDBOX_PROFILES, SandboxProfile, ERP_BASE_URL } from "@/data/sandboxProfiles";

export function SandboxLauncher() {
  const [selectedProfile, setSelectedProfile] = useState<SandboxProfile>(SANDBOX_PROFILES[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [leadForm, setLeadForm] = useState({
    nombre: "",
    negocio: "",
    whatsapp: "",
    tipoServicio: "Salon/Spa",
    sedes: "1"
  });
  const [submitted, setSubmitted] = useState(false);

  const handleLaunch = (profile: SandboxProfile) => {
    // Redirige al ERP en Vercel pasando los parámetros de login rápido
    const url = `${profile.rutaDemo}?demo_role=${profile.rolCodigo}&demo_email=${encodeURIComponent(profile.loginRapido.email)}`;
    window.open(url, "_blank");
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setModalOpen(false);
      // Abrir WhatsApp con los datos
      const texto = `Hola, solicito Onboarding Guiado para Vaikuntha ERP.%0A- Nombre: ${leadForm.nombre}%0A- Negocio: ${leadForm.negocio}%0A- Tipo: ${leadForm.tipoServicio}%0A- Sedes: ${leadForm.sedes}`;
      window.open(`https://wa.me/51987654321?text=${texto}`, "_blank");
    }, 1200);
  };

  return (
    <div className="space-y-10">
      
      {/* Banner de Información */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Entorno Sandbox en Vivo
            </span>
          </div>
          <h3 className="text-base font-extrabold text-slate-900">
            Sin registros previos ni descargas: Prueba el ERP con datos reales simulados
          </h3>
          <p className="text-xs text-slate-600">
            El entorno cuenta con clientes (Mariana, Claudia, Diego), agenda en tiempo real, catálogos de servicios y cuentas bancarias precargadas.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="shrink-0 px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Solicitar Onboarding Guiado</span>
        </button>
      </div>

      {/* Grid de los 5 Roles Canónicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SANDBOX_PROFILES.map((profile) => {
          const isSelected = selectedProfile.id === profile.id;
          return (
            <div
              key={profile.id}
              onClick={() => setSelectedProfile(profile)}
              className={`rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/10"
                  : "bg-white/70 hover:bg-white border-slate-200 hover:border-slate-300 shadow-xs"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border uppercase tracking-wider ${profile.badgeColor}`}>
                    {profile.badge}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    {profile.id === "staff" ? <Smartphone className="w-3.5 h-3.5" /> : <Laptop className="w-3.5 h-3.5" />}
                    {profile.dispositivo}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-slate-900">
                    {profile.titulo}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {profile.subtitulo}
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {profile.descripcion}
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Qué probarás en el Sandbox:
                  </span>
                  {profile.responsabilidades.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-600">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botón de Lanzamiento Directo */}
              <div className="pt-5 mt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLaunch(profile);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                  <span>Probar Rol {profile.rolCodigo} en Vivo</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal Lead Capture: Onboarding Guiado */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div>
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                Acompañamiento VIP
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-2">
                Solicita una Sesión de Onboarding Guiado
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Un especialista te mostrará cómo cargar las sedes con el Libro Maestro de Excel y cómo configurar la matriz de delegación para tu equipo.
              </p>
            </div>

            <form onSubmit={handleLeadSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Carmen Montenegro"
                  value={leadForm.nombre}
                  onChange={(e) => setLeadForm({ ...leadForm, nombre: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre del Negocio
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Salón & Spa Lumina"
                  value={leadForm.negocio}
                  onChange={(e) => setLeadForm({ ...leadForm, negocio: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+51 987 654 321"
                    value={leadForm.whatsapp}
                    onChange={(e) => setLeadForm({ ...leadForm, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    N° de Sedes
                  </label>
                  <select
                    value={leadForm.sedes}
                    onChange={(e) => setLeadForm({ ...leadForm, sedes: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-medium bg-white"
                  >
                    <option value="1">1 Sede</option>
                    <option value="2-3">2 a 3 Sedes</option>
                    <option value="4+">4+ Sedes (Cadena)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitted}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                >
                  {submitted ? "Enviando..." : "Confirmar por WhatsApp"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
