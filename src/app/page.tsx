import React from "react";
import Link from "next/link";
import { 
  Sparkles, Play, ArrowRight, CheckCircle2, Shield, 
  Smartphone, Laptop, Monitor, Scale, Layers, Users, 
  Clock, Zap, Check, ChevronRight, FileSpreadsheet, Building2 
} from "lucide-react";
import { ERP_BASE_URL } from "@/data/sandboxProfiles";

export default function HomePage() {
  return (
    <div className="space-y-24 pb-20">

      {/* =========================================================================
          1. HERO SECTION
      ========================================================================= */}
      <section className="relative overflow-hidden pt-16 pb-12 sm:pt-24 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          
          {/* Badge superior */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-bold text-emerald-800 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Vaikuntha ERP v2.1 • El Paradigma de Workspaces</span>
          </div>

          {/* Titular Principal */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-slate-950 tracking-tight leading-[1.1]">
            El Sistema Operativo que resuelve la{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600">
              rotación de personal
            </span>{" "}
            en negocios de servicios.
          </h1>

          {/* Subtítulo */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            En lugar de software saturado de opciones imposibles de aprender, Vaikuntha estructura la operación en <strong>Workspaces de mínima fricción</strong>. Tu nuevo equipo genera valor desde su primer día, mientras tú desbloqueas herramientas de confianza progresivamente.
          </p>

          {/* CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/sandbox"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current text-emerald-400" />
              <span>Probar Sandbox Demo en Vivo</span>
            </Link>

            <Link
              href="/precios"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-xs hover:border-slate-300 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Calcular Cotización</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          {/* Proof points */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Cero tarjetas de crédito para el demo</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Datos reales simulados</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>SUNAT PSE Homologado</span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          2. MÉTRICAS DE ALTO IMPACTO
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900">
              15 min
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Aprovisionamiento de sede con Kit Maestro Excel
            </p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-600">
              &lt;400ms
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Búsqueda y check-in ultrarrápido por DNI
            </p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-indigo-600">
              0 gramos
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Desperdicio químico con Balanzas IoT
            </p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900">
              6 Roles
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Paradigma canónico sin silos rígidos
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. EL MANIFIESTO: POR QUÉ WORKSPACES
      ========================================================================= */}
      <section id="filosofia" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider">
            Filosofía & Causa Raíz
          </span>
          <h2 className="text-3xl font-heading font-black text-slate-900 tracking-tight">
            La Realidad de los Negocios de Servicios
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            En salones, spas y centros de estética, la rotación de anfitriones y cajeros es una constante. Los softwares tradicionales fallan porque exigen semanas de capacitación.
          </p>
        </div>

        {/* Comparativa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Tarjeta Tradicional */}
          <div className="bg-rose-50/40 border border-rose-200/80 rounded-3xl p-8 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 uppercase tracking-wider">
                El Modelo Tradicional Rígido
              </span>
              <span className="text-xl">❌</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Silos Estancos ("Solo Cajero" o "Solo Recepcionista")
            </h3>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">•</span>
                <span>Curva de aprendizaje de 3 a 4 semanas para que un recién contratado use el software.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">•</span>
                <span>Si el cajero falta un día, nadie más sabe operar la facturación ni el arqueo.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">•</span>
                <span>Pantallas saturadas con decenas de menús irrelevantes para quien solo necesita recibir clientes.</span>
              </li>
            </ul>
          </div>

          {/* Tarjeta Vaikuntha */}
          <div className="bg-emerald-50/40 border border-emerald-300 rounded-3xl p-8 space-y-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                El Paradigma Vaikuntha ERP
              </span>
              <span className="text-xl">✨</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Workspaces + Empoderamiento Adaptativo
            </h3>
            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Rol Único de Soporte</strong>: Todo el equipo de apoyo opera en lienzos virtuales de baja fricción desde su primer día.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Desbloqueo Progresivo</strong>: Tras superar el período de prueba, el Administrador le activa herramientas avanzadas (arqueo ciego, kardex, CRM).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Resiliencia Total</strong>: Si alguien rota o falta, cualquier integrante de Soporte puede asumir mostrador o cobranza de inmediato.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* =========================================================================
          4. ECOSISTEMA DE DISPOSITIVOS & HARDWARE
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
            Hardware & Experiencia Omnicanal
          </span>
          <h2 className="text-3xl font-heading font-black text-slate-900 tracking-tight">
            Diseñado para los Dispositivos Reales de tu Sede
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Cada rol cuenta con la interfaz idónea para su entorno físico: desde la pantalla táctil de mostrador hasta el smartphone del estilista.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Dispositivo 1 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit">
              <Laptop className="w-6 h-6" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900">
              Workspaces de Mostrador
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Lienzos limpios para Recepción (check-in y cola de espera), Venta POS (split-billing y boletas SUNAT) y Taller.
            </p>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">
              Para: Rol Soporte & Admin
            </span>
          </div>

          {/* Dispositivo 2 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-fit">
              <Smartphone className="w-6 h-6" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900">
              Suite Móvil Staff (PWA)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Los especialistas reciben órdenes en su teléfono, consultan fichas técnicas, piden insumos químicos y liquidan comisiones.
            </p>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">
              Para: Rol Staff en Sillón
            </span>
          </div>

          {/* Dispositivo 3 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-fit">
              <Monitor className="w-6 h-6" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900">
              Tótem Kiosko en Lobby
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Autoservicio para clientas (anuncio de llegada por DNI, cortesías del bar, puntos) y switch a marcación staff con PIN.
            </p>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">
              Para: Rol Kiosk & Clientes
            </span>
          </div>

          {/* Dispositivo 4 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl w-fit">
              <Scale className="w-6 h-6" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900">
              Balanzas Químicas IoT
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Metrología de precisión con tara y pesaje al gramo. Controla consumos de tintes y oxidantes en tiempo real.
            </p>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">
              Para: Workspace Taller / Lab
            </span>
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. MOTOR AGNÓSTICO: SERVICIOS, PERSONAS Y BIENES
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase tracking-wider">
              Arquitectura Universal
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black tracking-tight">
              Un Motor Agnóstico Aplicable a Cualquier Industria de Servicios
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Aunque nació y se prueba intensamente en salones de belleza y spas, su núcleo está diseñado para gestionar con precisión matemática:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
            <div className="space-y-2">
              <span className="text-emerald-400 font-bold text-sm block">
                1. Gestión de Servicios
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Catálogo con duración estimada, costo base, precio de venta, comisiones sugeridas y tiempos de pose en estaciones físicas.
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-indigo-400 font-bold text-sm block">
                2. Gestión de Personas
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clientes con historial unificado de visitas y preferencias CRM. Colaboradores con control de turnos WFM y contratos remunerativos flexibles.
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-purple-400 font-bold text-sm block">
                3. Las 7 Categorías de Bienes
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clasificación inequívoca entre Retail comercial, Insumos consumidos en servicio, Repuestos, Equipos, Materiales y Mobiliario.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. LA RUTA DEL CLIENTE: ONBOARDING EN 3 PASOS
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider">
            Aprovisionamiento Guiado
          </span>
          <h2 className="text-3xl font-heading font-black text-slate-900 tracking-tight">
            De Cero a Operar en Menos de 15 Minutos
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Sin complejas configuraciones de semanas. Importa la estructura completa de tu sede respetando la jerarquía relacional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-xs">
            <span className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">
              1
            </span>
            <h4 className="text-base font-extrabold text-slate-900">
              Descarga el Libro Maestro Excel
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Un único archivo ordenado en 15 pestañas con Hoja 00 de Guía de Jerarquía para completar tus sedes, clientes, bienes y puestos.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-xs">
            <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
              2
            </span>
            <h4 className="text-base font-extrabold text-slate-900">
              Importa en 3 Niveles Jerárquicos
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              El importador inteligente de Vaikuntha resuelve nombres legibles de sede y previene automáticamente violaciones de clave foránea.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-xs">
            <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
              3
            </span>
            <h4 className="text-base font-extrabold text-slate-900">
              Entrega PINs y Comienza a Atender
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Asigna a tus colaboradores de mostrador el rol Soporte y a tus estilistas el rol Staff. El sistema fluye sin fricción.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          7. CALL TO ACTION FINAL
      ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-b from-white to-emerald-50/50 border border-emerald-200/80 rounded-3xl p-10 sm:p-16 shadow-md space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white mx-auto shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-950 tracking-tight">
            ¿Listo para comprobar la fluidez de Vaikuntha ERP?
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Ingresa al Sandbox Demo en 1-clic y experimenta la atención desde los ojos de un recepcionista, un estilista en sillón o el administrador general.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href="/sandbox"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current text-emerald-400" />
              <span>Explorar Sandbox Demo</span>
            </Link>
            <Link
              href="/manuales"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 transition"
            >
              Consultar Manuales Oficiales v1.0
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
