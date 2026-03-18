import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
console.log("Cliente Supabase:", supabase);

function App() {
  const [agentes, setAgentes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAgentes()
  }, [])

  async function getAgentes() {
    try {
      const { data, error } = await supabase
        .from('agentes') // Nombre de tu tabla en Supabase
        .select('*')
      
      if (error) throw error
      if (data) setAgentes(data)
    } catch (error) {
      alert('Error cargando agentes: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>ERP Gonzales - Monitor de Agentes</h1>
      <hr />

      {loading ? (
        <p>Cargando datos de Supabase...</p>
      ) : (
        <div style={{ display: 'grid', gap: '10px' }}>
          {agentes.map((agente) => (
            <div key={agente.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
              <p><strong>Agente:</strong> {agente.nombre}</p>
              {/* Ajusta 'agente.nombre' según las columnas de tu tabla */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App