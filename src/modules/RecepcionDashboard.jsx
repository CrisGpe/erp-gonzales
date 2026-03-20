import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ModalAsignacion } from '../components/ModalAsignacion';
import { StaffEntry } from '../components/recepcion/StaffEntry';

// Nuevos Componentes Modularizados
import { HeaderRecepcion } from '../components/recepcion/HeaderRecepcion';
import { ListaAgentesSala } from '../components/recepcion/ListaAgentesSala';
import { MonitorAtenciones } from '../components/recepcion/MonitorAtenciones';
import { getAhoraLima, getHoyLima } from '../lib/utils';

import './Recepcion.css'; 

export function RecepcionDashboard({ salonId }) {
  const [agentesEnCola, setAgentesEnCola] = useState([]);
  const [agentesAusentes, setAgentesAusentes] = useState([]);
  const [atencionesActivas, setAtencionesActivas] = useState([]);
  const [sedeInfo, setSedeInfo] = useState(null);
  const [agenteParaAsignar, setAgenteParaAsignar] = useState(null);
  const [ticketEnEsperaParaAsignar, setTicketEnEsperaParaAsignar] = useState(null);
  const [busquedaStaff, setBusquedaStaff] = useState("");
  
  // --- 1. CARGA DE DATOS ---
  async function loadDashboardData() {
    try {
      const hoy = getHoyLima();
      const { data: sede } = await supabase.from('salones').select('nombre').eq('id', salonId).single();
      setSedeInfo(sede);

      // Traemos asistencia y sus agentes con sus órdenes activas
      const { data: enCola } = await supabase
        .from('asistencia')
        .select(`
          id, entrada, inicio_refrigerio, fin_refrigerio, salida, 
          agentes ( id, nickname, estado_actual, 
            ordenes_atencion(id, estado_orden, cliente_manual, fecha_registro, tipo_servicio) 
          )
        `)
        .eq('fecha', hoy)
        .is('salida', null)
        .order('entrada', { ascending: true });

      const idsEnSala = enCola?.map(a => a.agentes.id) || [];
      
      const { data: ausentes } = await supabase
        .from('agentes')
        .select('id, nickname, estado_actual, perfiles(nombre_completo)')
        .eq('salon_id', salonId)
        .eq('situacion', 'Activo')
        .not('id', 'in', `(${idsEnSala.length > 0 ? idsEnSala.join(',') : '00000000-0000-0000-0000-000000000000'})`);

      const procesados = enCola?.map(item => ({
        ...item,
        ordenActiva: item.agentes.ordenes_atencion?.find(o => 
          ['En Asesoría', 'En Curso', 'Pendiente'].includes(o.estado_orden)
        )
      }));

      const { data: monitorGlobal } = await supabase
        .from('ordenes_atencion')
        .select('*, agentes(nickname)')
        .eq('salon_id', salonId)
        .gte('fecha_registro', `${hoy}T00:00:00`)
        .in('estado_orden', ['En Espera', 'En Asesoría', 'En Curso', 'Pendiente'])
        .order('fecha_registro', { ascending: true });

      setAgentesEnCola(procesados || []);
      setAgentesAusentes(ausentes || []);
      setAtencionesActivas(monitorGlobal || []);
    } catch (error) { console.error("Error cargando datos:", error.message); }
  }

  useEffect(() => {
    if (!salonId) return;
    loadDashboardData();
    const channel = supabase.channel('monitor-global')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => loadDashboardData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [salonId]);

  // --- 2. FUNCIONES OPERATIVAS CORREGIDAS ---

  async function registrarEntrada(agenteId) {
    try {
      const ahora = getAhoraLima();
      const hoy = getHoyLima();
      await supabase.from('asistencia').insert([{ 
        agente_id: agenteId, 
        salon_id: salonId, 
        entrada: ahora, 
        fecha: hoy 
      }]);
      await supabase.from('agentes').update({ estado_actual: 'Libre' }).eq('id', agenteId);
      setBusquedaStaff(""); 
      loadDashboardData();
    } catch (e) { alert("Error entrada: " + e.message); }
  }

  async function asignarAgenteATicketExistente(agenteId) {
    if (!ticketEnEsperaParaAsignar) return;
    try {
      await supabase.from('ordenes_atencion').update({ 
        agente_id: agenteId, 
        estado_orden: 'En Asesoría', 
        inicio_atencion: getAhoraLima() // <--- CORREGIDO
      }).eq('id', ticketEnEsperaParaAsignar.id);
      
      await supabase.from('agentes').update({ estado_actual: 'Ocupado' }).eq('id', agenteId);
      await supabase.rpc('asignar_al_final_de_cola', { agente_uuid: agenteId, salon_uuid: salonId });
      setTicketEnEsperaParaAsignar(null); loadDashboardData();
    } catch (e) { alert(e.message); }
  }

  async function gestionarRefrigerio(asistenciaId, campo) {
    await supabase.from('asistencia').update({ [campo]: getAhoraLima() }).eq('id', asistenciaId);
    loadDashboardData();
  }

  async function confirmarAsignacion(datos) {
    try {
      await supabase.from('ordenes_atencion').insert([{
        salon_id: salonId, agente_id: datos.agenteId, cliente_manual: datos.clienteManual,
        tipo_servicio: datos.tipoServicio, es_excepcion_cola: datos.excepcionCola !== 'Turno',
        estado_orden: 'En Asesoría', monto_estimado: datos.montoEstimado,
        es_penalizable: datos.excepcionCola === 'Turno', 
        fecha_registro: getAhoraLima() // <--- CORREGIDO
      }]);
      if (datos.excepcionCola === 'Turno') await supabase.rpc('asignar_al_final_de_cola', { agente_uuid: datos.agenteId, salon_uuid: salonId });
      setAgenteParaAsignar(null); loadDashboardData();
    } catch (e) { alert("Error: " + e.message); }
  }

  async function resolverAtencionAgente(agenteId, ordenId) {
    try {
      const ahora = getAhoraLima();
      const hoy = getHoyLima();

      // 1. Finalizar la orden
      const { data: orden, error: errOrden } = await supabase
        .from('ordenes_atencion')
        .update({ estado_orden: 'Finalizada', fin_atencion: ahora })
        .eq('id', ordenId)
        .select('es_penalizable')
        .single();
      
      if (errOrden) throw errOrden;

      // 2. Liberar al agente
      await supabase.from('agentes').update({ estado_actual: 'Libre' }).eq('id', agenteId);
      
      // 3. Si penaliza, mandarlo al final de la cola de asistencia
      if (orden?.es_penalizable) {
        // CORRECCIÓN CLAVE: El filtro .eq('fecha', hoy) debe ser exacto YYYY-MM-DD
        const { error: errAsist } = await supabase.from('asistencia')
          .update({ entrada: ahora }) 
          .eq('agente_id', agenteId)
          .eq('fecha', hoy);
        
        if (errAsist) throw errAsist;
      }
      
      console.log("Agente resuelto exitosamente");
      loadDashboardData();
    } catch (e) { 
      console.error("Error en resolverAtencionAgente:", e);
      alert("Error al resolver: " + e.message); 
    }
  }

  async function registrarEspera() {
    const nombre = prompt("Nombre del cliente:");
    if(!nombre) return;
    await supabase.from('ordenes_atencion').insert([{ 
      salon_id: salonId, 
      cliente_manual: nombre, 
      estado_orden: 'En Espera', 
      tipo_servicio: 'Por definir', 
      fecha_registro: getAhoraLima() // <--- CORREGIDO
    }]);
    loadDashboardData();
  }

  return (
    <div className="dashboard-view">
      <HeaderRecepcion nombreSede={sedeInfo?.nombre} />
      
      <StaffEntry 
        busqueda={busquedaStaff} 
        setBusqueda={setBusquedaStaff} 
        staff={agentesAusentes} 
        onRegistrar={registrarEntrada} 
      />

      <div className="main-grid">
        <ListaAgentesSala 
          agentes={agentesEnCola} 
          onGestionarRefrigerio={gestionarRefrigerio} 
          onSetAgenteParaAsignar={setAgenteParaAsignar} 
          onResolverAtencion={resolverAtencionAgente} 
        />
        
        <MonitorAtenciones 
          atenciones={atencionesActivas} 
          onRegistrarEspera={registrarEspera} 
          onAsignarEspera={setTicketEnEsperaParaAsignar} 
        />
      </div>

      {/* Modales se mantienen igual... */}
    </div>
  );
}