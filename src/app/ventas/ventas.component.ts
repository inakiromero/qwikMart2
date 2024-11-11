// ventas.component.ts
import { Component } from '@angular/core';
import { ProductoService } from '../service/product/productos.service';
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

  agregarProductoAVenta(producto: Producto): void {
    const itemExistente = this.ventaItems.find(item => item.id === producto.id);
    if (itemExistente) {
      itemExistente.cantidad++;
    } else {
      this.ventaItems.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
    }
  }

  procesarVenta(): void {
    this.ventasService.registrarVenta(this.ventaItems).subscribe(venta => {
      console.log('Venta realizada:', venta);
      this.ventaItems = []; // Limpiar la lista de la venta después de realizar la venta
    });
  }
}
