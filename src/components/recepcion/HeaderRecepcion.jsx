import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export function HeaderRecepcion({ nombreSede }) {
  const [fechaLarga, setFechaLarga] = useState("");

  useEffect(() => {
    const opciones = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const formatearFecha = () => {
      const hoy = new Date();
      const opciones = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        timeZone: 'America/Lima' // <--- FORZAR LIMA
      };
      
      const fechaBase = hoy.toLocaleDateString('es-PE', opciones);
      const hora = hoy.toLocaleTimeString('es-PE', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'America/Lima' 
      });
      
      setFechaLarga(`${fechaBase} - ${hora}`);
    };

    formatearFecha();
    const interval = setInterval(formatearFecha, 60000); // Actualiza cada minuto
    return () => clearInterval(interval);
  }, []);

  const handleGestion = (modulo) => alert(`Abriendo módulo de ${modulo}... (En desarrollo)`);

  return (
    <header className="header-recepcion-compact">
      <div className="header-info">
        <div className="sede-tag">
          <span className="icon">🛎️</span>
          <h1>{nombreSede || 'Cargando Sede...'}</h1>
        </div>
        <p className="fecha-larga-text">{fechaLarga}</p>
      </div>

      <div className="header-actions-nav">
        <button onClick={() => handleGestion('Fidelización')} className="btn-nav">💎 Fidelización</button>
        <button onClick={() => handleGestion('Agenda')} className="btn-nav">📅 Agenda</button>
        <button onClick={() => handleGestion('Gestión')} className="btn-nav">📊 Gestión</button>
        <button onClick={() => supabase.auth.signOut()} className="btn-logout-mini">Cerrar Sesión</button>
      </div>
    </header>
  );
}