import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import './Caja.css'; // Importación de estilos modulares

export function CajaDashboard({ salonId }) {
  const [ticketsPendientes, setTicketsPendientes] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [metodosPago, setMetodosPago] = useState({ efectivo: '', tarjeta: '', deposito: '' });
  const [tipoDoc, setTipoDoc] = useState('BOL');
  const [loading, setLoading] = useState(true);

  // 1. Cargar tickets enviados por agentes
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

    const channel = supabase.channel('caja-realtime')
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

  // Cálculos con redondeo para evitar errores de coma flotante en JS
  const totalCarrito = Math.round(carrito.reduce((acc, t) => acc + parseFloat(t.monto_estimado || 0), 0) * 100) / 100;
  
  const sumaPagos = Math.round((
    parseFloat(metodosPago.efectivo || 0) + 
    parseFloat(metodosPago.tarjeta || 0) + 
    parseFloat(metodosPago.deposito || 0)
  ) * 100) / 100;

  const diferencia = Math.round((totalCarrito - sumaPagos) * 100) / 100;

  // 3. Registro Final
  const registrarVenta = async (esPreRegistro = false) => {
    if (carrito.length === 0) return;
    
    if (!esPreRegistro && Math.abs(diferencia) > 0.01) {
      alert("⚠️ El monto total no coincide con el total a cobrar.");
      return;
    }

    try {
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
        .select().single();

      if (errVenta) throw errVenta;

      for (const ticket of carrito) {
        await supabase.from('servicios_atencion').update({ venta_id: venta.id }).eq('orden_id', ticket.id);

        if (!esPreRegistro) {
          await supabase.from('ordenes_atencion').update({ estado_orden: 'Finalizada' }).eq('id', ticket.id);
        }
      }

      alert(esPreRegistro ? "📝 Pre-registro guardado" : "💰 Venta exitosa");
      setCarrito([]);
      setMetodosPago({ efectivo: '', tarjeta: '', deposito: '' });
      loadTickets();

    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  if (loading) return <div className="erp-container">Cargando Caja...</div>;

  return (
    <div className="caja-container">
      {/* IZQUIERDA: TICKETS */}
      <aside className="panel-izquierdo">
        <h3 className="section-title">📋 Pendientes</h3>
        <div className="tickets-list">
          {ticketsPendientes.length === 0 ? (
            <p className="text-p">No hay órdenes</p>
          ) : (
            ticketsPendientes.map(ticket => (
              <div key={ticket.id} className="ticket-mini-card" onClick={() => agregarAlCarrito(ticket)}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{ticket.cliente_manual}</strong>
                  <span className="role-badge pendiente">S/ {ticket.monto_estimado}</span>
                </div>
                <small>{ticket.tipo_servicio}</small>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* CENTRO: DETALLE */}
      <main className="carrito-caja">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          <h3>🛒 Detalle de Cobro</h3>
          {carrito.length > 0 && <button className="btn-danger" onClick={() => setCarrito([])}>Vaciar</button>}
        </div>

        <div className="carrito-items" style={{ minHeight: '350px' }}>
          {carrito.length === 0 ? (
            <p style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-p)' }}>Seleccione tickets...</p>
          ) : (
            carrito.map(t => (
              <div key={t.id} className="item-venta-row">
                <div>
                  <strong>{t.cliente_manual}</strong>
                  <div style={{ fontSize: '11px', color: 'var(--text-p)' }}>
                    {t.servicios_atencion.map(s => s.servicios.nombre).join(', ')}
                  </div>
                </div>
                <span style={{ fontWeight: 'bold', textAlign: 'right' }}>S/ {t.monto_estimado}</span>
                <button className="btn-danger" style={{padding: '5px'}} onClick={() => quitarDelCarrito(t.id)}>✕</button>
              </div>
            ))
          )}
        </div>

        <div className="total-display" style={{ marginTop: '20px', padding: '20px', background: 'var(--text-h)', borderRadius: 'var(--radius)', color: 'white', textAlign: 'right' }}>
          <small style={{ opacity: 0.7 }}>TOTAL A COBRAR</small>
          <h2 style={{ fontSize: '2.5rem', margin: 0 }}>S/ {totalCarrito.toFixed(2)}</h2>
        </div>
      </main>

      {/* DERECHA: PAGOS */}
      <aside className="panel-pago">
        <h3 style={{ marginBottom: '20px' }}>📄 Liquidación</h3>
        
        <div className="metodos-pago-grid" style={{marginBottom: '20px'}}>
          <button className={tipoDoc === 'BOL' ? 'btn-primary' : 'btn-wait'} onClick={() => setTipoDoc('BOL')}>BOLETA</button>
          <button className={tipoDoc === 'FACT' ? 'btn-primary' : 'btn-wait'} onClick={() => setTipoDoc('FACT')}>FACTURA</button>
        </div>

        <div className="resumen-pago">
          {['efectivo', 'tarjeta', 'deposito'].map((metodo) => (
            <div key={metodo} className="input-row">
              <label style={{ textTransform: 'capitalize', fontSize: '12px', fontWeight: 'bold' }}>
                {metodo === 'deposito' ? '📱 Depósito / Yape' : metodo}
              </label>
              <input 
                type="number" 
                value={metodosPago[metodo]} 
                onChange={e => setMetodosPago({...metodosPago, [metodo]: e.target.value})}
                placeholder="0.00"
              />
            </div>
          ))}
        </div>

        <div style={{ 
          padding: '15px', 
          borderRadius: '8px', 
          background: diferencia === 0 ? '#dcfce7' : '#fee2e2', 
          margin: '20px 0', 
          textAlign: 'center',
          fontWeight: 'bold',
          color: diferencia === 0 ? '#166534' : '#991b1b'
        }}>
          {diferencia === 0 ? '✅ Monto Cuadrado' : `Faltan: S/ ${diferencia.toFixed(2)}`}
        </div>

        <button 
          className="btn-primary pulse" 
          style={{ width: '100%', padding: '20px', background: Math.abs(diferencia) < 0.01 ? 'var(--success)' : '#94a3b8' }}
          disabled={carrito.length === 0 || Math.abs(diferencia) > 0.01}
          onClick={() => registrarVenta(false)}
        >
          REGISTRAR COBRO
        </button>
        
        <button className="btn-wait" style={{ width: '100%', marginTop: '10px' }} onClick={() => registrarVenta(true)} disabled={carrito.length === 0}>
          Poner en Espera
        </button>
      </aside>
    </div>
  );
}