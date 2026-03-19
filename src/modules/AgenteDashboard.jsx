import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function AgenteDashboard({ userId }) {
  const [agente, setAgente] = useState(null);
  const [asistenciaHoy, setAsistenciaHoy] = useState(null);
  const [ordenesPendientes, setOrdenesPendientes] = useState([]);
  const [posicionCola, setPosicionCola] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [ordenParaTicket, setOrdenParaTicket] = useState(null);
  const [catalogoServicios, setCatalogoServicios] = useState([]);
  const [serviciosAgregados, setServiciosAgregados] = useState([]);
  const [humor, setHumor] = useState("Neutral");

  const hoy = new Date().toISOString().split('T')[0];

  useEffect(() => {
    async function initAgente() {
      const { data: agData } = await supabase.from('agentes').select('*, perfiles(nombre_completo)').eq('perfil_id', userId).single();
      setAgente(agData);
      
      if (agData) {
        checkStatus(agData.id);
        fetchCatalogo();

        const channel = supabase.channel(`agente-realtime-${agData.id}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'asistencia' }, () => checkStatus(agData.id))
          .on('postgres_changes', { event: '*', schema: 'public', table: 'agentes' }, () => checkStatus(agData.id))
          .on('postgres_changes', { event: '*', schema: 'public', table: 'ordenes_atencion' }, () => fetchOrdenes(agData.id))
          .subscribe();

        return () => supabase.removeChannel(channel);
      }
    }
    initAgente();
  }, [userId]);

  async function checkStatus(agenteId) {
    const { data: asist } = await supabase.from('asistencia')
      .select('*').eq('agente_id', agenteId).eq('fecha', hoy).is('salida', null).single();
    
    setAsistenciaHoy(asist);

    if (asist) {
      const { data: todos } = await supabase.from('asistencia')
        .select('agente_id').eq('fecha', hoy).is('salida', null).order('entrada', { ascending: true });
      
      const idx = todos.findIndex(a => a.agente_id === agenteId);
      setPosicionCola(idx + 1);
      fetchOrdenes(agenteId);
    }
    setLoading(false);
  }

  async function fetchCatalogo() {
    const { data } = await supabase.from('servicios').select('*').eq('es_activo', true).order('nombre');
    setCatalogoServicios(data || []);
  }

  async function fetchOrdenes(agenteId) {
    const { data } = await supabase.from('ordenes_atencion').select('*')
      .eq('agente_id', agenteId).in('estado_orden', ['En Asesoría', 'En Curso']).order('fecha_registro', { ascending: false });
    setOrdenesPendientes(data || []);
  }

  async function notificarLlegada() {
    await supabase.from('agentes').update({ estado_actual: 'Pendiente' }).eq('id', agente.id);
    checkStatus(agente.id);
  }

  const agregarServicio = (idServicio) => {
    const serv = catalogoServicios.find(s => s.id === idServicio);
    if (!serv) return;
    setServiciosAgregados([...serviciosAgregados, { ...serv, tempId: Math.random().toString(36), precio_editado: serv.precio_base }]);
  };

  const handlePrecioChange = (tempId, valor) => {
    setServiciosAgregados(serviciosAgregados.map(s => s.tempId === tempId ? { ...s, precio_editado: valor } : s));
  };

  const tieneErroresDePrecio = () => {
    return serviciosAgregados.some(s => {
      const p = parseFloat(s.precio_editado);
      return p > 0 && p < s.precio_base;
    });
  };

  const enviarACaja = async () => {
    if (serviciosAgregados.length === 0) return alert("Agrega al menos un servicio");
    const montoTotal = serviciosAgregados.reduce((acc, s) => acc + parseFloat(s.precio_editado || 0), 0);
    try {
      const inserts = serviciosAgregados.map(s => ({
        orden_id: ordenParaTicket.id, servicio_id: s.id, agente_id: agente.id, precio_cobrado: parseFloat(s.precio_editado || 0)
      }));
      await supabase.from('servicios_atencion').insert(inserts);
      await supabase.from('ordenes_atencion').update({ estado_orden: 'Pendiente', monto_estimado: montoTotal, humor_cliente: humor }).eq('id', ordenParaTicket.id);
      setOrdenParaTicket(null);
      setServiciosAgregados([]);
    } catch (e) { alert(e.message); }
  };

  if (loading) return <div className="p-4">Cargando...</div>;

  // PANTALLA DE BIENVENIDA / NOTIFICACIÓN
  if (!asistenciaHoy) {
    return (
      <div className="dashboard-mobile" style={{ textAlign: 'center', paddingTop: '50px' }}>
        <div className="agente-card" style={{ padding: '40px 20px', margin: '20px' }}>
          <h1>Hola, {agente.nickname} 👋</h1>
          <p>Aún no has iniciado turno hoy.</p>
          {agente.estado_actual === 'Pendiente' ? (
            <div className="glow-blue" style={{ padding: '20px', borderRadius: '15px', marginTop: '20px' }}>
              <h3 className="pulse-text">⏳ ESPERANDO RECEPCIÓN</h3>
            </div>
          ) : (
            <button className="btn-primary" onClick={notificarLlegada} style={{ width: '100%', marginTop: '30px', padding: '20px' }}>
              📢 NOTIFICAR LLEGADA
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-mobile" style={{ padding: '10px', maxWidth: '600px', margin: '0 auto' }}>
      <header style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h2>{agente.nickname}</h2>
        {ordenesPendientes.length === 0 && (
          <div className="glow-blue" style={{padding: '20px', borderRadius: '15px', marginTop: '10px'}}>
            <span style={{fontSize: '0.8rem', color: 'var(--accent)'}}>POSICIÓN EN COLA:</span>
            <h1 style={{margin: 0, fontSize: '3rem'}}>{posicionCola}</h1>
          </div>
        )}
      </header>

      <main>
        {ordenesPendientes.map(orden => (
          <div key={orden.id} className="card-mobile" style={{ background: '#1e1e1e', borderRadius: '15px', padding: '15px', marginBottom: '15px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#888' }}>
              <span>{orden.es_excepcion_cola ? '⭐ EXCEPCIÓN' : '🔄 TURNO'}</span>
              <span>{orden.estado_orden}</span>
            </div>
            <h3 style={{ margin: '10px 0' }}>{orden.cliente_manual}</h3>
            {orden.estado_orden === 'En Asesoría' ? (
              <button className="btn-primary" onClick={() => {
                supabase.from('ordenes_atencion').update({ estado_orden: 'En Curso', inicio_atencion: new Date().toISOString() }).eq('id', orden.id);
                supabase.from('agentes').update({ estado_actual: 'Ocupado' }).eq('id', agente.id);
              }} style={{ width: '100%', padding: '12px' }}>CONFIRMAR</button>
            ) : (
              <button className="btn-success" onClick={() => setOrdenParaTicket(orden)} style={{ width: '100%', padding: '12px' }}>📝 FINALIZAR / TICKET</button>
            )}
          </div>
        ))}
      </main>

      {ordenParaTicket && (
        <div className="modal-full-screen" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#121212', zIndex: 1000, overflowY: 'auto', padding: '20px', color: 'white' }}>
          <h2>Ticket: {ordenParaTicket.cliente_manual}</h2>
          <select onChange={(e) => { agregarServicio(e.target.value); e.target.value = ""; }} style={{ width: '100%', padding: '15px', borderRadius: '10px', background: '#222', color: 'white', marginBottom: '20px' }}>
            <option value="">+ Añadir Servicio</option>
            {catalogoServicios.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
          </select>
          {serviciosAgregados.map(s => {
            const esInvalido = parseFloat(s.precio_editado) > 0 && parseFloat(s.precio_editado) < s.precio_base;
            return (
              <div key={s.tempId} style={{ background: '#1e1e1e', padding: '12px', borderRadius: '10px', marginBottom: '10px', display: 'flex', alignItems: 'center', border: esInvalido ? '2px solid #ff5252' : '1px solid #333' }}>
                <div style={{ flex: 1 }}><strong>{s.nombre}</strong><br/><small>Min: S/ {s.precio_base}</small></div>
                <input type="number" value={s.precio_editado} onChange={(e) => handlePrecioChange(s.tempId, e.target.value)} style={{ width: '80px', padding: '10px', textAlign: 'center', background: '#333', color: 'white' }} />
                <button onClick={() => setServiciosAgregados(serviciosAgregados.filter(x => x.tempId !== s.tempId))} style={{ background: 'none', border: 'none', color: '#ff5252', marginLeft: '10px' }}>✕</button>
              </div>
            );
          })}
          <div style={{ padding: '20px', textAlign: 'center', fontSize: '1.3rem', color: tieneErroresDePrecio() ? '#ff5252' : '#4caf50' }}>TOTAL: S/ {serviciosAgregados.reduce((acc, s) => acc + parseFloat(s.precio_editado || 0), 0).toFixed(2)}</div>
          <button onClick={enviarACaja} disabled={tieneErroresDePrecio()} style={{ width: '100%', padding: '18px', background: tieneErroresDePrecio() ? '#333' : '#7c4dff', borderRadius: '12px' }}>ENVIAR A CAJA</button>
          <button onClick={() => setOrdenParaTicket(null)} style={{ width: '100%', marginTop: '10px', background: 'transparent', color: '#888', border: 'none' }}>CANCELAR</button>
        </div>
      )}
    </div>
  );
}