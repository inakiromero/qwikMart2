import { Injectable } from '@angular/core';
import { ProductoService } from '../productos.service';
import { Venta, VentaItem } from '../../../ventas/venta.model';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VentasService {
  constructor(private productoService: ProductoService) {}

  registrarVenta(items: VentaItem[]): Observable<Venta> {
    let total = 0;

    items.forEach(item => {
      total += item.precio * item.cantidad;
      this.productoService.modificarProducto(item.id, { stock: -item.cantidad }).subscribe(); // Actualizar stock
    });

    const venta: Venta = { items, total, fecha: new Date() };
    return of(venta).pipe(tap(() => this.guardarComprobante(venta)));
  }

  guardarComprobante(venta: Venta): void {
    console.log("Comprobante guardado", venta);
  }
}