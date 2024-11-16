import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductoService } from '../product/productos.service';
import { Venta, VentaItem } from '../../../ventas/venta.model';
import { Observable, of, forkJoin, throwError } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { Producto } from '../../../productos/producto.model';

@Injectable({
  providedIn: 'root',
})
export class VentasService {
  private apiUrl = 'http://localhost:3000/ventas'; 

  constructor(
    private productoService: ProductoService,
    private http: HttpClient,
  ) {}

  registrarVenta(items: VentaItem[]): Observable<Venta> {
    let total = 0;

    const stockVerificacion$ = items.map(item =>
      this.productoService.obtenerProductoPorId(item.id).pipe(
        switchMap((producto: Producto) => {
          const nuevoStock = producto.stock - item.cantidad;
          if (nuevoStock >= 0) {
            return of({ producto, nuevoStock });
          } else {
            return throwError(`Stock insuficiente para el producto ${producto.nombre}`);
          }
        })
      )
    );

    return forkJoin(stockVerificacion$).pipe(
      switchMap((productosActualizados: { producto: Producto, nuevoStock: number }[]) => {
        const actualizacionesStock$ = productosActualizados.map(({ producto, nuevoStock }) =>
          this.productoService.actualizarStock(producto.id, nuevoStock)
        );

        total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

        return forkJoin(actualizacionesStock$).pipe(
          switchMap(() => {
            const venta: Venta = { items, total, fecha: new Date() };
            return this.guardarVenta(venta);
          })
        );
      }),
      tap(venta => this.guardarComprobante(venta)),
      catchError(error => {
        console.error('Error en la verificación de stock o en la venta:', error);
        return throwError('Error al procesar la venta. Verifique el stock e intente nuevamente.');
      })
    );
  }

  private guardarVenta(venta: Venta): Observable<Venta> {
    return this.http.post<Venta>(this.apiUrl, venta);
  }

  private guardarComprobante(venta: Venta): void {
    console.log("Comprobante guardado", venta);
  }


  buscarProductos(criterio: Partial<Producto>): Observable<Producto[]> {
    let params: any = {};
  
    if (criterio.id !== undefined) {
      params.id = criterio.id;
    }
    if (criterio.nombre) {
      params.nombre = criterio.nombre;
    }
  
    return this.http.get<Producto[]>(this.apiUrl, { params });
  }
  obtenerVentasDelDia(fecha: string): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.apiUrl}?fecha=${fecha}`);
  }
}