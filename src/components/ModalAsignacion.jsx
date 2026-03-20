import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function ModalAsignacion({ agente, onClose, onConfirm }) {
  // Estados para el formulario
  const [excepcionCola, setExcepcionCola] = useState('Turno');
  const [clienteNombre, setClienteNombre] = useState('');
  const [catSeleccionada, setCatSeleccionada] = useState('');
  const [subCatSeleccionada, setSubCatSeleccionada] = useState('');
  const [servicioFinal, setServicioFinal] = useState('');
  
  // Estados para los datos de la DB
  const [dbServicios, setDbServicios] = useState([]);
  const [listas, setListas] = useState({ categorias: [], subcategorias: [], nombres: [] });

  // 1. Cargar catálogo de servicios al montar
  useEffect(() => {
    async function loadServicios() {
      const { data, error } = await supabase
        .from('servicios')
        .select('*')
        .eq('es_activo', true);
      
      if (!error && data) {
        setDbServicios(data);
        const cats = [...new Set(data.map(s => s.categoria))].filter(Boolean).sort();
        setListas(prev => ({ ...prev, categorias: cats }));
      }
    }
    loadServicios();
  }, []);

  // 2. Filtro en cascada: Categoría -> Subcategoría
  useEffect(() => {
    if (catSeleccionada) {
      const subs = [...new Set(dbServicios
        .filter(s => s.categoria === catSeleccionada)
        .map(s => s.subcategoria))]
        .filter(Boolean).sort();
      setListas(prev => ({ ...prev, subcategorias: subs, nombres: [] }));
      setSubCatSeleccionada('');
      setServicioFinal('');
    }
  }, [catSeleccionada, dbServicios]);

  // 3. Filtro en cascada: Subcategoría -> Nombre del Servicio
  useEffect(() => {
    if (subCatSeleccionada) {
      const nombres = dbServicios
        .filter(s => s.categoria === catSeleccionada && s.subcategoria === subCatSeleccionada)
        .map(s => s.nombre).sort();
      setListas(prev => ({ ...prev, nombres }));
      setServicioFinal('');
    }
  }, [subCatSeleccionada, catSeleccionada, dbServicios]);

  // 4. Lógica de envío
  const handleConfirmar = () => {
    let valorTipoServicio = catSeleccionada;
    if (subCatSeleccionada) valorTipoServicio = subCatSeleccionada;
    if (servicioFinal) valorTipoServicio = servicioFinal;

    const servicioEncontrado = dbServicios.find(s => s.nombre === servicioFinal);
    const monto = servicioEncontrado ? servicioEncontrado.precio_base : null;

    onConfirm({ 
      agenteId: agente.id, 
      excepcionCola, 
      clienteManual: clienteNombre || 'POR ASIGNAR', 
      tipoServicio: valorTipoServicio,
      montoEstimado: monto
    });
  };

  return (
    <div className="modal-overlay">
      <div className="panel-izquierdo" style={{ maxWidth: '500px', width: '100%', margin: '20px' }}>
        <header style={{ marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: 'var(--text-h)' }}>🛎️ Nueva Asesoría</h2>
          <p style={{ margin: '5px 0 0', color: 'var(--accent)', fontWeight: 'bold' }}>Agente: {agente.nickname}</p>
        </header>
        
        <hr style={{ opacity: 0.1, marginBottom: '20px' }} />

        <div className="resumen-pago">
          {/* TIPO DE ATENCIÓN */}
          <div className="input-row" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>Tipo de Atención:</label>
            <select 
              value={excepcionCola} 
              onChange={(e) => setExcepcionCola(e.target.value)}
            >
              <option value="Turno">🔄 Por Turno (Penaliza cola)</option>
              <option value="Cliente">⭐ Cliente Directo (Solicitado)</option>
              <option value="Niño">👶 Atención Niño</option>
              <option value="Corrección">🛠️ Corrección de color/corte</option>
            </select>
          </div>

          {/* NOMBRE CLIENTE */}
          <div className="input-row" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>Nombre del Cliente:</label>
            <input 
              type="text" 
              placeholder="Escriba nombre o deje vacío..." 
              value={clienteNombre}
              onChange={(e) => setClienteNombre(e.target.value)}
            />
          </div>

          {/* SELECTS EN CASCADA (GRID) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div className="input-row">
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '5px' }}>Categoría:</label>
              <select 
                value={catSeleccionada} 
                onChange={(e) => setCatSeleccionada(e.target.value)}
              >
                <option value="">Seleccione...</option>
                {listas.categorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="input-row">
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '5px' }}>Subcategoría:</label>
              <select 
                value={subCatSeleccionada} 
                onChange={(e) => setSubCatSeleccionada(e.target.value)} 
                disabled={!catSeleccionada}
              >
                <option value="">Seleccione...</option>
                {listas.subcategorias.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* SERVICIO ESPECÍFICO */}
          <div className="input-row" style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>Servicio Específico (Opcional):</label>
            <select 
              value={servicioFinal} 
              onChange={(e) => setServicioFinal(e.target.value)} 
              disabled={!subCatSeleccionada}
            >
              <option value="">Nivel actual seleccionado...</option>
              {listas.nombres.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <p style={{fontSize: '0.7rem', color: 'var(--text-p)', marginTop: '8px', fontStyle: 'italic'}}>
              * Se registrará el nivel más específico seleccionado.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button 
            className="btn-primary pulse" 
            style={{ flex: 2, padding: '15px' }}
            disabled={!catSeleccionada}
            onClick={handleConfirmar}
          >
            Confirmar e Iniciar
          </button>
          <button 
            className="btn-danger" 
            style={{ flex: 1, background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)' }} 
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}