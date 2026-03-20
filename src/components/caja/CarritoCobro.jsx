import React from 'react';

export function CarritoCobro({ items, onQuitar, onVaciar }) {
  const total = items.reduce((acc, t) => acc + parseFloat(t.monto_estimado || 0), 0);

  return (
    <main className="carrito-caja">
      <div className="carrito-header">
        <h3>🛒 Detalle de Cobro</h3>
        {items.length > 0 && <button className="btn-vaciar" onClick={onVaciar}>Vaciar Carrito</button>}
      </div>

      <div className="carrito-body">
        {items.length === 0 ? (
          <div className="empty-cart-msg">
            <span className="cart-icon">🛒</span>
            <p>Selecciona órdenes para procesar el pago</p>
          </div>
        ) : (
          items.map(t => (
            <div key={t.id} className="item-carrito-atencion">
              <div className="item-main-info">
                <div className="emisor-tag">Emisor: {t.agentes?.nickname || 'Agente'}</div>
                <strong>{t.cliente_manual}</strong>
                <div className="chips-container">
                  {t.servicios_json?.map((s, i) => (
                    <span key={i} className="chip-servicio">{s.nombre}</span>
                  ))}
                </div>
              </div>
              <div className="item-price-actions">
                <strong>S/ {t.monto_estimado}</strong>
                <button className="btn-remove-item" onClick={() => onQuitar(t.id)}>✕</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="total-display-area">
        <div className="total-row">
          <span>SUBTOTAL</span>
          <span>S/ {(total / 1.18).toFixed(2)}</span>
        </div>
        <div className="total-row">
          <span>IGV (18%)</span>
          <span>S/ {(total - (total / 1.18)).toFixed(2)}</span>
        </div>
        <div className="total-row-main">
          <span>TOTAL A COBRAR</span>
          <span>S/ {total.toFixed(2)}</span>
        </div>
      </div>
    </main>
  );
}