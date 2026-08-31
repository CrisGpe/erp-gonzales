"use client";

import React, { useState } from "react";
import { 
  Phone, Mail, MessageCircle, Clock, MapPin, 
  Send, Sparkles, CheckCircle2, ShieldCheck, ArrowRight 
} from "lucide-react";

export default function ContactoPage() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    negocio: "",
    mensaje: "",
  });
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
    setTimeout(() => {
      setEnviado(false);
      const texto = `Hola, contacto desde vaikuntha.pe:%0A- Nombre: ${form.nombre}%0A- Email: ${form.email}%0A- Teléfono: ${form.telefono}%0A- Negocio: ${form.negocio}%0A- Mensaje: ${form.mensaje}`;
      window.open(`https://wa.me/51987654321?text=${texto}`, "_blank");
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Atención Directa & Demostraciones</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-slate-950 tracking-tight">
          Hablemos de tu Operación
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          ¿Tienes dudas sobre cómo implementar los Workspaces, integrar tus balanzas químicas o migrar desde un sistema anterior? Estamos para ayudarte.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Canales Directos (Columna Izquierda 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="text-lg font-black text-slate-900">
              Canales Comerciales Directos
            </h3>

            <div className="space-y-4">
              <a
                href="https://wa.me/51987654321?text=Hola%20deseo%20coordinar%20una%20demostración%20de%20Vaikuntha%20ERP"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3.5 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 hover:bg-emerald-100/60 transition group cursor-pointer"
              >
                <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-900 block">
                    WhatsApp Comercial & Demos
                  </span>
                  <span className="text-xs text-emerald-700 font-semibold">
                    +51 987 654 321
                  </span>
                  <span className="text-[11px] text-emerald-600/80 block mt-0.5">
                    Respuesta promedio en menos de 15 minutos.
                  </span>
                </div>
              </a>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-xs">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Correo Corporativo
                  </span>
                  <span className="text-xs text-slate-600 font-semibold">
                    contacto@vaikuntha.pe
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Para propuestas institucionales y licencias multi-sede.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-xs">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Horario de Atención
                  </span>
                  <span className="text-xs text-slate-600 font-medium">
                    Lunes a Sábado: 8:00 AM – 8:00 PM
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Guardia de soporte 24/7 para cajas en producción.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de Contacto (Columna Derecha 7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xs">
            <div>
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                Mensaje Rápido
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                Envíanos una Consulta
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Te responderemos directamente a tu correo o WhatsApp con la información solicitada.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tu Nombre
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Rodrigo Morales"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre de tu Salón / Centro
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Studio Capilar San Isidro"
                    value={form.negocio}
                    onChange={(e) => setForm({ ...form, negocio: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-600 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="rodrigo@empresa.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+51 987 654 321"
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ¿En qué podemos ayudarte?
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Cuéntanos cuántas sedes tienes actualmente, cuántos estilistas atienden o qué sistema usas hoy..."
                  value={form.mensaje}
                  onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-600 font-medium resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={enviado}
                  className="w-full py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-emerald-400" />
                  <span>{enviado ? "Redirigiendo a WhatsApp..." : "Enviar Mensaje Directo"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
