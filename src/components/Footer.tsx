import React from "react";
import Link from "next/link";
import { Sparkles, Heart, Shield, Terminal, ArrowUpRight } from "lucide-react";
import { ERP_BASE_URL } from "@/data/sandboxProfiles";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-heading font-extrabold text-white text-base tracking-tight">
                Vaikuntha <span className="text-emerald-400">ERP</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              El Sistema Operativo que resuelve la rotación de personal y la curva de aprendizaje en negocios de servicios mediante Workspaces y Empoderamiento Progresivo.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sistemas Operativos en Línea</span>
            </div>
          </div>

          {/* Col 2: Ecosistema */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">
              Ecosistema
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/sandbox" className="hover:text-white transition">
                  Sandbox Demo en Vivo (1-Clic)
                </Link>
              </li>
              <li>
                <Link href="/manuales" className="hover:text-white transition">
                  Manuales Oficiales (v1.0)
                </Link>
              </li>
              <li>
                <Link href="/precios" className="hover:text-white transition">
                  Calculadora de Cotizaciones
                </Link>
              </li>
              <li>
                <a 
                  href={`${ERP_BASE_URL}/login`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition inline-flex items-center gap-1"
                >
                  <span>Consola ERP Privada</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Roles Canónicos */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">
              6 Roles Canónicos
            </h4>
            <ul className="space-y-2">
              <li><Link href="/manuales?rol=superadmin" className="hover:text-white transition">01. Superadmin (Owner Único)</Link></li>
              <li><Link href="/manuales?rol=admin" className="hover:text-white transition">02. Admin (Sede & Delegación)</Link></li>
              <li><Link href="/manuales?rol=soporte" className="hover:text-white transition">03. Soporte (Workspaces)</Link></li>
              <li><Link href="/manuales?rol=staff" className="hover:text-white transition">04. Staff (Suite Móvil PWA)</Link></li>
              <li><Link href="/manuales?rol=kiosk" className="hover:text-white transition">05. Kiosko (Tótem Lobby)</Link></li>
              <li><Link href="/manuales?rol=cliente" className="hover:text-white transition">06. Cliente (Portal Web/Móvil)</Link></li>
            </ul>
          </div>

          {/* Col 4: Contacto & Legal */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">
              Contacto & Soporte
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contacto" className="hover:text-white transition">
                  Agendar Onboarding Guiado
                </Link>
              </li>
              <li>
                <a 
                  href="https://wa.me/51987654321?text=Hola%20deseo%20información%20de%20Vaikuntha%20ERP" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  WhatsApp Comercial: +51 987 654 321
                </a>
              </li>
              <li className="pt-2 text-[11px] text-slate-500">
                Homologado ante SUNAT PSE para Boletas y Facturas Electrónicas en el Perú.
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} Vaikuntha ERP Engine. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>Row Level Security (RLS) PostgreSQL</span>
            </span>
            <span>•</span>
            <span>Versión 2.1 Oficial</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
