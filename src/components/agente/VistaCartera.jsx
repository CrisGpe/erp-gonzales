import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export function VistaCartera({ agenteId }) {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCartera() {
      // Obtenemos clientes únicos que se han atendido con este agente
      const { data, error } = await supabase
        .from('ordenes_atencion')
        .select('cliente_manual, fecha_registro, tipo_servicio')
        .eq('agente_id', agenteId)
        .order('fecha_registro', { ascending: false });

      if (data) {
        // Lógica para agrupar por nombre y obtener la última visita
        const unicos = {};
        data.forEach(reg => {
          if (!unicos[reg.cliente_manual]) {
            unicos[reg.cliente_manual] = {
              nombre: reg.cliente_manual,
              ultimaVisita: new Date(reg.fecha_registro).toLocaleDateString(),
              ultimoServicio: reg.tipo_servicio,
              totalVisitas: 1
            };
          } else {
            unicos[reg.cliente_manual].totalVisitas += 1;
          }
        });
        setClientes(Object.values(unicos));
      }
      setLoading(false);
    }
    if (agenteId) fetchCartera();
  }, [agenteId]);

  const filtrados = clientes.filter(c => 
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="dashboard-mobile">
      <div className="card-mobile">
        <h3 style={{ marginBottom: '5px' }}>👥 Mi Cartera</h3>
        <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '15px' }}>
          Clientes que has atendido anteriormente.
        </p>

        <input 
          type="text" 
          placeholder="Buscar cliente..." 
          className="search-input-agente"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div className="lista-cartera">
          {loading ? <p>Cargando clientes...</p> : 
           filtrados.map((c, i) => (
            <div key={i} className="cliente-item-cartera" onClick={() => alert(`Historial de ${c.nombre} (En desarrollo)`)}>
              <div className="cliente-info">
                <span className="cliente-nombre">{c.nombre}</span>
                <span className="cliente-meta">Último: {c.ultimoServicio}</span>
              </div>
              <div className="cliente-stats">
                <span className="visitas-badge">{c.totalVisitas} v.</span>
                <span className="fecha-meta">{c.ultimaVisita}</span>
              </div>
            </div>
          ))}
          {!loading && filtrados.length === 0 && (
            <div className="empty-state-placeholder">No se encontraron clientes.</div>
          )}
        </div>
      </div>
    </div>
  );
}