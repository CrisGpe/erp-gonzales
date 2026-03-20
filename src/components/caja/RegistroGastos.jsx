import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { getAhoraLima, getHoyLima } from '../../lib/utils';

export function RegistroGastos({ salonId, onGastoRegistrado }) {
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");

  const handleGuardarGasto = async () => {
    if (!descripcion || !monto) return alert("Completa todos los campos");
    
    try {
      const { error } = await supabase.from('gastos_caja').insert([{
        salon_id: salonId,
        descripcion,
        monto: parseFloat(monto),
        fecha: getHoyLima(),
        hora: getAhoraLima()
      }]);

      if (error) throw error;
      alert("✅ Gasto registrado");
      setDescripcion(""); setMonto("");
      if (onGastoRegistrado) onGastoRegistrado();
    } catch (e) { alert(e.message); }
  };

  return (
    <div className="panel-pago" style={{marginTop: '20px'}}>
      <h3>💸 Registrar Gasto / Salida</h3>
      <input 
        type="text" placeholder="¿En qué se gastó?" 
        value={descripcion} onChange={e => setDescripcion(e.target.value)}
        style={{width: '100%', padding: '10px', marginBottom: '10px'}}
      />
      <input 
        type="number" placeholder="S/ Monto" 
        value={monto} onChange={e => setMonto(e.target.value)}
        style={{width: '100%', padding: '10px', marginBottom: '10px'}}
      />
      <button className="btn-agente-action btn-danger-solid" onClick={handleGuardarGasto}>
        Guardar Gasto
      </button>
    </div>
  );
}