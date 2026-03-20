import React from 'react';

export function CajaHeader({ nombreSede }) {
  return (
    <header className="caja-header-clean">
      <div className="header-left">
        <span style={{fontSize: '1.5rem'}}>💰</span>
        <h1 style={{margin: 0, fontSize: '1.2rem', marginLeft: '10px'}}>
          Caja RD: {nombreSede || 'Principal'}
        </h1>
      </div>
      <button className="btn-logout-mini" onClick={() => window.location.reload()}>
        Cerrar Sesión
      </button>
    </header>
  );
}