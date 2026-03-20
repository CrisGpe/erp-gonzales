import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { getHoyLima, getAhoraLima } from '../../lib/utils';

export function ArqueoCaja({ salonId }) {
  const [arqueo, setArqueo] = useState(null);
  const [montoApertura, setMontoApertura] = useState("");
  const [billetes, setBilletes] = useState({});
  const [teorico, setTeorico] = useState(0);
  const [resumenEmisores, setResumenEmisores] = useState([]); // Nuevo estado
  const [loading, setLoading] = useState(true);

  const denominaciones = [200, 100, 50, 20, 10, 5, 2, 1, 0.50, 0.20, 0.10];

  useEffect(() => {
    fetchEstadoCaja();
  }, [salonId]);

  const fetchEstadoCaja = async () => {
    try {
      const hoy = getHoyLima();
      
      // 1. Ver si hay arqueo abierto
      const { data: arqueoData } = await supabase
        .from('arqueos_caja')
        .select('*')
        .eq('salon_id', salonId)
        .eq('fecha', hoy)
        .maybeSingle();
      
      setArqueo(arqueoData);

      if (arqueoData) {
        // 2. Obtener saldo teórico (RPC)
        const { data: totalTeorico } = await supabase.rpc('obtener_efectivo_teorico', {
          p_salon_id: salonId,
          p_fecha: hoy
        });
        setTeorico(totalTeorico || 0);

        // 3. Obtener Resumen por Emisor (Productividad)
        // Consultamos las órdenes finalizadas de hoy para este salón
        const { data: ordenesHoy } = await supabase
          .from('ordenes_atencion')
          .select(`
            monto_estimado,
            agente_id,
            agentes ( nickname ),
            servicios_json
          `)
          .eq('salon_id', salonId)
          .eq('estado_orden', 'Finalizada')
          .gte('fin_atencion', `${hoy}T00:00:00`);

        procesarResumenEmisores(ordenesHoy || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const procesarResumenEmisores = (ordenes) => {
    const resumen = ordenes.reduce((acc, curr) => {
      const nombre = curr.agentes?.nickname || 'Sin Nombre';
      if (!acc[nombre]) {
        acc[nombre] = { nickname: nombre, servicios: 0, total: 0 };
      }
      acc[nombre].servicios += (curr.servicios_json?.length || 0);
      acc[nombre].total += parseFloat(curr.monto_estimado || 0);
      return acc;
    }, {});
    setResumenEmisores(Object.values(resumen));
  };

  const abrirCaja = async () => {
    if (!montoApertura || montoApertura < 0) return alert("Monto de apertura inválido");
    const { error } = await supabase.from('arqueos_caja').insert([{
      salon_id: salonId,
      monto_apertura: parseFloat(montoApertura),
      hora_apertura: getAhoraLima(),
      fecha: getHoyLima(),
      estado: 'Abierto'
    }]);
    if (!error) fetchEstadoCaja();
  };

  const handleCerrarCaja = async () => {
    if (!window.confirm("¿Estás seguro de cerrar la caja definitivamente? No podrás registrar más ventas hoy.")) return;
    
    try {
      const { error } = await supabase
        .from('arqueos_caja')
        .update({
          estado: 'Cerrado',
          hora_cierre: getAhoraLima(),
          monto_cierre_teorico: teorico,
          monto_cierre_real: totalConteo,
          diferencia: totalConteo - teorico
        })
        .eq('id', arqueo.id);

      if (error) throw error;
      alert("✅ Caja cerrada exitosamente");
      fetchEstadoCaja();
    } catch (e) {
      alert(e.message);
    }
  };

  const totalConteo = Object.keys(billetes).reduce((acc, val) => {
    return acc + (parseFloat(val) * (billetes[val] || 0));
  }, 0);

  const diferencia = totalConteo - teorico;

  if (loading) return <div className="p-20">Verificando estado de caja...</div>;

  return (
    <div className="arqueo-wrapper">
      {!arqueo ? (
        <div className="apertura-caja-card anim-up">
          <div className="icon-apertura">☀️</div>
          <h2>Apertura de Turno</h2>
          <p>Indique el efectivo inicial en caja (sencillo/base)</p>
          <div className="input-apertura-group">
            <span>S/</span>
            <input 
              type="number" 
              value={montoApertura} 
              onChange={(e) => setMontoApertura(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <button className="btn-execute-pago" onClick={abrirCaja}>INICIAR OPERACIONES</button>
        </div>
      ) : (
        <>
          <div className="cierre-grid">
            <div className="conteo-panel">
              <h3>🧮 Desglose de Efectivo</h3>
              <div className="billetes-scroll">
                {denominaciones.map(d => (
                  <div key={d} className="billete-input">
                    <label>{d >= 1 ? `Billete/Moneda S/ ${d}` : `Moneda S/ ${d.toFixed(2)}`}</label>
                    <input 
                      type="number" 
                      min="0"
                      placeholder="0"
                      value={billetes[d] || ""}
                      onChange={(e) => setBilletes({...billetes, [d]: parseInt(e.target.value) || 0})}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="resumen-panel">
              <h3>📊 Balance de Cierre</h3>
              <div className="row-resumen">
                <span>Efectivo en Sistema:</span>
                <strong>S/ {teorico.toFixed(2)}</strong>
              </div>
              <div className="row-resumen">
                <span>Efectivo Contado:</span>
                <strong className="text-primary">S/ {totalConteo.toFixed(2)}</strong>
              </div>
              
              <div className={`alerta-diferencia ${diferencia < 0 ? 'negativa' : 'positiva'}`}>
                <span>Diferencia:</span>
                <h2>S/ {diferencia.toFixed(2)}</h2>
                <small>{diferencia === 0 ? "Caja Cuadrada" : diferencia < 0 ? "Faltante" : "Sobrante"}</small>
              </div>

              {arqueo.estado === 'Abierto' ? (
                <button className="btn-execute-pago" style={{background: '#1e293b'}} onClick={handleCerrarCaja}>
                  CERRAR CAJA DEFINITIVAMENTE
                </button>
              ) : (
                <div className="badge-cerrado">🔒 CAJA CERRADA</div>
              )}
            </div>
          </div>

          {/* CUADRO DE RESUMEN POR EMISOR */}
          <div className="resumen-emisores-container" style={{marginTop: '30px'}}>
             <h3 className="section-title">🏆 Productividad del Staff (Hoy)</h3>
             <div className="tabla-container">
               <table className="tabla-emisores">
                 <thead>
                   <tr>
                     <th>Emisor / Agente</th>
                     <th>Cant. Servicios</th>
                     <th>Producción Total</th>
                   </tr>
                 </thead>
                 <tbody>
                   {resumenEmisores.length > 0 ? resumenEmisores.map((e, i) => (
                     <tr key={i}>
                       <td>{e.nickname}</td>
                       <td>{e.servicios}</td>
                       <td><strong>S/ {e.total.toFixed(2)}</strong></td>
                     </tr>
                   )) : (
                     <tr><td colSpan="3">No hay ventas registradas hoy.</td></tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>
        </>
      )}
    </div>
  );
}