export function MenuNavegacion({ activeTab, setTab }) {
  return (
    <nav className="mobile-nav-bar">
      <button onClick={() => setTab('inicio')} className={activeTab === 'inicio' ? 'active' : ''}>
        🏠<span>Inicio</span>
      </button>
      <button onClick={() => setTab('insumos')} className={activeTab === 'insumos' ? 'active' : ''}>
        📦<span>Insumos</span>
      </button>
      <button onClick={() => setTab('stats')} className={activeTab === 'stats' ? 'active' : ''}>
        📈<span>Metas</span>
      </button>
      <button onClick={() => setTab('cartera')} className={activeTab === 'cartera' ? 'active' : ''}>
        👥<span>Clientes</span>
        </button>
      <button onClick={() => setTab('config')} className={activeTab === 'config' ? 'active' : ''}>
        ⚙️<span>Ajustes</span>
      </button>
    </nav>
  );
}