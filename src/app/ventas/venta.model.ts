export interface VentaItem {
    id: string;
    nombre: string;
    precio: number;
    cantidad: number;

  }
  
  export interface Venta {
    items: VentaItem[];
    total: number;
    fecha: Date;
    tipoPago: 'Efectivo' | 'Tarjeta' | 'Transferencia QR'; 
    id_Usuario:string;

  }