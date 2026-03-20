import React from 'react';

export function ListaAgentesSala({ agentes, onGestionarRefrigerio, onSetAgenteParaAsignar, onResolverAtencion }) {
  return (
    <section className="cola-section">
      <div className="section-header-compact">
        <h2 className="section-title">🟢 En Sala</h2>
        <span className="count-badge">{agentes.length}</span>
      </div>

      <div className="agentes-grid">
        {agentes.map((item, index) => {
          const isOcupado = item.agentes.estado_actual === 'Ocupado';
          const isPendiente = item.ordenActiva?.estado_orden === 'Pendiente';

          return (
            <div 
              key={item.id} 
              className={`agente-card ${isPendiente ? 'alerta-cierre glow-blue' : ''}`}
            >
              <div className="posicion">#{index + 1}</div>
              
              <div className="agente-info-mini">
                <h3>{item.agentes.nickname}</h3>
                <div className={`role-badge ${item.agentes.estado_actual?.toLowerCase() || 'libre'}`}>
                  {item.agentes.estado_actual || 'Libre'}
                </div>
              </div>

              <div className="actions-area">
                {/* Lógica de Refrigerio */}
                <div className="refrigerio-zone">
                  {!item.inicio_refrigerio ? (
                    <button className="btn-icon-alt" onClick={() => onGestionarRefrigerio(item.id, 'inicio_refrigerio')} title="Iniciar Refrigerio">☕</button>
                  ) : !item.fin_refrigerio ? (
                    <button className="btn-icon-alt active" onClick={() => onGestionarRefrigerio(item.id, 'fin_refrigerio')} title="Fin Refrigerio">✅</button>
                  ) : <span className="check-mark">✓</span>}
                </div>

                {/* Lógica de Atención */}
                <div className="atencion-zone">
                  {isPendiente ? (
                    <button className="btn-success-mini pulse" onClick={() => onResolverAtencion(item.agentes.id, item.ordenActiva.id)}>
                      RESOLVER
                    </button>
                  ) : (
                    <button 
                      className={`btn-primary-mini ${isOcupado ? 'disabled' : ''}`} 
                      disabled={isOcupado} 
                      onClick={() => onSetAgenteParaAsignar(item.agentes)}
                    >
                      {isOcupado ? 'Servicio' : 'Asignar'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}