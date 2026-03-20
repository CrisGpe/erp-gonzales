export function VistaProductividad() {
  return (
    <div className="dashboard-mobile">
      <div className="card-mobile">
        <h3>📈 Mi Rendimiento</h3>
        <div className="stats-grid-mini">
          <div className="stat-box"><h4>0</h4><span>Servicios</span></div>
          <div className="stat-box"><h4>S/ 0</h4><span>Producción</span></div>
        </div>
        <div className="empty-state-placeholder">Módulo en construcción...</div>
      </div>
    </div>
  );
}