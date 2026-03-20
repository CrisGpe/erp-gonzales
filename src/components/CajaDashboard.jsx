import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { CajaHeader } from '../components/caja/CajaHeader';
import { MenuCaja } from '../components/caja/MenuCaja';
import { ListaPendientes } from '../components/caja/ListaPendientes';
import { CarritoCobro } from '../components/caja/CarritoCobro';
import { PanelLiquidacion } from '../components/caja/PanelLiquidacion';
import { ArqueoCaja } from '../components/caja/ArqueoCaja';
import './Caja.css';

export function CajaDashboard({ salonId }) {
  const [tabActual, setTabActual] = useState('caja'); 
  const [ticketsPendientes, setTicketsPendientes] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);

  // Definimos la función de carga fuera del useEffect para que sea accesible
  const loadTickets = useCallback(async () => {
    if (!salonId) return;
    try {
      const { data, error } = await supabase
        .from('ordenes_atencion')
        .select('id, cliente_manual, monto_estimado, tipo_servicio, servicios_json, fecha_registro, agentes(nickname)')
        .eq('salon_id', salonId)
        .eq('estado_orden', 'Pendiente')
        .order('fecha_registro', { ascending: true });

      if (error) throw error;
      setTicketsPendientes(data || []);
    } catch (err) {
      console.error("Error cargando tickets:", err);
    } finally {
      setLoading(false);
    }
  }, [salonId]);

  // Efecto inicial y suscripción Realtime
  useEffect(() => {
    loadTickets();

    const channel = supabase.channel('caja-refresh')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'ordenes_atencion',
        filter: `salon_id=eq.${salonId}` 
      }, () => loadTickets())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [salonId, loadTickets]);

  if (loading) return (
    <div className="erp-container" style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', flexDirection:'column'}}>
      <h2>⏳ Cargando Caja...</h2>
    </div>
  );

  return (
    <div className="caja-app-container">
      <CajaHeader nombreSede="Principal" />
      <MenuCaja activeTab={tabActual} setTab={setTabActual} />
      
      <main className="caja-content-area" style={{padding: '20px'}}>
        {tabActual === 'caja' && (
          <div className="caja-main-grid">
            <ListaPendientes 
              tickets={ticketsPendientes} 
              onSeleccionar={(t) => !carrito.find(x => x.id === t.id) && setCarrito([...carrito, t])} 
            />
            <CarritoCobro 
              items={carrito} 
              onQuitar={(id) => setCarrito(carrito.filter(x => x.id !== id))}
              onVaciar={() => setCarrito([])}
            />
            <PanelLiquidacion 
              carrito={carrito} 
              salonId={salonId} 
              onSuccess={() => {
                setCarrito([]);
                loadTickets(); // Ahora loadTickets existe aquí y no falla
              }} 
            />
          </div>
        )}
        {tabActual === 'arqueo' && <ArqueoCaja salonId={salonId} />}
        
        {/* Otros tabs */}
        {!['caja', 'arqueo'].includes(tabActual) && (
          <div style={{textAlign:'center', padding:'50px'}}>Próximamente: {tabActual}</div>
        )}
      </main>
    </div>
  );
}