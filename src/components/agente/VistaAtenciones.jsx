import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { getAhoraLima } from '../../lib/utils';

export function VistaAtenciones({ agente, ordenes, onUpdate }) {
  const [modalCancelacion, setModalCancelacion] = useState(null);
  const [modalServicios, setModalServicios] = useState(null); 
  
  // --- ESTADOS PARA DB DE SERVICIOS ---
  const [serviciosDB, setServiciosDB] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [seleccionado, setSeleccionado] = useState(null);
  const [precioEditable, setPrecioEditable] = useState("");

  // Estados para formularios de cancelación
  const [motivo, setMotivo] = useState("");
  const [humor, setHumor] = useState("Neutral");

  // Cargar lista de servicios al iniciar
  useEffect(() => {
    async function fetchServicios() {
      const { data } = await supabase.from('servicios').select('*').eq('es_activo', true).order('nombre');
      if (data) setServiciosDB(data);
    }
    fetchServicios();
  }, []);

  const handleIniciarServicio = async (orden) => {
    try {
      const ahora = getAhoraLima();
      await supabase.from('ordenes_atencion').update({ estado_orden: 'En Curso', inicio_atencion: ahora }).eq('id', orden.id);
      await supabase.from('agentes').update({ estado_actual: 'Ocupado' }).eq('id', agente.id);
      if (orden.es_penalizable) {
        await supabase.rpc('asignar_al_final_de_cola', { agente_uuid: agente.id, salon_uuid: agente.salon_id });
      }
      onUpdate();
    } catch (e) { alert(e.message); }
  };

  const handleAddServicio = async () => {
    if (!seleccionado || !precioEditable) return alert("Selecciona un servicio y confirma el precio");
    
    try {
        // 1. Validamos y limpiamos el objeto para evitar valores undefined o extraños
        const item = { 
        id: seleccionado.id, 
        nombre: String(seleccionado.nombre), 
        precio: parseFloat(precioEditable),
        categoria: seleccionado.categoria || "General"
        };
        
        // 2. Obtenemos la lista actual asegurando que sea un Array
        const listaActual = Array.isArray(modalServicios.servicios_json) 
        ? modalServicios.servicios_json 
        : [];
        
        const nuevaLista = [...listaActual, item];

        // 3. Intento de actualización con log detallado
        const { data, error } = await supabase
        .from('ordenes_atencion')
        .update({ servicios_json: nuevaLista }) // Supabase acepta el array directamente para columnas jsonb
        .eq('id', modalServicios.id)
        .select();

        if (error) {
        console.error("Error detallado de Supabase:", error);
        alert(`Error ${error.code}: ${error.message}`);
        return;
        }

        // 4. Si todo sale bien, actualizamos el estado local
        setModalServicios({ ...modalServicios, servicios_json: nuevaLista });
        setSeleccionado(null);
        setPrecioEditable("");
        setBusqueda("");
        onUpdate();
        
    } catch (e) { 
        console.error("Error en la lógica de la función:", e);
        alert("Ocurrió un error inesperado al procesar el servicio.");
    }
  };

  const handleFinalizarCobrar = async (orden) => {
  const confirmacion = window.confirm(`¿Finalizar atención de ${orden.cliente_manual} y enviar a caja?`);
    if (!confirmacion) return;

    try {
        const ahora = getAhoraLima();
        
        // Calculamos el monto total de los servicios acumulados
        const montoTotal = orden.servicios_json?.reduce((acc, s) => acc + parseFloat(s.precio), 0) || 0;

        // 1. Actualizamos la orden: Estado 'Pendiente' (de cobro) y guardamos el monto final
        const { error: ordenError } = await supabase
        .from('ordenes_atencion')
        .update({ 
            estado_orden: 'Pendiente', 
            fin_atencion: ahora,
            monto_estimado: montoTotal // Sincronizamos el total para Caja
        })
        .eq('id', orden.id);

        if (ordenError) throw ordenError;

        // 2. Liberamos al agente (Pasa a Libre, lo que lo pone al final de la cola)
        await supabase.from('agentes').update({ estado_actual: 'Libre' }).eq('id', agente.id);

        // 3. Si la orden es penalizable, aseguramos su posición al final de la cola de asistencia
        if (orden.es_penalizable) {
        await supabase.from('asistencia')
            .update({ entrada: ahora })
            .eq('agente_id', agente.id)
            .eq('fecha', getHoyLima());
        }

        alert("✅ Enviado a Caja. Tu estado ahora es LIBRE.");
        onUpdate();
    } catch (e) {
        alert("Error al finalizar: " + e.message);
    }
    };

  const handleConfirmarCancelacion = async () => {
    if (!motivo) return alert("Por favor escribe un motivo");
    try {
      const ahora = getAhoraLima();
      await supabase.from('ordenes_atencion').update({ 
        estado_orden: 'Cancelada', motivo_cancelacion: motivo, humor_cliente: humor, fin_atencion: ahora 
      }).eq('id', modalCancelacion.id);
      await supabase.from('agentes').update({ estado_actual: 'Libre' }).eq('id', agente.id);
      setModalCancelacion(null);
      setMotivo("");
      onUpdate();
    } catch (e) { alert(e.message); }
  };

  // Filtrado de servicios para el buscador
  const sugerencias = busqueda.length > 1 
    ? serviciosDB.filter(s => s.nombre.toLowerCase().includes(busqueda.toLowerCase())).slice(0, 5)
    : [];

  return (
    <div className="dashboard-mobile">
      {ordenes.length === 0 ? (
        <div className="posicion-cola-card">
          <span>Tu posición actual</span>
          <h1>--</h1>
          <p>Esperando asignación de recepción...</p>
        </div>
      ) : (
        ordenes.map(o => (
          <div key={o.id} className={`card-mobile ${o.estado_orden === 'En Curso' ? 'border-active' : ''}`}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h2 style={{margin: 0, fontSize: '1.2rem'}}>{o.cliente_manual}</h2>
              <span className={`badge-status ${o.estado_orden.toLowerCase().replace(" ", "-")}`}>
                {o.estado_orden}
              </span>
            </div>
            
            <div className="resumen-servicios-card">
              {o.servicios_json?.length > 0 ? (
                 o.servicios_json.map((s, i) => (
                   <div key={i} className="mini-item-servicio">
                     <span>{s.nombre}</span> <b>S/ {s.precio}</b>
                   </div>
                 ))
              ) : <p className="text-muted">Sin servicios registrados</p>}
            </div>

            <div className="agente-actions-grid" style={{display: 'grid', gap: '10px', marginTop: '10px'}}>
              {o.estado_orden === 'En Asesoría' ? (
                <>
                  <button className="btn-agente-action btn-primary-solid" onClick={() => handleIniciarServicio(o)}>
                    🚀 INICIAR SERVICIO
                  </button>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                    <button className="btn-agente-action btn-danger-light" onClick={() => setModalCancelacion(o)}>❌ CANCELAR</button>
                    <button className="btn-agente-action btn-secondary-light" onClick={() => alert("Citas en desarrollo...")}>📅 CITAR</button>
                  </div>
                </>
              ) : (
                <>
                  <button className="btn-agente-action btn-add-service" onClick={() => setModalServicios(o)}>➕ AÑADIR SERVICIO</button>
                  <button className="btn-agente-action btn-success-solid" onClick={() => handleFinalizarCobrar(o)}>💰 FINALIZAR Y COBRAR</button>
                </>
              )}
            </div>
          </div>
        ))
      )}

      {/* MODAL SERVICIOS CON BUSCADOR DB */}
      {modalServicios && (
        <div className="modal-overlay">
          <div className="modal-content modal-full-width">
            <h3 style={{marginBottom: '15px'}}>Servicios: {modalServicios.cliente_manual}</h3>
            
            <div className="form-servicio-db">
              <input 
                type="text" placeholder="Buscar servicio (ej: Manicure)" 
                value={busqueda} onChange={e => setBusqueda(e.target.value)}
              />
              
              {/* Sugerencias */}
              {sugerencias.length > 0 && !seleccionado && (
                <div className="dropdown-servicios" style={{ 
                    position: 'absolute', 
                    zIndex: 999, 
                    width: '100%', 
                    background: 'white', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    marginTop: '2px'
                }}>
                    {sugerencias.map(s => (
                    <div 
                        key={s.id} 
                        className="sugerencia-item" 
                        style={{ 
                        padding: '12px', 
                        borderBottom: '1px solid #f1f5f9', 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                        }}
                        onClick={() => {
                        setSeleccionado(s);
                        setPrecioEditable(s.precio_base);
                        setBusqueda(s.nombre);
                        }}
                    >
                        <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{s.nombre}</span> 
                        <small style={{ color: '#64748b' }}>S/ {s.precio_base}</small>
                    </div>
                    ))}
                </div>
                )}

              {seleccionado && (
                <div className="confirm-service-area anim-fade-in">
                  <div className="price-row">
                    <label>Precio Final:</label>
                    <input type="number" value={precioEditable} onChange={e => setPrecioEditable(e.target.value)} />
                  </div>
                  <button className="btn-agente-action btn-primary-solid" onClick={handleAddServicio}>Confirmar e Incluir</button>
                </div>
              )}
            </div>

            <div className="lista-servicios-acumulados">
              <p style={{fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b'}}>CUENTA ACTUAL:</p>
              {modalServicios.servicios_json?.map((s, i) => (
                <div key={i} className="servicio-agregado-item">
                  <span>{s.nombre}</span> <strong>S/ {s.precio}</strong>
                </div>
              ))}
            </div>
            
            <button className="btn-agente-action btn-secondary-light" onClick={() => {setModalServicios(null); setSeleccionado(null); setBusqueda("");}} style={{marginTop: '15px'}}>
              Cerrar Detalle
            </button>
          </div>
        </div>
      )}

      {/* Modal Cancelación */}
      {modalCancelacion && (
        <div className="modal-overlay">
           <div className="modal-content" style={{padding: '20px', borderRadius: '15px', background: 'white', width: '90%'}}>
            <h3>Cancelar: {modalCancelacion.cliente_manual}</h3>
            <textarea 
              className="input-precio-agente" 
              style={{width: '100%', height: '80px', textAlign: 'left', fontSize: '1rem', marginTop: '10px'}}
              value={motivo} onChange={(e) => setMotivo(e.target.value)}
              placeholder="¿Por qué se canceló?"
            />
            <select style={{width: '100%', padding: '10px', borderRadius: '8px', marginTop: '10px'}} value={humor} onChange={(e) => setHumor(e.target.value)}>
              <option value="Neutral">😐 Neutral</option>
              <option value="Molesto">😠 Molesto</option>
              <option value="Satisfecho">😊 Satisfecho</option>
            </select>
            <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
              <button className="btn-agente-action btn-danger-solid" onClick={handleConfirmarCancelacion}>Confirmar</button>
              <button className="btn-agente-action btn-secondary-light" onClick={() => setModalCancelacion(null)}>Volver</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}