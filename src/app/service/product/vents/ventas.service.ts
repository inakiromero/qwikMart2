import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductoService } from '../product/productos.service';
import { Venta, VentaItem } from '../../../ventas/venta.model';
import { Observable, of, forkJoin, throwError } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { Producto } from '../../../productos/producto.model';
import { AuthService } from '../Auth/usarios.service';

@Injectable({
  providedIn: 'root',
})
export class VentasService {
  private apiUrl = 'http://localhost:3000/ventas';

  constructor(
    private productoService: ProductoService,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  registrarVenta(
    items: VentaItem[],
    tipoPago: 'Efectivo' | 'Tarjeta' | 'Transferencia QR'
  ): Observable<Venta> {
    const token = this.authService.obtenerToken();
  
    if (!token) {
      return throwError(() => new Error('Usuario no autenticado. Inicie sesión para continuar.'));
    }
  
    // Verificación de stock de cada producto
    const stockVerificacion$ = items.map((item) =>
      this.productoService.obtenerProductoPorId(item.id, token).pipe(
        switchMap((producto: Producto) => {
          const nuevoStock = producto.stock - item.cantidad;
          if (nuevoStock >= 0) {
            return of({ producto, nuevoStock });
          } else {
            return throwError(() => new Error(
              `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}, solicitado: ${item.cantidad}.`
            ));
          }
        })
      )
    );
  
    return forkJoin(stockVerificacion$).pipe(
      switchMap((productosActualizados) => {
        const actualizacionesStock$ = productosActualizados.map(({ producto, nuevoStock }) => {
          if (!producto.id) {
            return throwError(() => new Error('El producto no tiene un ID válido.'));
          }
          return this.productoService.actualizarStock(producto.id, nuevoStock, token);
        });
  
        const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  
        return forkJoin(actualizacionesStock$).pipe(
          switchMap(() => {
            const venta: Venta = {
              items,
              total,
              fecha: new Date(),
              tipoPago,
              id_Usuario: token, // Usar el ID real del usuario
            };
            return this.guardarVenta(venta);
          })
        );
      }),
      catchError((error) => {
        console.error('Error en la verificación de stock o en la venta:', error);
        return throwError(() => new Error('Error al procesar la venta. Verifique el stock e intente nuevamente.'));
      })
    );
  }
  private guardarVenta(venta: Venta): Observable<Venta> {
    return this.http.post<Venta>(this.apiUrl, venta);
  }

  listarVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.apiUrl);
  }

  obtenerVentasPorUsuario(): Observable<Venta[]> {
    const usuarioActual = this.authService.obtenerToken();
    if (!usuarioActual) {
      return throwError('Usuario no autenticado. Inicie sesión para consultar ventas.');
    }
    return this.http.get<Venta[]>(`${this.apiUrl}?id_Usuario=${usuarioActual}`);
  }

  obtenerVentasPorRango(fechaInicio: Date, fechaFin: Date): Observable<Venta[]> {
    const usuarioActual = this.authService.obtenerToken();
    if (!usuarioActual) {
      return throwError('Usuario no autenticado. Inicie sesión para consultar ventas.');
    }

    return this.listarVentas().pipe(
      map((ventas: Venta[]) =>
        ventas.filter(
          (venta) =>
            venta.id_Usuario === usuarioActual &&
            new Date(venta.fecha) >= fechaInicio &&
            new Date(venta.fecha) <= fechaFin
        )
      )
    );
  }

  obtenerVentasDelDia(fechaHoy: string): Observable<Venta[]> {
    const usuarioActual = this.authService.obtenerToken();
    if (!usuarioActual) {
      return throwError('Usuario no autenticado. Inicie sesión para consultar ventas.');
    }

    
    return this.listarVentas().pipe(
      map((ventas: Venta[]) =>
        ventas.filter(
          venta =>
            venta.id_Usuario === usuarioActual &&
            new Date(venta.fecha).toISOString().split('T')[0] === fechaHoy
        )
      )
    );
  }

  obtenerVentasDelMes(): Observable<Venta[]> {
    const fechaInicio = new Date();
    fechaInicio.setDate(1); // Primer día del mes actual
    fechaInicio.setHours(0, 0, 0, 0);

    const fechaFin = new Date(fechaInicio);
    fechaFin.setMonth(fechaFin.getMonth() + 1, 0); // Último día del mes actual
    fechaFin.setHours(23, 59, 59, 999);

    return this.obtenerVentasPorRango(fechaInicio, fechaFin);
  }

  obtenerVentasDelAnio(): Observable<Venta[]> {
    const anioActual = new Date().getFullYear();
    const fechaInicio = new Date(anioActual, 0, 1); // 1 de enero
    const fechaFin = new Date(anioActual, 11, 31); // 31 de diciembre

    return this.obtenerVentasPorRango(fechaInicio, fechaFin);
  }

  generarTicket(ventaItems: VentaItem[], tipoPago: 'Efectivo' | 'Tarjeta' | 'Transferencia QR'): string {
    if (!ventaItems || ventaItems.length === 0) {
      return `No hay productos en esta venta.\nTotal: $0.00`;
    }

    const encabezado = `
      *** Ticket de Venta ***
      Fecha: ${new Date().toLocaleDateString()} Hora: ${new Date().toLocaleTimeString()}
      Tipo de Pago: ${tipoPago}
      -----------------------------
    `;

    let detalle = '';
    ventaItems.forEach((item) => {
      detalle += `
        ${item.nombre} x${item.cantidad} - $${(item.cantidad * item.precio).toFixed(2)}
      `;
    });

    const total = ventaItems.reduce((sum, item) => sum + item.cantidad * item.precio, 0);

    const totalLinea = `
      -----------------------------
      Total: $${total.toFixed(2)}
      -----------------------------
    `;

    return encabezado + detalle + totalLinea;
  }
}
