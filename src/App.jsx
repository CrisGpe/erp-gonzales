import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { Login } from './components/Login'
import './App.css' 

// IMPORTANTE: Importaciones de los módulos operativos
import { AdminDashboard } from './modules/AdminDashboard'
import { RecepcionDashboard } from './modules/RecepcionDashboard'
import { AgenteDashboard } from './modules/AgenteDashboard' // Ya lo importamos como módulo real

function App() {
  const [session, setSession] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) getPerfil(session.user.id)
      else setLoading(false)
    })

    // 2. Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        getPerfil(session.user.id)
      } else {
        setPerfil(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function getPerfil(userId) {
    try {
      const { data, error } = await supabase
        .from('perfiles')
        .select('rol, nombre_completo, salon_id, aprobado')
        .eq('id', userId)
        .single()

      if (error) throw error

      // Validación de cuenta aprobada
      if (data && !data.aprobado) {
        alert("Tu cuenta está pendiente de aprobación.")
        await supabase.auth.signOut()
        setLoading(false)
        return
      }

      setPerfil(data)
    } catch (error) {
      console.error("Error al obtener perfil:", error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="login-screen">
      <p>Cargando ERP Gonzales...</p>
    </div>
  )

  if (!session) return <Login />

  return (
    <div className="erp-container">
      <header className="erp-header">
        <div>
          <span>👤 <strong>{perfil?.nombre_completo}</strong></span>
          <span className="role-badge">{perfil?.rol}</span>
        </div>
        <button 
          onClick={() => supabase.auth.signOut()} 
          className="btn-danger"
        >
          Cerrar Sesión
        </button>
      </header>

     <main>
        {/* Agregamos ?. a todos por seguridad */}
        {perfil?.rol === 'SUPER_ADMIN' && <AdminDashboard />}
        
        {perfil?.rol === 'STAFF_RECEPCION' && (
          <RecepcionDashboard salonId={perfil.salon_id} /> 
        )}

        {perfil?.rol === 'STAFF_CAJA' && (
          <CajaDashboard salonId={perfil.salon_id} />
        )}

        {perfil?.rol === 'STAFF_OPERATIVO' && (
          <AgenteDashboard userId={session.user.id} />
        )}
      </main>
    </div>
  )
}

export default App