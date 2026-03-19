import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function AdminDashboard() {
  const [sedes, setSedes] = useState([]);
  const [serviciosActivos, setServiciosActivos] = useState(0);
  const [loading, setLoading] = useState(true);

  async function loadAdminData() {
    const { data: salones } = await supabase.from('salones').select('*');
    // Contamos órdenes "En Curso" en todas las sedes
    const { count } = await supabase
      .from('ordenes_atencion')
      .select('*', { count: 'exact', head: true })
      .eq('estado_orden', 'En Curso');

    if (salones) setSedes(salones);
    setServiciosActivos(count || 0);
    setLoading(false);
  }

  useEffect(() => {
    loadAdminData();

    // REALTIME GLOBAL: Cualquier cambio en órdenes actualiza el panel admin
    const channel = supabase
      .channel('admin-global')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ordenes_atencion' }, () => loadAdminData())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  if (loading) return <p>Cargando estadísticas globales...</p>;

  return (
    <div className="dashboard-view">
      <h1>🏰 Panel de Control Global</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Sedes Activas</h3>
          <p>{sedes.length}</p>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--accent)' }}>
          <h3>Servicios en Curso</h3>
          <p>{serviciosActivos}</p>
        </div>
      </div>
      
      <h2 style={{marginTop: '30px'}}>Resumen de Sedes</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Sede</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sedes.map(sede => (
              <tr key={sede.id}>
                <td>{sede.nombre}</td>
                <td>{sede.direccion || 'No definida'}</td>
                <td><button className="btn-small">Ver Reportes</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}