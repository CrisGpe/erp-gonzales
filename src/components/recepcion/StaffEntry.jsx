import React from 'react';

export function StaffEntry({ busqueda, setBusqueda, staff, onRegistrar }) {
  // Lógica de búsqueda normalizada (sin tildes) para una mejor UX
  const normalizar = (texto) => 
    texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filtrados = staff.filter(a => 
    normalizar(a.nickname).includes(normalizar(busqueda))
  );

  return (
    <section className="cola-section half-width-container" style={{ padding: '15px', marginBottom: '25px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
        <h2 style={{ fontSize: '0.9rem', margin: 0, whiteSpace: 'nowrap' }}>⚪ Registro Staff:</h2>
        <div className="search-input-wrapper">
          <i>🔍</i>
          <input 
            type="text" 
            className="search-input-compact"
            placeholder="Buscar agente..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>
      
      {/* Contenedor con scroll horizontal y rejilla de 2 filas */}
      <div className="horizontal-scroll-grid">
        {filtrados.length > 0 ? (
          filtrados.map((agente) => {
            const haNotificado = agente.estado_actual === 'Pendiente';
            return (
              <button 
                key={agente.id} 
                className={`${haNotificado ? "btn-success pulse" : "btn-wait"} btn-staff-entry`} 
                onClick={() => onRegistrar(agente.id)}
              >
                {haNotificado ? `✅ ${agente.nickname}` : `+ ${agente.nickname}`}
              </button>
            );
          })
        ) : (
          <div className="no-results-msg">
            ⚠️ No se encontró ningún agente que coincida con "{busqueda}"
          </div>
        )}
      </div>
    </section>
  );
}