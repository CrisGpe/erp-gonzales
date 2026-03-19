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

  // 4. Lógica de envío (Mapping a los nombres de RecepcionDashboard)
  const handleConfirmar = () => {
    // Definimos qué nivel de detalle se guarda en 'tipo_servicio'
    let valorTipoServicio = catSeleccionada;
    if (subCatSeleccionada) valorTipoServicio = subCatSeleccionada;
    if (servicioFinal) valorTipoServicio = servicioFinal;

    // Buscamos el precio si se eligió un servicio específico
    const servicioEncontrado = dbServicios.find(s => s.nombre === servicioFinal);
    const monto = servicioEncontrado ? servicioEncontrado.precio_base : null;

    onConfirm({ 
      agenteId: agente.id, 
      excepcionCola, // Turno, Cliente, etc.
      clienteManual: clienteNombre || 'POR ASIGNAR', 
      tipoServicio: valorTipoServicio,
      montoEstimado: monto
    });
  };

  return (
    <div className="modal-overlay">
      <div className="login-card" style={{ maxWidth: '500px', textAlign: 'left', border: '1px solid var(--accent)' }}>
        <h2 style={{ marginTop: 0 }}>🛎️ Nueva Asesoría: {agente.nickname}</h2>
        <hr style={{ opacity: 0.1, marginBottom: '20px' }} />

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Tipo de Atención / Excepción:</label>
          <select 
            style={{ width: '100%', padding: '10px' }}
            value={excepcionCola} 
            onChange={(e) => setExcepcionCola(e.target.value)}
          >
            <option value="Turno">🔄 Por Turno (Penaliza cola)</option>
            <option value="Cliente">⭐ Cliente Directo (Solicitado)</option>
            <option value="Niño">👶 Atención Niño</option>
            <option value="Corrección">🛠️ Corrección de color/corte</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Nombre del Cliente:</label>
          <input 
            type="text" 
            placeholder="Escriba nombre o deje vacío para 'POR ASIGNAR'" 
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
            value={clienteNombre}
            onChange={(e) => setClienteNombre(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px' }}>Categoría:</label>
            <select 
              style={{ width: '100%', padding: '10px' }}
              value={catSeleccionada} 
              onChange={(e) => setCatSeleccionada(e.target.value)}
            >
              <option value="">Seleccione...</option>
              {listas.categorias.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px' }}>Subcategoría:</label>
            <select 
              style={{ width: '100%', padding: '10px' }}
              value={subCatSeleccionada} 
              onChange={(e) => setSubCatSeleccionada(e.target.value)} 
              disabled={!catSeleccionada}
            >
              <option value="">Seleccione...</option>
              {listas.subcategorias.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Servicio Específico (Opcional):</label>
          <select 
            style={{ width: '100%', padding: '10px' }}
            value={servicioFinal} 
            onChange={(e) => setServicioFinal(e.target.value)} 
            disabled={!subCatSeleccionada}
          >
            <option value="">Nivel actual seleccionado...</option>
            {listas.nombres.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <p style={{fontSize: '0.75rem', color: '#888', marginTop: '5px'}}>
            * Se registrará el nivel más específico que seleccione.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn-primary" 
            style={{ flex: 2, padding: '12px' }}
            disabled={!catSeleccionada} // Solo exigimos categoría para iniciar
            onClick={handleConfirmar}
          >
            Confirmar e Iniciar
          </button>
          <button 
            className="btn-danger" 
            style={{ flex: 1 }} 
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}