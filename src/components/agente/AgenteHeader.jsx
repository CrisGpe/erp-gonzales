import React from 'react';

export function AgenteHeader({ agente }) {
  // Definición de colores y etiquetas por estado
  const statusConfig = {
    'Libre': { color: '#10b981', label: 'EN COLA' },    // Verde
    'Ocupado': { color: '#ef4444', label: 'TRABAJANDO' }, // Rojo
    'Pendiente': { color: '#f59e0b', label: 'ESPERANDO' }, // Naranja
    'Refrigerio': { color: '#3b82f6', label: 'RECESO' },   // Azul
    'default': { color: '#94a3b8', label: 'DESCONECTADO' }
  };

  const currentStatus = statusConfig[agente?.estado_actual] || statusConfig['default'];

  return (
    <header className="agente-header-app">
      <div className="agente-profile-info">
        <div className="avatar-circle">
          {agente?.nickname?.charAt(0).toUpperCase()}
        </div>
        <div className="name-stack">
          <span className="welcome-text">Hola,</span>
          <span className="agente-nickname">{agente?.nickname}</span>
        </div>
      </div>

      <div className="status-pill" style={{ backgroundColor: `${currentStatus.color}15`, border: `1px solid ${currentStatus.color}` }}>
        <div className="status-dot" style={{ backgroundColor: currentStatus.color }}></div>
        <span style={{ color: currentStatus.color }}>{currentStatus.label}</span>
      </div>
    </header>
  );
}