import React from 'react';

export function MenuCaja({ activeTab, setTab }) {
  const opciones = [
    { id: 'caja', label: 'Cobrar', icon: '💸' },
    { id: 'arqueo', label: 'Arqueo', icon: '🧮' },
    { id: 'facturas', label: 'Facturas', icon: '🧾' },
    { id: 'cxc', label: 'Cuentas x Cobrar', icon: '📑' },
    { id: 'stats', label: 'Productividad', icon: '📈' }
  ];

  return (
    <nav className="caja-nav-tabs">
      {opciones.map(opt => (
        <button 
          key={opt.id} 
          className={activeTab === opt.id ? 'active' : ''} 
          onClick={() => setTab(opt.id)}
        >
          <span style={{marginRight: '8px'}}>{opt.icon}</span>
          {opt.label}
        </button>
      ))}
    </nav>
  );
}