import React from 'react';

export function ListaPendientes({ tickets, onSeleccionar }) {
  return (
    <aside className="panel-izquierdo">
      <div className="section-header">
        <h3>📋 Por Cobrar</h3>
        <span className="count-badge-caja">{tickets.length}</span>
      </div>
      
      <div className="tickets-list">
        {tickets.length === 0 ? (
          <div className="empty-state-caja">No hay órdenes pendientes</div>
        ) : (
          tickets.map(t => {
            const fechaRef = new Date(t.fecha_registro);
            const hoy = new Date().toLocaleDateString();
            const esAntigua = fechaRef.toLocaleDateString() !== hoy;

            return (
              <div 
                key={t.id} 
                className={`ticket-mini-card ${esAntigua ? 'border-warning' : ''}`} 
                onClick={() => onSeleccionar(t)}
              >
                <div className="ticket-row-top">
                  <strong>{t.cliente_manual}</strong>
                  <span className="price-tag">S/ {t.monto_estimado}</span>
                </div>
                <div className="ticket-row-bottom">
                  <div style={{display: 'flex', flexDirection: 'column'}}>
                    <small className="tipo-atencion">{t.tipo_servicio}</small>
                    <small style={{fontSize: '0.7rem', color: 'var(--accent)'}}>
                      Emisor: {t.agentes?.nickname || 'Agente'}
                    </small>
                  </div>
                  <small className={`fecha-tag ${esAntigua ? 'text-danger' : ''}`}>
                    {esAntigua 
                      ? `⚠️ ${fechaRef.toLocaleDateString('es-PE')}` 
                      : fechaRef.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </small>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}