import { supabase } from './lib/supabase';

async function diagnosticoTablas() {
  console.log("--- 🔍 INICIANDO DIAGNÓSTICO DE TABLAS ---");

  // 1. Probar lectura de Agentes
  const { data: agentes, error: errAgentes } = await supabase
    .from('agentes')
    .select('id, nickname, situacion, salon_id');

  if (errAgentes) {
    console.error("❌ Error en tabla 'agentes':", errAgentes.message);
  } else {
    console.log("✅ Tabla 'agentes' leída con éxito. Filas:", agentes.length);
    console.table(agentes);
  }

  // 2. Probar lectura de Asistencias
  const { data: asistencias, error: errAsistencias } = await supabase
    .from('asistencias')
    .select('*')
    .eq('fecha', new Date().toISOString().split('T')[0]);

  if (errAsistencias) {
    console.error("❌ Error en tabla 'asistencias':", errAsistencias.message);
    console.info("Nota: Si el error es 'relation does not exist', es que aún no has creado la tabla.");
  } else {
    console.log("✅ Tabla 'asistencias' leída con éxito. Filas hoy:", asistencias.length);
    console.table(asistencias);
  }

  console.log("--- 🏁 FIN DEL DIAGNÓSTICO ---");
}

diagnosticoTablas();