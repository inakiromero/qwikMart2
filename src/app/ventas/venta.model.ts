export interface VentaItem {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;

  }
  
  export interface Venta {
    items: VentaItem[];
    total: number;
    fecha: Date;
    tipoPago: 'Efectivo' | 'Tarjeta' | 'Transferencia QR'; 

  }