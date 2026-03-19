import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ModalAsignacion } from '../components/ModalAsignacion';

export function RecepcionDashboard({ salonId }) {
  const [agentesEnCola, setAgentesEnCola] = useState([]);
  const [agentesAusentes, setAgentesAusentes] = useState([]);
  const [atencionesActivas, setAtencionesActivas] = useState([]);
  const [sedeInfo, setSedeInfo] = useState(null);
  const [agenteParaAsignar, setAgenteParaAsignar] = useState(null);

  async function loadDashboardData() {
    try {
      // 1. Generar fecha HOY localmente
      const d = new Date();
      const hoy = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
      
      // 2. Cargar Info de la Sede
      const { data: sede } = await supabase.from('salones').select('nombre').eq('id', salonId).single();
      setSedeInfo(sede);

      // 3. Agentes en sala (ASISTENCIA ACTIVA DE HOY)
      const { data: enCola } = await supabase
        .from('asistencia')
        .select(`
          id, entrada, inicio_refrigerio, fin_refrigerio, salida,
          agentes ( 
            id, nickname, estado_actual, 
            ordenes_atencion(id, estado_orden, cliente_manual, fecha_registro, tipo_servicio) 
          )
        `)
        .eq('fecha', hoy)
        .is('salida', null)
        .order('entrada', { ascending: true });

      // 4. Agentes que faltan ingresar (Staff de la sede que NO tiene asistencia hoy)
      const idsEnCola = enCola?.map(a => a.agentes.id) || [];
      let queryAusentes = supabase
        .from('agentes')
        .select('id, nickname, estado_actual, perfiles(nombre_completo)')
        .eq('salon_id', salonId)
        .eq('situacion', 'Activo');

      if (idsEnCola.length > 0) {
        queryAusentes = queryAusentes.not('id', 'in', `(${idsEnCola.join(',')})`);
      }
      const { data: ausentes } = await queryAusentes;

      // 5. Procesar órdenes activas para la UI de liberación y monitor derecho
      const procesados = enCola?.map(item => {
        const ordenActual = item.agentes.ordenes_atencion?.find(o => 
          ['En Asesoría', 'En Curso', 'Pendiente'].includes(o.estado_orden)
        );
        return { ...item, ordenActiva: ordenActual };
      });

      // 6. Monitor de Atenciones en Curso Globales
      const { data: monitorGlobal } = await supabase
        .from('ordenes_atencion')
        .select('*, agentes(nickname)')
        .eq('salon_id', salonId)
        .eq('fecha_registro::date', hoy) // Solo de hoy
        .in('estado_orden', ['En Curso', 'Pendiente'])
        .order('inicio_atencion', { ascending: false });

      setAgentesEnCola(procesados || []);
      setAgentesAusentes(ausentes || []);
      setAtencionesActivas(monitorGlobal || []);

    } catch (error) {
      console.error("Error cargando dashboard:", error.message);
    }
  }

  useEffect(() => {
    if (!salonId) return;
    loadDashboardData();
    const channel = supabase
      .channel('monitor-recepcion-global')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agentes' }, () => loadDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'asistencia' }, () => loadDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ordenes_atencion' }, () => loadDashboardData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [salonId]);

  async function confirmarAsignacion(datos) {
    try {
      const { error } = await supabase
        .from('ordenes_atencion')
        .insert([{
          salon_id: salonId,
          agente_id: datos.agenteId,
          cliente_manual: datos.clienteManual,
          tipo_servicio: datos.tipoServicio, 
          es_excepcion_cola: datos.excepcionCola !== 'Turno',
          estado_orden: 'En Asesoría',
          monto_estimado: datos.montoEstimado,
          es_penalizable: datos.excepcionCola === 'Turno',
          fecha_registro: new Date().toISOString()
        }]);

      if (error) throw error;
      if (datos.excepcionCola === 'Turno') {
        await supabase.rpc('asignar_al_final_de_cola', { agente_uuid: datos.agenteId, salon_uuid: salonId });
      }
      setAgenteParaAsignar(null);
      loadDashboardData();
    } catch (error) { alert("Error al asignar: " + error.message); }
  }

  async function resolverAtencionAgente(agenteId, ordenId) {
    try {
      const { data: orden } = await supabase.from('ordenes_atencion').select('es_penalizable').eq('id', ordenId).single();
      await supabase.from('ordenes_atencion').update({ estado_orden: 'Finalizada', fin_atencion: new Date().toISOString() }).eq('id', ordenId);
      await supabase.from('agentes').update({ estado_actual: 'Libre' }).eq('id', agenteId);
      if (orden?.es_penalizable) {
        const d = new Date();
        const hoy = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
        await supabase.from('asistencia').update({ entrada: new Date().toISOString() }).eq('agente_id', agenteId).eq('fecha', hoy);
      }
      loadDashboardData();
    } catch (error) { alert(error.message); }
  }

  async function registrarEntrada(agenteId) {
    const d = new Date();
    const hoy = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
    await supabase.from('asistencia').insert([{ agente_id: agenteId, salon_id: salonId, entrada: new Date().toISOString(), fecha: hoy }]);
    await supabase.from('agentes').update({ estado_actual: 'Libre' }).eq('id', agenteId);
    loadDashboardData();
  }

  async function gestionarRefrigerio(asistenciaId, campo) {
    await supabase.from('asistencia').update({ [campo]: new Date().toISOString() }).eq('id', asistenciaId);
    loadDashboardData();
  }

  return (
    <div className="dashboard-view" style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <header className="erp-header" style={{ marginBottom: '30px' }}>
        <h1>🛎️ Monitor: {sedeInfo?.nombre || 'Cargando...'}</h1>
        <div className="role-badge libre">DÍA: {new Date().toLocaleDateString()}</div>
      </header>

      {agenteParaAsignar && (
        <ModalAsignacion 
          agente={agenteParaAsignar}
          onClose={() => setAgenteParaAsignar(null)}
          onConfirm={confirmarAsignacion}
        />
      )}
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>
        
        {/* COLUMNA IZQUIERDA: PERSONAL EN SALA */}
        <section className="cola-section">
          <h2 className="section-title">🟢 Personal en Sala</h2>
          <div className="agentes-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {agentesEnCola.map((item, index) => {
              const necesitaLiberacion = item.ordenActiva?.estado_orden === 'Pendiente';
              return (
                <div key={item.id} className={`agente-card ${necesitaLiberacion ? 'alerta-cierre glow-blue' : ''}`}>
                  <div className="posicion">#{index + 1}</div>
                  <h3>{item.agentes.nickname}</h3>
                  <div className={`role-badge ${item.agentes.estado_actual?.toLowerCase() || 'libre'}`}>
                    {item.agentes.estado_actual || 'Libre'}
                  </div>
                  <p style={{ fontSize: '11px', marginTop: '5px' }}>Ingreso: {new Date(item.entrada).toLocaleTimeString()}</p>

                  <div style={{ display: 'flex', gap: '5px', marginTop: '10px', justifyContent: 'center' }}>
                    {!item.inicio_refrigerio ? (
                      <button className="btn-small" onClick={() => gestionarRefrigerio(item.id, 'inicio_refrigerio')}>☕ Ref</button>
                    ) : !item.fin_refrigerio ? (
                      <button className="btn-small" style={{ background: '#ffa500' }} onClick={() => gestionarRefrigerio(item.id, 'fin_refrigerio')}>✅ Fin</button>
                    ) : <span style={{fontSize: '10px', color: '#888'}}>Ref. Terminado</span>}
                  </div>

                  <div style={{ marginTop: '15px' }}>
                    {necesitaLiberacion ? (
                      <button className="btn-success pulse" style={{ width: '100%' }} onClick={() => resolverAtencionAgente(item.agentes.id, item.ordenActiva.id)}>
                        RESOLVER ✅
                      </button>
                    ) : (
                      <button className="btn-primary" style={{ width: '100%' }} disabled={item.agentes.estado_actual === 'Ocupado'} onClick={() => setAgenteParaAsignar(item.agentes)}>
                        {item.agentes.estado_actual === 'Ocupado' ? 'En Servicio...' : 'Asignar'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* COLUMNA DERECHA: ATENCIONES EN CURSO GLOBAL */}
        <section className="atenciones-section" style={{ background: '#f8fafc', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
          <h2 className="section-title">🕒 Atenciones en Curso</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {atencionesActivas.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>No hay servicios activos en este momento.</p>
            ) : (
              atencionesActivas.map(o => (
                <div key={o.id} className="ticket-mini-card" style={{ 
                  background: 'white', 
                  borderLeft: o.estado_orden === 'Pendiente' ? '5px solid var(--accent)' : '5px solid var(--success)',
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <strong>{o.cliente_manual}</strong>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{o.tipo_servicio} • {o.agentes?.nickname}</div>
                  </div>
                  <div className={`role-badge ${o.estado_orden === 'Pendiente' ? 'pendiente' : 'libre'}`} style={{ fontSize: '10px' }}>
                    {o.estado_orden === 'Pendiente' ? 'ESPERANDO CAJA' : 'TRABAJANDO'}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* SECCIÓN INFERIOR: POR INGRESAR */}
      <footer style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: '1rem', color: '#64748b', marginBottom: '15px' }}>⚪ Por Ingresar (Staff de Sede)</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {agentesAusentes.map((agente) => {
            const haNotificado = agente.estado_actual === 'Pendiente';
            return (
              <button 
                key={agente.id} 
                className={haNotificado ? "btn-success pulse" : "btn-wait"} 
                onClick={() => registrarEntrada(agente.id)}
                style={{ padding: '8px 15px', fontSize: '12px' }}
              >
                {haNotificado ? `✅ CONFIRMAR: ${agente.nickname}` : `+ ${agente.nickname}`}
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
}