import React from "react";
import { PricingCalculator } from "@/components/PricingCalculator";
import { Calculator, ShieldCheck, Check, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Cotizador Interactivo & Precios — Vaikuntha ERP",
  description: "Calcula el costo mensual o anual de Vaikuntha ERP según el número de sedes, sillones de atención y módulos de hardware como Kiosko o Balanzas IoT.",
};

export default function PreciosPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
          <Calculator className="w-3.5 h-3.5 text-emerald-600" />
          <span>Planes Transparentes & Flexibles</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-slate-950 tracking-tight">
          Cotización en Tiempo Real
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Sin sorpresas ni cobros por colaborador registrado. Configura las sedes físicas y puestos de trabajo de tu negocio para obtener una propuesta inmediata.
        </p>
      </div>

      {/* Pricing Calculator Component */}
      <PricingCalculator />

      {/* FAQ Sección Precios */}
      <div className="max-w-3xl mx-auto pt-8 border-t border-slate-200/80 space-y-6">
        <h3 className="text-lg font-black text-slate-900 text-center">
          Preguntas Frecuentes sobre Facturación
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1.5">
            <h4 className="font-extrabold text-slate-800">
              ¿Hay límite de usuarios de Soporte o Staff?
            </h4>
            <p className="text-slate-500 leading-relaxed">
              No. Puedes crear todos los usuarios que tu negocio requiera. Solo cobramos por sedes y estaciones de trabajo activas concurrentes.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1.5">
            <h4 className="font-extrabold text-slate-800">
              ¿Cómo se realiza el cobro de SUNAT PSE?
            </h4>
            <p className="text-slate-500 leading-relaxed">
              Incluye emisión ilimitada de Boletas y Facturas electrónicas con envío automático, almacenamiento seguro y certificado digital homologado.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1.5">
            <h4 className="font-extrabold text-slate-800">
              ¿Qué incluye el aprovisionamiento inicial?
            </h4>
            <p className="text-slate-500 leading-relaxed">
              El Kit Maestro de Excel (15 hojas) para cargar sedes, clientes, inventario inicial, puestos y esquemas de comisiones en menos de 15 minutos.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1.5">
            <h4 className="font-extrabold text-slate-800">
              ¿Puedo pausar o agregar sedes más adelante?
            </h4>
            <p className="text-slate-500 leading-relaxed">
              Sí, puedes aumentar o reducir puestos y sedes en cualquier momento con ajuste proporcional en tu siguiente ciclo de facturación.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
