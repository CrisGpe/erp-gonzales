import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import './Agente.css'; 

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
      // Usamos maybeSingle para evitar error 406 si el registro no existe aún
      const { data: agData } = await supabase
        .from('agentes')
        .select('*, perfiles(nombre_completo)')
        .eq('perfil_id', userId)
        .maybeSingle();
      
      if (agData) {
        setAgente(agData);
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
      .select('*').eq('agente_id', agenteId).eq('fecha', hoy).is('salida', null).maybeSingle();
    
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
    if (!agente?.id) return;
    await supabase.from('agentes').update({ estado_actual: 'Pendiente' }).eq('id', agente.id);
    checkStatus(agente.id);
  }

  const agregarServicio = (idServicio) => {
    const serv = catalogoServicios.find(s => s.id === idServicio);
    if (!serv) return;
    setServiciosAgregados([...serviciosAgregados, { 
      ...serv, 
      tempId: Math.random().toString(36), 
      precio_editado: serv.precio_base 
    }]);
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
        orden_id: ordenParaTicket.id, 
        servicio_id: s.id, 
        agente_id: agente.id, 
        precio_cobrado: parseFloat(s.precio_editado || 0)
      }));
      await supabase.from('servicios_atencion').insert(inserts);
      await supabase.from('ordenes_atencion').update({ 
        estado_orden: 'Pendiente', 
        monto_estimado: montoTotal, 
        humor_cliente: humor 
      }).eq('id', ordenParaTicket.id);
      
      setOrdenParaTicket(null);
      setServiciosAgregados([]);
    } catch (e) { alert(e.message); }
  };

  if (loading) return <div className="dashboard-mobile">Cargando...</div>;

  if (!asistenciaHoy) {
    return (
      <div className="dashboard-mobile">
        <div className="card-mobile" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <h1>Hola, {agente?.nickname} 👋</h1>
          <p>Aún no has iniciado turno hoy.</p>
          {agente?.estado_actual === 'Pendiente' ? (
            <div className="posicion-cola-card">
              <span className="pulse-text">⏳ ESPERANDO RECEPCIÓN</span>
            </div>
          ) : (
            <button className="btn-primary btn-agente-action" onClick={notificarLlegada}>
              📢 NOTIFICAR LLEGADA
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-mobile">
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2>{agente.nickname}</h2>
        {ordenesPendientes.length === 0 && (
          <div className="posicion-cola-card">
            <span>POSICIÓN EN COLA:</span>
            <h1>{posicionCola}</h1>
          </div>
        )}
      </header>

      <main>
        {ordenesPendientes.map(orden => (
          <div key={orden.id} className="card-mobile glow-blue">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <span className="role-badge libre">{orden.es_excepcion_cola ? '⭐ EXCEPCIÓN' : '🔄 TURNO'}</span>
              <span className="role-badge pendiente">{orden.estado_orden}</span>
            </div>
            <h3 style={{ margin: '15px 0' }}>{orden.cliente_manual}</h3>
            {orden.estado_orden === 'En Asesoría' ? (
              <button className="btn-primary btn-agente-action" onClick={() => {
                supabase.from('ordenes_atencion').update({ estado_orden: 'En Curso', inicio_atencion: new Date().toISOString() }).eq('id', orden.id);
                supabase.from('agentes').update({ estado_actual: 'Ocupado' }).eq('id', agente.id);
              }}>CONFIRMAR</button>
            ) : (
              <button className="btn-success btn-agente-action" onClick={() => setOrdenParaTicket(orden)}>📝 FINALIZAR / TICKET</button>
            )}
          </div>
        ))}
      </main>

      {ordenParaTicket && (
        <div className="modal-full-screen">
          <h2>Ticket: {ordenParaTicket.cliente_manual}</h2>
          <select 
            className="input-precio-agente" 
            style={{width: '100%', textAlign: 'left', marginBottom: '20px'}}
            onChange={(e) => { agregarServicio(e.target.value); e.target.value = ""; }}
          >
            <option value="">+ Añadir Servicio</option>
            {catalogoServicios.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
          </select>

          <div style={{flex: 1}}>
            {serviciosAgregados.map(s => {
              const esInvalido = parseFloat(s.precio_editado) > 0 && parseFloat(s.precio_editado) < s.precio_base;
              return (
                <div key={s.tempId} className={`servicio-agregado-item ${esInvalido ? 'error' : ''}`}>
                  <div style={{ flex: 1 }}>
                    <strong>{s.nombre}</strong><br/>
                    <small>Mín: S/ {s.precio_base}</small>
                  </div>
                  <input 
                    type="number" 
                    className="input-precio-agente"
                    value={s.precio_editado} 
                    onChange={(e) => handlePrecioChange(s.tempId, e.target.value)} 
                  />
                  <button onClick={() => setServiciosAgregados(serviciosAgregados.filter(x => x.tempId !== s.tempId))} style={{ background: 'none', border: 'none', color: 'var(--danger)', marginLeft: '10px', fontSize: '1.2rem' }}>✕</button>
                </div>
              );
            })}
          </div>

          <div style={{ padding: '20px', textAlign: 'center', fontSize: '1.5rem', borderTop: '1px solid var(--border)' }}>
            TOTAL: <span style={{color: tieneErroresDePrecio() ? 'var(--danger)' : 'var(--success)'}}>
              S/ {serviciosAgregados.reduce((acc, s) => acc + parseFloat(s.precio_editado || 0), 0).toFixed(2)}
            </span>
          </div>
          
          <button 
            className="btn-primary btn-agente-action" 
            onClick={enviarACaja} 
            disabled={tieneErroresDePrecio()}
            style={{opacity: tieneErroresDePrecio() ? 0.5 : 1}}
          >
            ENVIAR A CAJA
          </button>
          <button className="btn-danger btn-agente-action" style={{background: 'transparent', color: 'var(--text-p)'}} onClick={() => setOrdenParaTicket(null)}>CANCELAR</button>
        </div>
      )}
    </div>
  );
}