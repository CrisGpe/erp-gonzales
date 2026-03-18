import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import csv from 'csv-parser';

dotenv.config();

// USAMOS LA SERVICE_ROLE_KEY si existe para saltar RLS en la migración
// Si no la tienes, usará la anon_key (pero el RLS podría bloquear el insert)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabaseUrl = process.env.VITE_SUPABASE_URL;

const supabase = createClient(supabaseUrl, supabaseKey);

// MAPA MANUAL CON TUS IDs DE SUPABASE
const salonMap = {
  "Sede Gonzales RD": "2a5fa6f8-ca23-43a2-a420-c01d3927cbea",
  "Sede Gloss": "c6c63463-311d-45f8-b503-1951dbc0a911",
  "Sede Luxury RD": "5f073638-a628-468d-bd28-fe43a06831ad"
};

async function migrar() {
  console.log('--- 🛡️ INICIO DE MIGRACIÓN (MODO MANUAL) ---');
  const resultados = [];

  fs.createReadStream('BBDD Supabase - Agentes_SB.csv')
    .pipe(csv())
    .on('data', (data) => resultados.push(data))
    .on('end', async () => {
      console.log(`🚀 Procesando ${resultados.length} filas del CSV...`);

      for (const row of resultados) {
        const nombreSedeCSV = row['Salón']?.trim();
        const salonId = salonMap[nombreSedeCSV];

        if (!salonId) {
          if (row.Colaboradores) {
            console.warn(`⚠️ Saltando a ${row.Colaboradores}: La sede "${nombreSedeCSV}" no coincide con los IDs manuales.`);
          }
          continue;
        }

        console.log(`\n🔹 Procesando: ${row.Colaboradores} para ${nombreSedeCSV}`);

        // 1. Insertar Perfil
        const { data: perfil, error: errPerfil } = await supabase
            .from('perfiles')
            .insert([{ 
                nombre_completo: row.Colaboradores, 
                genero: row.Genero || 'No especificado',
                rol: 'STAFF_OPERATIVO' // <--- Ahora sí funcionará
            }])
            .select().single();

        if (errPerfil) {
          console.error(`   ❌ Error al crear Perfil: ${errPerfil.message}`);
          continue;
        }

        // 2. Insertar Agente
        const { error: errAgente } = await supabase
          .from('agentes')
          .insert([{
            perfil_id: perfil.id,
            salon_id: salonId,
            nickname: row.Nickname || row.Colaboradores,
            especialidad: row.Especialidad || 'General',
            estado_actual: 'Libre',
            posicion_cola: 0
          }]);

        if (errAgente) {
          console.error(`   ❌ Error al crear Agente: ${errAgente.message}`);
        } else {
          console.log(`   ✅ Éxito: Registrado correctamente.`);
        }
      }
      console.log('\n--- 🏁 MIGRACIÓN FINALIZADA ---');
    });
}

migrar();