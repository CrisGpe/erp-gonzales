// src/lib/utils.js

// 1. Obtiene la fecha y hora completa en formato compatible con Postgres (Lima, Perú)
export const getAhoraLima = () => {
  const ahora = new Date();
  // Usamos el locale 'en-CA' porque devuelve YYYY-MM-DD
  const fecha = ahora.toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
  const hora = ahora.toLocaleTimeString('en-GB', { timeZone: 'America/Lima' }); // en-GB da formato 24h
  
  return `${fecha} ${hora}`; 
  // Resultado: "2026-03-19 23:55:01" -> Formato que Postgres AMA.
};

export const getHoyLima = () => {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
};

// 3. Alias por si algún componente viejo aún busca 'getLimaDate'
export const getLimaDate = getAhoraLima;