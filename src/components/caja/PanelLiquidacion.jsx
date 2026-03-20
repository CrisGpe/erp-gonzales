import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { getAhoraLima } from '../../lib/utils';

export function PanelLiquidacion({ carrito, salonId, onSuccess }) {
  const [metodos, setMetodos] = useState({ efectivo: '', tarjeta: '', deposito: '' });
  const [tipoDoc, setTipoDoc] = useState('BOL'); // BOL o FACT

  const total = carrito.reduce((acc, t) => acc + parseFloat(t.monto_estimado || 0), 0);
  const subtotal = total / 1.18;
  const igv = total - subtotal;

  const sumaPagos = parseFloat(metodos.efectivo || 0) + 
                    parseFloat(metodos.tarjeta || 0) + 
                    parseFloat(metodos.deposito || 0);
  
  const diferencia = Math.round((total - sumaPagos) * 100) / 100;

  const handleCobro = async () => {
    try {
      const ahora = getAhoraLima();
      
      // 1. Crear la Venta
      const { data: venta, error: errVenta } = await supabase
        .from('ventas')
        .insert([{
          salon_id: salonId,
          cliente_manual: carrito.map(c => c.cliente_manual).join(', '),
          monto_total: total,
          monto_subtotal: subtotal,
          monto_igv: igv,
          tipo_comprobante: tipoDoc,
          metodos_pago: metodos,
          fecha_registro: ahora
        }])
        .select().single();

      if (errVenta) throw errVenta;

      // 2. Finalizar las Órdenes
      for (const t of carrito) {
        await supabase.from('ordenes_atencion')
          .update({ estado_orden: 'Finalizada', venta_id: venta.id })
          .eq('id', t.id);
      }

      alert("💰 Venta registrada con éxito");
      setMetodos({ efectivo: '', tarjeta: '', deposito: '' });
      onSuccess();
    } catch (e) {
      alert("Error en cobro: " + e.message);
    }
  };

  return (
    <aside className="panel-pago">
      <h3>📄 Liquidación</h3>
      
      <div className="metodos-pago-grid" style={{marginBottom: '20px'}}>
        <button className={tipoDoc === 'BOL' ? 'active' : ''} style={{padding: '10px', borderRadius: '8px', border: '1px solid #ddd'}} onClick={() => setTipoDoc('BOL')}>BOLETA</button>
        <button className={tipoDoc === 'FACT' ? 'active' : ''} style={{padding: '10px', borderRadius: '8px', border: '1px solid #ddd'}} onClick={() => setTipoDoc('FACT')}>FACTURA</button>
      </div>

      <div className="resumen-calculos" style={{fontSize: '0.9rem', color: '#64748b', marginBottom: '20px'}}>
        <div style={{display:'flex', justifyContent:'space-between'}}><span>Subtotal:</span> <span>S/ {subtotal.toFixed(2)}</span></div>
        <div style={{display:'flex', justifyContent:'space-between'}}><span>IGV (18%):</span> <span>S/ {igv.toFixed(2)}</span></div>
      </div>

      <div className="inputs-pago" style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
        {['efectivo', 'tarjeta', 'deposito'].map(m => (
          <div key={m} style={{display: 'flex', flexDirection: 'column'}}>
            <label style={{fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase'}}>{m}</label>
            <input 
              type="number" 
              placeholder="0.00" 
              style={{padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1.1rem'}}
              value={metodos[m]}
              onChange={(e) => setMetodos({...metodos, [m]: e.target.value})}
            />
          </div>
        ))}
      </div>

      <div className={`status-check ${diferencia === 0 ? 'ok' : 'pending'}`}>
        {diferencia === 0 ? '✅ MONTO CUADRADO' : `FALTAN: S/ ${diferencia.toFixed(2)}`}
      </div>

      <button 
        className="btn-execute-pago"
        disabled={carrito.length === 0 || diferencia !== 0}
        onClick={handleCobro}
      >
        REGISTRAR Y CERRAR
      </button>
    </aside>
  );
}