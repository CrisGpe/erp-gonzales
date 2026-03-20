import { supabase } from '../../lib/supabase';

export function VistaConfiguracion() {
  return (
    <div className="dashboard-mobile">
      <div className="card-mobile">
        <h3>⚙️ Ajustes de Perfil</h3>
        <button className="btn-agente-action" style={{background: '#f1f5f9'}} onClick={() => alert("Cambiar foto...")}>📸 Cambiar Foto</button>
        <button className="btn-agente-action" style={{background: '#fee2e2', color: '#991b1b', marginTop: '20px'}} onClick={() => supabase.auth.signOut()}>
          🚪 Cerrar Sesión
        </button>
      </div>
    </div>
  );
}