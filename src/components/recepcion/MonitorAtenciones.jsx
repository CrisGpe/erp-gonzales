import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export function MonitorAtenciones({ atenciones, onRegistrarEspera, onAsignarEspera }) {
  const [now, setNow] = useState(new Date());

  // Cronómetro interno: Actualiza la vista cada 30 segundos
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const handleDevAction = (accion) => alert(`🚨 Módulo de ${accion}: Aún en desarrollo...`);

  return (
    <section className="atenciones-section">
      <div className="section-header-compact">
        <h2 className="section-title">🕒 Monitor de Atenciones</h2>
        <button 
          className="btn-add-espera" 
          onClick={onRegistrarEspera}
        >
          + CLIENTE EN ESPERA
        </button>
      </div>

      <div className="monitor-list-container">
        {atenciones.length === 0 ? (
        <div className="empty-state-mini">No hay servicios activos.</div>
        ) : (
        atenciones.map((o) => {
            const minutos = Math.floor((now - new Date(o.fecha_registro)) / 60000);
            const esEspera = o.estado_orden === 'En Espera';
            const esCaja = o.estado_orden === 'Pendiente'; // Estado que indica fin de servicio
            const esUrgente = minutos > 45 && !esCaja; // Solo urgente si no está en caja

            return (
            <div 
                key={o.id} 
                className={`ticket-mini-card 
                ${esEspera ? 'status-espera' : ''} 
                ${esCaja ? 'alerta-caja-glow' : ''} 
                ${esUrgente ? 'urgente-glow' : ''}`}
            >
                <div className="ticket-main-content">
                <div 
                    className="ticket-info-group" 
                    onClick={() => esEspera && onAsignarEspera(o)}
                    style={{ cursor: esEspera ? 'pointer' : 'default', flex: 1 }}
                >
                    <div className="cliente-name">
                    <strong>{o.cliente_manual}</strong>
                    {esEspera && <span className="label-click">HACER CLICK PARA ASIGNAR</span>}
                    {esCaja && <span className="caja-label">💰 LISTO PARA COBRO</span>}
                    </div>
                    <div className="agente-name">
                    {o.agentes?.nickname || '⏳ Esperando en cola...'}
                    </div>
                </div>

                <div className="ticket-status-group">
                    <div className={`tiempo-badge ${esUrgente ? 'danger' : ''}`}>
                    ⏱️ {minutos} min
                    </div>
                    <div className={`role-badge ${o.estado_orden?.toLowerCase().replace(' ', '-')}`}>
                    {o.estado_orden === 'En Espera' ? 'COLA' : (o.estado_orden === 'Pendiente' ? 'CAJA' : 'CURSO')}
                    </div>
                </div>
                </div>

                {/* VISUALIZACIÓN DE MONTO SI ESTÁ EN CAJA */}
                {esCaja && (
                <div className="monto-final-container">
                    <div className="servicios-resumen-mini">
                    {o.servicios_json?.length} servicios registrados
                    </div>
                    <div className="monto-final-tag">
                    TOTAL: S/ {o.monto_estimado || 0}
                    </div>
                </div>
                )}

                {/* BOTONERA INTERACTIVA (Oculta o gris si está en caja para no confundir) */}
                {!esCaja && (
                <div className="ticket-actions-bar">
                    <button onClick={() => handleDevAction('Confirmar')} className="btn-action-ticket">✓ Confirmar</button>
                    <button onClick={() => handleDevAction('Poner en Espera')} className="btn-action-ticket">⏳ Pausar</button>
                    <button onClick={() => handleDevAction('Clonar')} className="btn-action-ticket">👯 Clonar</button>
                </div>
                )}
            </div>
            );
        })
        )}
      </div>
    </section>
  );
}