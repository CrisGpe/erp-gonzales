import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getHoyLima, getAhoraLima } from '../lib/utils';

// Componentes Modularizados
import { AgenteHeader } from '../components/agente/AgenteHeader';
import { MenuNavegacion } from '../components/agente/MenuNavegacion';
import { VistaAsistencia } from '../components/agente/VistaAsistencia';
import { VistaAtenciones } from '../components/agente/VistaAtenciones';
import { VistaCartera } from '../components/agente/VistaCartera';

import './Agente.css'; 

export function AgenteDashboard({ userId }) {
  const [agente, setAgente] = useState(null);
  const [asistenciaHoy, setAsistenciaHoy] = useState(null);
  const [ordenesActivas, setOrdenesActivas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabActual, setTabActual] = useState('inicio'); // inicio, insumos, productividad, config

  useEffect(() => {
    async function initAgente() {
      const { data: agData } = await supabase.from('agentes')
        .select('*, perfiles(nombre_completo)')
        .eq('perfil_id', userId)
        .maybeSingle();
      
      if (agData) {
        setAgente(agData);
        fetchStatus(agData.id);

        // ESCUCHA GLOBAL DE CAMBIOS PARA ESTE AGENTE
        const channel = supabase.channel(`cambios-agente-${agData.id}`)
          .on(
            'postgres_changes', 
            { event: '*', schema: 'public', table: 'ordenes_atencion', filter: `agente_id=eq.${agData.id}` }, 
            (payload) => {
              console.log("Cambio detectado en órdenes:", payload);
              fetchStatus(agData.id);
            }
          )
          .on(
            'postgres_changes', 
            { event: '*', schema: 'public', table: 'asistencia', filter: `agente_id=eq.${agData.id}` }, 
            () => fetchStatus(agData.id)
          )
          .on(
            'postgres_changes', 
            { event: '*', schema: 'public', table: 'agentes', filter: `id=eq.${agData.id}` }, 
            (payload) => {
              setAgente(prev => ({ ...prev, ...payload.new }));
            }
          )
          .subscribe();

        return () => supabase.removeChannel(channel);
      }
    }
    initAgente();
  }, [userId]);

  async function fetchStatus(agenteId) {
    const hoy = getHoyLima();
    const { data: asist } = await supabase.from('asistencia')
      .select('*').eq('agente_id', agenteId).eq('fecha', hoy).is('salida', null).maybeSingle();
    setAsistenciaHoy(asist);

    const { data: ordenes } = await supabase.from('ordenes_atencion')
      .select('*').eq('agente_id', agenteId).in('estado_orden', ['En Asesoría', 'En Curso'])
      .order('fecha_registro', { ascending: false });
    
    setOrdenesActivas(ordenes || []);
    setLoading(false);
  }

  // RENDERIZADO CONDICIONAL DE VISTAS
  const renderContent = () => {
    if (!asistenciaHoy) return <VistaAsistencia agente={agente} onAvisar={() => fetchStatus(agente.id)} />;
    
    switch(tabActual) {
      case 'inicio': return <VistaAtenciones agente={agente} ordenes={ordenesActivas} onUpdate={() => fetchStatus(agente.id)} />;
      case 'insumos': return <div className="p-20">📦 Módulo de Insumos</div>;
      case 'stats': return <div className="p-20">📈 Mi Productividad</div>;
      case 'config': return <div className="p-20">⚙️ Configuración</div>;
      case 'cartera': return <VistaCartera agenteId={agente.id} />;
      default: return null;
    }
  };

  if (loading) return <div className="loading-screen">Cargando...</div>;

  return (
    <div className="agente-app-container">
      <AgenteHeader agente={agente} />
      
      <main className="agente-main-content">
        {renderContent()}
      </main>

      {asistenciaHoy && <MenuNavegacion activeTab={tabActual} setTab={setTabActual} />}
    </div>
  );
}