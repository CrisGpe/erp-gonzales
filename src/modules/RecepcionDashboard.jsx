import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ModalAsignacion } from '../components/ModalAsignacion';
import { StaffEntry } from '../components/recepcion/StaffEntry';
import './Recepcion.css'; // Asegúrate de que este archivo exista con los estilos modularizados

export function RecepcionDashboard({ salonId }) {
  const [agentesEnCola, setAgentesEnCola] = useState([]);
  const [agentesAusentes, setAgentesAusentes] = useState([]);
  const [atencionesActivas, setAtencionesActivas] = useState([]);
  const [sedeInfo, setSedeInfo] = useState(null);
  const [agenteParaAsignar, setAgenteParaAsignar] = useState(null);
  const [busquedaStaff, setBusquedaStaff] = useState("");

  async function loadDashboardData() {
    try {
      const d = new Date();
      const hoy = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
      
      // 1. Cargar Info de la Sede
      const { data: sede } = await supabase.from('salones').select('nombre').eq('id', salonId).single();
      setSedeInfo(sede);

      // 2. Agentes en Sala (Asistencia activa)
      const { data: enCola } = await supabase
        .from('asistencia')
        .select(`
          id, entrada, inicio_refrigerio, fin_refrigerio, salida,
          agentes ( id, nickname, estado_actual, ordenes_atencion(id, estado_orden, cliente_manual, fecha_registro, tipo_servicio) )
        `)
        .eq('fecha', hoy)
        .is('salida', null)
        .order('entrada', { ascending: true });

      // 3. Agentes Ausentes (Staff que falta ingresar)
      const idsEnSala = enCola?.map(a => a.agentes.id) || [];
      const { data: ausentes } = await supabase
        .from('agentes')
        .select('id, nickname, estado_actual, perfiles(nombre_completo)')
        .eq('salon_id', salonId)
        .eq('situacion', 'Activo')
        .not('id', 'in', `(${idsEnSala.length > 0 ? idsEnSala.join(',') : '00000000-0000-0000-0000-000000000000'})`);

      const procesados = enCola?.map(item => ({
        ...item,
        ordenActiva: item.agentes.ordenes_atencion?.find(o => ['En Asesoría', 'En Curso', 'Pendiente'].includes(o.estado_orden))
      }));

      // 4. Monitor de Atenciones (Incluye "En Espera" sin agente)
      const { data: monitorGlobal } = await supabase
        .from('ordenes_atencion')
        .select('*, agentes(nickname)')
        .eq('salon_id', salonId)
        .gte('fecha_registro', `${hoy}T00:00:00`)
        .in('estado_orden', ['En Espera', 'En Asesoría', 'En Curso', 'Pendiente'])
        .order('fecha_registro', { ascending: true });

      setAgentesEnCola(procesados || []);
      setAgentesAusentes(ausentes || []);
      setAtencionesActivas(monitorGlobal || []);
    } catch (error) { console.error("Error cargando dashboard:", error.message); }
  }

  useEffect(() => {
    if (!salonId) return;
    loadDashboardData();
    const channel = supabase.channel('monitor-recepcion-global')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => loadDashboardData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [salonId]);

  async function registrarEntrada(agenteId) {
    const d = new Date();
    const hoy = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
    await supabase.from('asistencia').insert([{ agente_id: agenteId, salon_id: salonId, entrada: new Date().toISOString(), fecha: hoy }]);
    await supabase.from('agentes').update({ estado_actual: 'Libre' }).eq('id', agenteId);
    setBusquedaStaff(""); 
    loadDashboardData();
  }

  async function registrarEspera() {
    const nombre = prompt("Nombre del cliente en espera:");
    if (!nombre) return;
    const { error } = await supabase.from('ordenes_atencion').insert([{
      salon_id: salonId,
      cliente_manual: nombre,
      estado_orden: 'En Espera',
      tipo_servicio: 'Por definir',
      fecha_registro: new Date().toISOString()
    }]);
    if (error) alert(error.message);
    loadDashboardData();
  }

  async function gestionarRefrigerio(asistenciaId, campo) {
    await supabase.from('asistencia').update({ [campo]: new Date().toISOString() }).eq('id', asistenciaId);
    loadDashboardData();
  }

  async function confirmarAsignacion(datos) {
    try {
      const { error } = await supabase.from('ordenes_atencion').insert([{
        salon_id: salonId, agente_id: datos.agenteId, cliente_manual: datos.clienteManual,
        tipo_servicio: datos.tipoServicio, es_excepcion_cola: datos.excepcionCola !== 'Turno',
        estado_orden: 'En Asesoría', monto_estimado: datos.montoEstimado,
        es_penalizable: datos.excepcionCola === 'Turno', fecha_registro: new Date().toISOString()
      }]);
      if (error) throw error;
      if (datos.excepcionCola === 'Turno') await supabase.rpc('asignar_al_final_de_cola', { agente_uuid: datos.agenteId, salon_uuid: salonId });
      setAgenteParaAsignar(null);
      loadDashboardData();
    } catch (e) { alert("Error: " + e.message); }
  }

  async function resolverAtencionAgente(agenteId, ordenId) {
    try {
      const { data: orden } = await supabase.from('ordenes_atencion').select('es_penalizable').eq('id', ordenId).single();
      await supabase.from('ordenes_atencion').update({ estado_orden: 'Finalizada', fin_atencion: new Date().toISOString() }).eq('id', ordenId);
      await supabase.from('agentes').update({ estado_actual: 'Libre' }).eq('id', agenteId);
      if (orden?.es_penalizable) {
        const hoy = new Date().toISOString().split('T')[0];
        await supabase.from('asistencia').update({ entrada: new Date().toISOString() }).eq('agente_id', agenteId).eq('fecha', hoy);
      }
      loadDashboardData();
    } catch (e) { alert(e.message); }
  }

  return (
    <div className="dashboard-view">
      <header className="erp-header">
        <h1>🛎️ Monitor: {sedeInfo?.nombre || 'Cargando...'}</h1>
        <div className="role-badge libre">DÍA: {new Date().toLocaleDateString()}</div>
      </header>

      {/* Componente Modular de Registro de Staff - Con scroll horizontal y 50% width via CSS */}
      <StaffEntry 
        busqueda={busquedaStaff}
        setBusqueda={setBusquedaStaff}
        staff={agentesAusentes}
        onRegistrar={registrarEntrada}
      />

      <div className="main-grid">
        
        {/* COLUMNA IZQUIERDA: PERSONAL EN SALA */}
        <section className="cola-section">
          <h2 className="section-title">🟢 Personal en Sala</h2>
          <div className="agentes-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {agentesEnCola.map((item, index) => (
              <div key={item.id} className={`agente-card ${item.ordenActiva?.estado_orden === 'Pendiente' ? 'alerta-cierre glow-blue' : ''}`}>
                <div className="posicion">#{index + 1}</div>
                <h3>{item.agentes.nickname}</h3>
                <div className={`role-badge ${item.agentes.estado_actual?.toLowerCase() || 'libre'}`}>{item.agentes.estado_actual || 'Libre'}</div>
                <p style={{ fontSize: '11px', marginTop: '5px' }}>Ingreso: {new Date(item.entrada).toLocaleTimeString()}</p>
                <div style={{ display: 'flex', gap: '5px', marginTop: '10px', justifyContent: 'center' }}>
                  {!item.inicio_refrigerio ? (
                    <button className="btn-small" onClick={() => gestionarRefrigerio(item.id, 'inicio_refrigerio')}>☕ Ref</button>
                  ) : !item.fin_refrigerio ? (
                    <button className="btn-small" style={{ background: '#ffa500' }} onClick={() => gestionarRefrigerio(item.id, 'fin_refrigerio')}>✅ Fin</button>
                  ) : <span style={{fontSize: '10px', color: '#888'}}>Ref. Terminado</span>}
                </div>
                <div style={{ marginTop: '15px' }}>
                  {item.ordenActiva?.estado_orden === 'Pendiente' ? (
                    <button className="btn-success pulse" style={{ width: '100%' }} onClick={() => resolverAtencionAgente(item.agentes.id, item.ordenActiva.id)}>RESOLVER ✅</button>
                  ) : (
                    <button className="btn-primary" style={{ width: '100%' }} disabled={item.agentes.estado_actual === 'Ocupado'} onClick={() => setAgenteParaAsignar(item.agentes)}>
                      {item.agentes.estado_actual === 'Ocupado' ? 'En Servicio...' : 'Asignar'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* COLUMNA DERECHA: MONITOR DE ATENCIONES */}
        <section className="atenciones-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2 className="section-title" style={{ margin: 0 }}>🕒 Monitor de Atenciones</h2>
            <button className="btn-primary" onClick={registrarEspera} style={{ fontSize: '0.8rem', background: 'var(--warning)', color: 'white' }}>
              + CLIENTE EN ESPERA
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {atencionesActivas.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>No hay servicios activos.</p>
            ) : (
              atencionesActivas.map(o => {
                const minutos = Math.floor((new Date() - new Date(o.fecha_registro)) / 60000);
                
                return (
                  <div key={o.id} className="ticket-mini-card" style={{ 
                    background: 'white', 
                    borderLeft: o.estado_orden === 'En Espera' ? '5px solid var(--warning)' : (o.estado_orden === 'Pendiente' ? '5px solid var(--accent)' : '5px solid var(--success)'), 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
                  }}>
                    <div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <strong>{o.cliente_manual}</strong>
                        {o.estado_orden === 'En Espera' && <span className="pulse-text" style={{ fontSize: '10px', color: 'var(--danger)' }}>¡EN ESPERA!</span>}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {o.agentes?.nickname ? `${o.tipo_servicio} • ${o.agentes.nickname}` : 'Sin agente asignado'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: minutos > 20 ? 'var(--danger)' : 'var(--text-p)' }}>
                        ⏱️ {minutos} min
                      </div>
                      <div className={`role-badge ${o.estado_orden?.toLowerCase() === 'pendiente' ? 'pendiente' : 'libre'}`} style={{ fontSize: '10px' }}>
                        {o.estado_orden === 'En Espera' ? 'COLA' : (o.estado_orden === 'Pendiente' ? 'PAGO' : 'CURSO')}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      {agenteParaAsignar && (
        <ModalAsignacion agente={agenteParaAsignar} onClose={() => setAgenteParaAsignar(null)} onConfirm={loadDashboardData} />
      )}
    </div>
  );
}