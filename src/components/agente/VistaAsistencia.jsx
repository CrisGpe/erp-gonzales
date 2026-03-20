// src/components/agente/VistaAsistencia.jsx

import React from 'react';
import { supabase } from '../../lib/supabase';

export function VistaAsistencia({ agente, onAvisar }) {
  const handleNotificar = async () => {
    try {
      // Notificamos a recepción cambiando el estado actual
      const { error } = await supabase
        .from('agentes')
        .update({ estado_actual: 'Pendiente' })
        .eq('id', agente.id);

      if (error) throw error;

      alert("📢 Recepción notificada. Mantente atento a la confirmación.");
      
      // Llamamos a la función que refresca el dashboard en el padre
      if (onAvisar) onAvisar(); 
    } catch (e) {
      alert("Error al notificar: " + e.message);
    }
  };

  return (
    <div className="dashboard-mobile" style={{ justifyContent: 'center', height: '80vh' }}>
      <div className="posicion-cola-card anim-fade-in">
        <span className="welcome-text">Bienvenido al sistema</span>
        <h2 className="agente-nickname-display">{agente?.nickname}</h2>
        <p className="instruction-text">Aún no has registrado tu entrada de hoy.</p>
        <button className="btn-agente-action btn-primary-solid pulse" onClick={handleNotificar}>
          📢 AVISAR INGRESO
        </button>
      </div>
    </div>
  );
}