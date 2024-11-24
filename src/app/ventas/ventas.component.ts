import { Component } from '@angular/core';
import { ProductoService } from '../service/product/product/productos.service';
import { VentasService } from '../service/product/vents/ventas.service';
import { Producto } from '../productos/producto.model';
import { VentaItem } from './venta.model';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent {
  productos: Producto[] = [];
  ventaItems: VentaItem[] = [];
  busquedaRealizada: boolean = false; 
  tipoPago: 'Efectivo' | 'Tarjeta' | 'Transferencia QR' | '' = ''; // Inicializado vacío

  constructor(private productoService: ProductoService, private ventasService: VentasService) {}

  buscarProducto(valorBusqueda: string): void {
    const criterio = valorBusqueda.toLowerCase();
    
    this.productoService.obtenerProductos().subscribe({
      next: (productos) => {
        this.productos = productos.filter(producto =>
          producto.nombre.toLowerCase().includes(criterio)
        );
        this.busquedaRealizada = true;
  
        if (this.productos.length === 0) {
          console.log('No se encontraron productos que coincidan con el criterio.');
        }
      },
      error: (error) => {
        console.error('Error al buscar productos:', error);
        this.productos = [];
        this.busquedaRealizada = true;
      },
    });
  }
  quitarProductoDeVenta(item: VentaItem): void {
    const index = this.ventaItems.findIndex(i => i.id === item.id);
    
    if (index !== -1) {
      this.ventaItems[index].cantidad--;
  
      if (this.ventaItems[index].cantidad === 0) {
        this.ventaItems.splice(index, 1);
      }
    }
  }

  agregarProductoAVenta(producto: Producto): void {
    const itemExistente = this.ventaItems.find(item => item.id === producto.id );
    if (itemExistente) {
      itemExistente.cantidad++;
    } else {
      this.ventaItems.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
    }
  }

  procesarVenta(): void {
    if (!this.tipoPago) {
      console.error('Seleccione un tipo de pago.');
      return;
    }
  
    const venta = {
      items: this.ventaItems,
      fecha: new Date().toISOString(),
      total: this.ventaItems.reduce((sum, item) => sum + item.cantidad * item.precio, 0),
      tipoPago: this.tipoPago
    };
  
    this.ventasService.registrarVenta(this.ventaItems,this.tipoPago).subscribe({
      next: (respuesta) => {
        console.log('Venta realizada:', respuesta);
        this.abrirVentanaTicket();
        this.ventaItems = [];
        this.tipoPago = ''; // Resetea el tipo de pago
      },
      error: (error) => console.error('Error al registrar la venta:', error)
    });
  }
  

  abrirVentanaTicket(): void {
    if (!this.ventaItems || this.ventaItems.length === 0) {
      console.error('No hay productos para generar el ticket.');
      return;
    }
  
    const ticketHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ticket de Venta</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1, h2 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .total { font-weight: bold; text-align: right; }
        </style>
      </head>
      <body>
        <h1>Ticket de Venta</h1>
        <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()} <strong>Hora:</strong> ${new Date().toLocaleTimeString()}</p>
        <p><strong>Tipo de Pago:</strong> ${this.tipoPago}</p>
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${this.ventaItems
              .map(
                (item) => `
              <tr>
                <td>${item.nombre}</td>
                <td>${item.cantidad}</td>
                <td>$${item.precio.toFixed(2)}</td>
                <td>$${(item.cantidad * item.precio).toFixed(2)}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="total">Total</td>
              <td class="total">$${this.ventaItems
                .reduce((sum, item) => sum + item.cantidad * item.precio, 0)
                .toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </body>
      </html>
    `;
  
    const nuevaVentana = window.open('', '_blank', 'width=600,height=800');
    if (nuevaVentana) {
      nuevaVentana.document.open();
      nuevaVentana.document.write(ticketHTML);
      nuevaVentana.document.close();
      nuevaVentana.print();
    } else {
      console.error('No se pudo abrir la ventana del ticket.');
    }
  }
  
}
