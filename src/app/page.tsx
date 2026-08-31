import React from "react";
import Link from "next/link";
import { 
  Sparkles, Play, ArrowRight, CheckCircle2, Shield, 
  Smartphone, Laptop, Monitor, Scale, Layers, Users, 
  Clock, Zap, Check, ChevronRight, FileSpreadsheet, Building2,
  DollarSign, Landmark, WifiOff, Award, HeartHandshake, Eye,
  ShieldCheck, RefreshCw, BarChart3, Receipt, Tag, Lock
} from "lucide-react";
import { ERP_BASE_URL } from "@/data/sandboxProfiles";

export default function HomePage() {
  return (
    <div className="space-y-24 pb-20">

      {/* =========================================================================
          1. HERO SECTION & ECOSISTEMA B2B2C
      ========================================================================= */}
      <section className="relative overflow-hidden pt-16 pb-12 sm:pt-24 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          
          {/* Badge superior */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-extrabold text-emerald-800 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Vaikuntha ERP Engine v2.1 • El Nodo Operativo de la Red LuminaHQ B2B2C</span>
          </div>

          {/* Titular Principal Holístico */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-slate-950 tracking-tight leading-[1.1]">
            El Sistema Operativo que conecta{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600">
              Operación Física, Finanzas & Confianza
            </span>{" "}
            en Negocios de Servicios.
          </h1>

          {/* Subtítulo Holístico */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-3xl mx-auto">
            Vaikuntha ERP no es un simple punto de venta. Es un motor integral que <strong>elimina las fugas en caja con arqueo ciego</strong>, <strong>controla compras a crédito e inventarios al gramo con balanzas IoT</strong>, <strong>empodera al equipo de soporte mediante Workspaces de baja fricción</strong> y <strong>conecta a tus clientas con la red gamificada de beneficios de LuminaHQ</strong>.
          </p>

          {/* CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/sandbox"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current text-emerald-400" />
              <span>Probar Sandbox Demo en Vivo (1-Clic)</span>
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
              <span>Cero tarjetas de crédito para probar</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Datos reales simulados</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Homologado SUNAT PSE (Boletas y Facturas)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Modo Offline 100% Resiliente</span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          2. MÉTRICAS CLAVE DEL ECOSISTEMA
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-600">
              S/ 0.00
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Fugas en caja con Arqueo Ciego y Drawer de Gastos
            </p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-indigo-600">
              0 gramos
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Desperdicio químico con Balanzas IoT y tara
            </p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900">
              15 a 60d
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Calendario de facturas de compras a crédito
            </p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-600">
              0 ms
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Latencia offline ante caídas de internet (IndexedDB)
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. LA TRÍADA DE VALOR (WIN-WIN-WIN)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
            Arquitectura de Confianza Compartida
          </span>
          <h2 className="text-3xl font-heading font-black text-slate-900 tracking-tight">
            La Tríada de Valor: Cómo Gana Cada Actor
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Un negocio de servicios solo prospera cuando la tecnología cuida a quien consume, respeta a quien trabaja y blinda a quien invierte.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Actor 1: Clienta */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-8 space-y-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center text-xl font-bold border border-pink-100">
                💖
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-pink-600 uppercase tracking-wider">
                  Para el Consumidor
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  La Clienta
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Disfruta de una experiencia VIP transparente sin sorpresas de cobro ni llamadas para reservar.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Transparencia Total</strong>: Consulta de cuenta y tiempo de pose capilar en sillón escaneando un QR.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Historial Portable</strong>: Fórmulas de color y tratamientos guardados de forma segura.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Vaikuntha Points 💎</strong>: Puntos y recompensas gamificadas con motor Octalysis & SAPS.</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-slate-100 text-[11px] font-bold text-slate-400">
              Acceso: Portal Móvil & Tótem Kiosko
            </div>
          </div>

          {/* Actor 2: Especialista Staff */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-8 space-y-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-bold border border-purple-100">
                💈
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-wider">
                  Para el Colaborador
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  El Especialista Staff
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Elimina papeleos y discusiones de fin de mes con liquidación en tiempo real y dignidad profesional.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Suite Móvil en Sillón</strong>: Recibe órdenes, anida servicios adicionales y pide cortesías al bar.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Comisiones en Vivo</strong>: Cálculo transparente de comisiones y propinas al segundo.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Pedidos en Gramos</strong>: Solicita fórmulas exactas al laboratorio sin moverse de su estación.</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-slate-100 text-[11px] font-bold text-slate-400">
              Acceso: Smartphone PWA & NFC
            </div>
          </div>

          {/* Actor 3: Dueño de Sede */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-8 space-y-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold border border-indigo-100">
                🏢
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">
                  Para el Inversionista
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  El Dueño / Administrador
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Control absoluto de la rentabilidad, blindaje contra robos hormiga y resiliencia ante la rotación de personal.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Cero Fugas en Caja</strong>: Arqueo ciego real, drawer de gastos y cuadre del día.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Cuentas por Pagar 15-60d</strong>: Calendario financiero y control de 7 categorías de compras.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Conciliación POS D+1</strong>: Control de lotes en tránsito y comisiones bancarias exactas.</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-slate-100 text-[11px] font-bold text-slate-400">
              Acceso: Workspaces Desktop & Consola Admin
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          4. LOS 5 PILARES MAESTROS DEL ECOSISTEMA
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
            Ingeniería de Solución Integral
          </span>
          <h2 className="text-3xl font-heading font-black text-slate-900 tracking-tight">
            Los 5 Pilares Maestros de Vaikuntha ERP
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Cada módulo del sistema fue concebido para resolver un punto de dolor real de la operación física, financiero y de personas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Pilar 1 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">
                Pilar 01
              </span>
              <h4 className="text-base font-extrabold text-slate-900 mt-1">
                Workspaces & Recursos Humanos
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Resuelve la rotación de personal mediante <strong>Workspaces de mínima fricción</strong>. El personal nuevo opera bajo el rol unificado de <strong>Soporte</strong> generando valor en su primer día. A medida que supera su período de prueba, el Admin le desbloquea herramientas avanzadas (arqueo, kardex, CRM, WFM) en 1-clic.
            </p>
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-semibold">
              ✓ 6 Roles Canónicos • Onboarding en 15 min
            </div>
          </div>

          {/* Pilar 2 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">
                Pilar 02
              </span>
              <h4 className="text-base font-extrabold text-slate-900 mt-1">
                Escudo Financiero & Cero Fugas
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Blindaje contra descuadres de dinero. <strong>Arqueo ciego real</strong> donde el cajero no ve el saldo teórico, <strong>Drawer de operaciones</strong> para gastos menores de mostrador (taxis, compras de emergencia), <strong>Conciliación D+1 de pasarelas POS</strong> (Izipay, Niubiz) y <strong>Cuentas por pagar a crédito (15-60d)</strong>.
            </p>
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-semibold">
              ✓ Cuadre del día • Bandeja de varianzas
            </div>
          </div>

          {/* Pilar 3 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl w-fit">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-cyan-600 uppercase tracking-wider">
                Pilar 03
              </span>
              <h4 className="text-base font-extrabold text-slate-900 mt-1">
                Taller Metrológico IoT & Bienes
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Elimina los miles de soles perdidos en tintes y oxidantes desperdiciados en los lavaderos. Integración con <strong>balanzas electrónicas USB/Serial con tara automática</strong> para pesar mezclas al gramo exacto. Clasificación estricta de compras en <strong>7 categorías de bienes</strong> (Retail vs Insumos vs Repuestos).
            </p>
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-semibold">
              ✓ Control de mermas • Fraccionados en gramos
            </div>
          </div>

          {/* Pilar 4 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="p-3 bg-pink-50 text-pink-600 rounded-xl w-fit">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-pink-600 uppercase tracking-wider">
                Pilar 04
              </span>
              <h4 className="text-base font-extrabold text-slate-900 mt-1">
                Experiencia VIP & LuminaHQ B2B2C
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hospitalidad 5 estrellas en sala. <strong>Tótem Kiosko interactivo de 21"</strong> para check-in express por DNI y bebidas de cortesía, <strong>Radar de proximidad BLE</strong> para detectar la llegada de clientas VIP al cruzar la puerta, y pasaporte de <strong>Vaikuntha Points 💎</strong> sincronizado con la red de beneficios de LuminaHQ.
            </p>
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-semibold">
              ✓ Octalysis & SAPS • Retención de clientes
            </div>
          </div>

          {/* Pilar 5 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-xs md:col-span-2 lg:col-span-1">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-fit">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider">
                Pilar 05
              </span>
              <h4 className="text-base font-extrabold text-slate-900 mt-1">
                Resiliencia & SUNAT PSE Oficial
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Modo Offline-First (Watermelon Pattern)</strong>: si se corta el internet o la luz, la sede sigue cobrando y emitiendo comprobantes en memoria local (`IndexedDB`) sin detener la atención. Facturación nativa SUNAT PSE con firmas SHA-256 y formalización laboral (Planilla vs RHE para SUNAFIL).
            </p>
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-semibold">
              ✓ Cero caída de mostrador • Boletas y Facturas
            </div>
          </div>

          {/* Card Resumen de la Red B2B2C */}
          <div className="bg-slate-950 text-white rounded-2xl p-6 space-y-4 shadow-xs md:col-span-2 lg:col-span-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">
                  Ecosistema LuminaHQ
                </span>
              </div>
              <h4 className="text-base font-extrabold text-white">
                El Nodo Físico de una Red Inteligente
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Vaikuntha ERP es la base de operaciones en la sede física. Conectado a LuminaHQ, permite a las marcas patrocinar insumos, a los clientes canjear beneficios universales y a tu sede escalar en red.
              </p>
            </div>
            <Link
              href="/sandbox"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <span>Ver Demostración del Ecosistema</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. ECOSISTEMA DE HARDWARE CONECTADO
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider">
            Hardware en Producción
          </span>
          <h2 className="text-3xl font-heading font-black text-slate-900 tracking-tight">
            Los 4 Dispositivos del Salón Inteligente
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Cada puesto cuenta con la interfaz ergonómica exacta para maximizar la productividad y minimizar los desplazamientos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit">
              <Laptop className="w-5 h-5" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900">Workspaces Desktop</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              PC touch de mostrador para check-in en recepción, cobro split-billing en caja y control central de laboratorio.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-fit">
              <Smartphone className="w-5 h-5" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900">Suite Móvil Staff</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              PWA en el smartphone del especialista: órdenes activas, cronómetros de pose, insumos al laboratorio y comisiones.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-fit">
              <Monitor className="w-5 h-5" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900">Tótem Kiosko Lobby</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Terminal táctil vertical de 21": check-in por DNI, cortesías de cafetería y marcación rápida de staff con PIN de 4 dígitos.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl w-fit">
              <Scale className="w-5 h-5" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900">Balanzas Químicas IoT</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Balanza electrónica conectada por USB/Serial con tara automática y precisión metrológica para tintes capilares.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. LA RUTA DE APROVISIONAMIENTO EN 15 MINUTOS
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider">
            Migración sin Fricción
          </span>
          <h2 className="text-3xl font-heading font-black text-slate-900 tracking-tight">
            Aprovisiona tu Sede en 15 Minutos con Excel
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Sin semanas de ingreso manual. Nuestro Kit Maestro Jerárquico puebla tu sede respetando la integridad de base de datos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-xs">
            <span className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">
              1
            </span>
            <h4 className="text-base font-extrabold text-slate-900">
              Descarga el Libro Maestro (15 Hojas)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Incluye Hoja 00 de Guía de Jerarquía, sedes, clientes con `sede_principal`, los 6 roles canónicos, cuentas bancarias y bienes.
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
              El importador traduce automáticamente los nombres legibles de sede a UUIDs y puebla la tabla relacional `sedes_usuarios`.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-xs">
            <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
              3
            </span>
            <h4 className="text-base font-extrabold text-slate-900">
              Comienza a Operar de Inmediato
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Entrega los PINs a tu equipo de mostrador y especialistas. El semáforo WFM coordina las atenciones automáticamente.
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
            Experimenta el Ecosistema Completo en Vivo
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Ingresa al Sandbox Demo en 1-clic y evalúa el arqueo ciego, el pesaje en balanza IoT, las boletas SUNAT y la suite móvil con datos simulados reales.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href="/sandbox"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current text-emerald-400" />
              <span>Explorar Sandbox Demo en Vivo</span>
            </Link>
            <Link
              href="/manuales"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 transition cursor-pointer"
            >
              Consultar Manuales Oficiales v1.0
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
