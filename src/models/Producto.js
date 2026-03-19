export class Producto {
  constructor(data) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.stockActual = data.stock_actual;
    this.stockMinimo = data.stock_minimo;
    this.precio = data.precio_venta;
  }

  get necesitaReposicion() {
    return this.stockActual <= this.stockMinimo;
  }

  get estadoStock() {
    if (this.stockActual === 0) return 'Agotado';
    if (this.necesitaReposicion) return 'Bajo';
    return 'Normal';
  }
}