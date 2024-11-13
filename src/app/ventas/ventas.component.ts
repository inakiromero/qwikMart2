// ventas.component.ts
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

  constructor(private productoService: ProductoService, private ventasService: VentasService) {}

  buscarProducto(id: number | string): void {
    this.productoService.buscarProductos({ id: +id }).subscribe({
      next: productos => {
        if (productos.length > 0) {
          const producto = productos[0];
          this.agregarProductoAVenta(producto);
        }
      },
      error: error => console.error("Error al buscar producto", error),
    });
  }
  quitarProductoDeVenta(item: VentaItem): void {
    const index = this.ventaItems.findIndex(i => i.id === item.id);
    if (index !== -1) {
      this.ventaItems.splice(index, 1);
    }
  }


  agregarProductoAVenta(producto: Producto): void {
    const itemExistente = this.ventaItems.find(item => item.id === producto.id);
    if (itemExistente) {
      itemExistente.cantidad++;
    } else {
      this.ventaItems.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
    }
  }

  procesarVenta(): void {
    this.ventaItems.forEach(item => {
      const producto = this.productos.find(p => p.id === item.id);
      if (producto) {
        const nuevoStock = producto.stock - item.cantidad;

        if (nuevoStock >= 0) {  // Verificar que el stock no sea negativo
          this.productoService.actualizarStock(producto.id, nuevoStock).subscribe({
            next: () => console.log(`Stock actualizado para producto ${producto.nombre}`),
            error: error => console.error(`Error al actualizar stock para ${producto.nombre}:`, error)
          });
        } else {
          console.warn(`Stock insuficiente para ${producto.nombre}`);
        }
      }
    });

    this.ventasService.registrarVenta(this.ventaItems).subscribe({
      next: venta => {
        console.log('Venta realizada:', venta);
        this.ventaItems = [];
      },
      error: error => console.error('Error al registrar la venta:', error)
    });
  }
}
