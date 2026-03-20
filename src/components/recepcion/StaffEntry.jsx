import React from 'react';

export function StaffEntry({ busqueda, setBusqueda, staff, onRegistrar }) {
  // Lógica de búsqueda normalizada (sin tildes) para una mejor UX
  const normalizar = (texto) => 
    texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filtrados = staff.filter(a => 
    normalizar(a.nickname).includes(normalizar(busqueda))
  );

  return (
    <section className="half-width-container" style={{ border: 'none', background: 'transparent', marginBottom: '0' }}>
      <div className="staff-entry-header" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <h2>REGISTRO STAFF</h2>
        <div className="search-input-wrapper">
          <i style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)' }}>🔍</i>
          <input 
            type="text" 
            className="search-input-compact"
            placeholder="Buscar..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>
      
      <div className="horizontal-scroll-grid" style={{ marginTop: '5px' }}>
        {filtrados.map((agente) => (
          <button 
            key={agente.id} 
            className="btn-staff-entry btn-wait" 
            onClick={() => onRegistrar(agente.id)}
          >
            {agente.nickname}
          </button>
        ))}
      </div>
    </section>
  );
}