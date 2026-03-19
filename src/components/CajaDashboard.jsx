import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function CajaDashboard({ salonId }) {
  const [ticketsPendientes, setTicketsPendientes] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [metodosPago, setMetodosPago] = useState({ efectivo: 0, tarjeta: 0, deposito: 0 });
  const [tipoDoc, setTipoDoc] = useState('BOL'); // BOL o FACT
  const [loading, setLoading] = useState(true);

  // 1. Cargar tickets enviados por agentes (Estado: Pendiente)
  const loadTickets = async () => {
    const { data, error } = await supabase
      .from('ordenes_atencion')
      .select(`
        id, cliente_manual, monto_estimado, tipo_servicio,
        servicios_atencion ( id, precio_cobrado, servicios ( nombre ) )
      `)
      .eq('salon_id', salonId)
      .eq('estado_orden', 'Pendiente');

    if (!error) setTicketsPendientes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!salonId) return;
    loadTickets();

    // REALTIME: Escuchar cuando un agente envía un ticket nuevo
    const channel = supabase.channel('caja-dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ordenes_atencion' }, () => loadTickets())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'servicios_atencion' }, () => loadTickets())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [salonId]);

  // 2. Lógica del Carrito
  const agregarAlCarrito = (ticket) => {
    if (carrito.find(t => t.id === ticket.id)) return;
    setCarrito([...carrito, ticket]);
  };

  const quitarDelCarrito = (id) => {
    setCarrito(carrito.filter(t => t.id !== id));
  };

  const totalCarrito = carrito.reduce((acc, t) => acc + parseFloat(t.monto_estimado || 0), 0);
  const sumaPagos = parseFloat(metodosPago.efectivo || 0) + 
                    parseFloat(metodosPago.tarjeta || 0) + 
                    parseFloat(metodosPago.deposito || 0);

  const diferencia = totalCarrito - sumaPagos;

  // 3. Registro Final
  const registrarVenta = async (esPreRegistro = false) => {
    if (carrito.length === 0) return;
    
    // Validación de seguridad: el pago debe coincidir con el total si no es pre-registro
    if (!esPreRegistro && Math.abs(diferencia) > 0.01) {
      alert("⚠️ El monto total de los métodos de pago no coincide con el total a cobrar.");
      return;
    }

    try {
      // A. Crear registro en la tabla 'ventas'
      const { data: venta, error: errVenta } = await supabase
        .from('ventas')
        .insert([{
          salon_id: salonId,
          cliente_manual: carrito.map(c => c.cliente_manual).join(', '),
          tipo_comprobante: tipoDoc,
          monto_total: totalCarrito,
          metodo_pago: metodosPago,
          estado: esPreRegistro ? 'PRE-REGISTRO' : 'REGISTRADO'
        }])
        .select()
        .single();

      if (errVenta) throw errVenta;

      // B. Vincular servicios y cerrar órdenes
      for (const ticket of carrito) {
        // Marcamos servicios como facturados vinculándolos a la venta
        await supabase
          .from('servicios_atencion')
          .update({ venta_id: venta.id })
          .eq('orden_id', ticket.id);

        // Si es registro definitivo, cerramos la orden. 
        // Si es pre-registro, la dejamos en Pendiente para que siga en caja.
        if (!esPreRegistro) {
          await supabase
            .from('ordenes_atencion')
            .update({ estado_orden: 'Finalizada' })
            .eq('id', ticket.id);
        }
      }

      alert(esPreRegistro ? "📝 Pre-registro guardado correctamente" : "💰 Venta registrada con éxito");
      setCarrito([]);
      setMetodosPago({ efectivo: 0, tarjeta: 0, deposito: 0 });
      loadTickets();

    } catch (error) {
      alert("Error en el registro: " + error.message);
    }
  };

  return (
    <div className="caja-container">
      {/* SECCIÓN 1: ÓRDENES POR COBRAR */}
      <aside className="panel-izquierdo">
        <h3 className="section-title">📋 Tickets Pendientes</h3>
        <div className="tickets-list" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {ticketsPendientes.length === 0 ? (
            <p className="text-p" style={{ textAlign: 'center', marginTop: '20px' }}>No hay órdenes por cobrar</p>
          ) : (
            ticketsPendientes.map(ticket => (
              <div 
                key={ticket.id} 
                className={`ticket-mini-card glow-blue`} 
                onClick={() => agregarAlCarrito(ticket)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{ticket.cliente_manual}</strong>
                  <span className="role-badge pendiente">S/ {ticket.monto_estimado}</span>
                </div>
                <p style={{ fontSize: '11px', margin: '5px 0 0' }}>{ticket.tipo_servicio}</p>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* SECCIÓN 2: CARRITO DE COBRANZA */}
      <main className="carrito-caja">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3>🛒 Detalle de Cobro</h3>
          {carrito.length > 0 && (
            <button className="btn-danger" onClick={() => setCarrito([])} style={{ padding: '5px 10px', fontSize: '12px' }}>Vaciar</button>
          )}
        </div>

        <div className="carrito-items" style={{ minHeight: '300px', border: '1px dashed var(--border)', borderRadius: '8px', padding: '15px' }}>
          {carrito.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-p)', marginTop: '100px' }}>Seleccione órdenes de la izquierda para cobrar...</p>
          ) : (
            carrito.map(t => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <strong>{t.cliente_manual}</strong>
                  <ul style={{ fontSize: '12px', margin: '5px 0', color: 'var(--text-p)' }}>
                    {t.servicios_atencion.map(s => (
                      <li key={s.id}>{s.servicios.nombre}: S/ {s.precio_cobrado}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontWeight: 'bold' }}>S/ {t.monto_estimado}</span>
                  <button onClick={() => quitarDelCarrito(t.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>✕</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="total-display" style={{ marginTop: '20px', padding: '20px', background: 'var(--text-h)', borderRadius: '12px', color: 'white', textAlign: 'right' }}>
          <span style={{ fontSize: '14px', opacity: 0.8 }}>TOTAL A COBRAR</span>
          <h2 style={{ fontSize: '32px', margin: 0 }}>S/ {totalCarrito.toFixed(2)}</h2>
        </div>
      </main>

      {/* SECCIÓN 3: COMPROBANTE Y PAGO */}
      <aside className="panel-pago">
        <h3 style={{ marginBottom: '20px' }}>📄 Liquidación</h3>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
          <button 
            className={`btn-primary ${tipoDoc === 'BOL' ? '' : 'btn-wait'}`} 
            style={{ flex: 1, background: tipoDoc === 'BOL' ? 'var(--accent)' : 'white' }}
            onClick={() => setTipoDoc('BOL')}
          >BOL</button>
          <button 
            className={`btn-primary ${tipoDoc === 'FACT' ? '' : 'btn-wait'}`} 
            style={{ flex: 1, background: tipoDoc === 'FACT' ? 'var(--accent)' : 'white' }}
            onClick={() => setTipoDoc('FACT')}
          >FACT</button>
        </div>

        <div className="metodos-pago">
          <div className="input-row" style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>💵 Efectivo</label>
            <input 
              type="number" 
              value={metodosPago.efectivo} 
              onChange={e => setMetodosPago({...metodosPago, efectivo: e.target.value})}
              placeholder="0.00"
            />
          </div>
          <div className="input-row" style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>💳 Tarjeta</label>
            <input 
              type="number" 
              value={metodosPago.tarjeta} 
              onChange={e => setMetodosPago({...metodosPago, tarjeta: e.target.value})}
              placeholder="0.00"
            />
          </div>
          <div className="input-row" style={{ marginBottom: '25px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>📱 Yape / Plin / Depósito</label>
            <input 
              type="number" 
              value={metodosPago.deposito} 
              onChange={e => setMetodosPago({...metodosPago, deposito: e.target.value})}
              placeholder="0.00"
            />
          </div>
        </div>

        <div style={{ padding: '15px', borderRadius: '8px', background: diferencia === 0 ? '#dcfce7' : '#fee2e2', marginBottom: '20px', textAlign: 'center' }}>
          <small>{diferencia === 0 ? '✅ Monto Cuadrado' : `Faltan: S/ ${diferencia.toFixed(2)}`}</small>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button 
            className="btn-primary pulse" 
            style={{ padding: '18px', fontSize: '16px', background: Math.abs(diferencia) < 0.01 ? 'var(--success)' : '#94a3b8' }}
            disabled={carrito.length === 0 || Math.abs(diferencia) > 0.01}
            onClick={() => registrarVenta(false)}
          >
            REGISTRAR COBRO
          </button>
          <button 
            className="btn-wait" 
            onClick={() => registrarVenta(true)}
            disabled={carrito.length === 0}
          >
            Poner en Espera
          </button>
        </div>
      </aside>
    </div>
  );
}