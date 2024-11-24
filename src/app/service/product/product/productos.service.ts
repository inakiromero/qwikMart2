import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Producto } from '../../../productos/producto.model';
import { VentaItem } from '../../../ventas/venta.model';
import { AuthService } from '../Auth/usarios.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:3000/productos';

  constructor(private http: HttpClient,private authService: AuthService) {}

  obtenerProductos(): Observable<Producto[]> {
    const token = this.authService.obtenerToken();
    if (!token) {
      return throwError('Usuario no autenticado. Inicie sesión para continuar.');
    }
  
    const params = new HttpParams().set('id_Usuario', token);
    return this.http.get<Producto[]>(this.apiUrl, { params });
  }
  obtenerProductoPorId(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }
  buscarProductoPorIdYUsuario(id: string, idUsuario: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl, { params: { id, id_Usuario: idUsuario } });
  }
  
  buscarProductoPorNombreYUsuario(nombre: string, idUsuario: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl, { params: { nombre, id_Usuario: idUsuario } });
  }
  
  agregarProducto(producto: Producto): Observable<Producto> {
    const token = this.authService.obtenerToken();
    if (!token) {
      return throwError('Usuario no autenticado. Inicie sesión para continuar.');
    }
  
    const productoConUsuario = { ...producto, id_Usuario: token };
    return this.http.post<Producto>(this.apiUrl, productoConUsuario);
  }
  modificarProducto(id: string, datosActualizados: Partial<Producto>): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, datosActualizados);
  }

  eliminarProducto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  buscarProductos(criterio: Partial<Producto>): Observable<Producto[]> {
    const token = this.authService.obtenerToken(); // Obtiene el token directamente
    if (!token) {
      return throwError('Usuario no autenticado. Inicie sesión para continuar.');
    }
  
    let params = new HttpParams().set('id_Usuario', token); // Usa el token como identificador
  
    if (criterio.id) params = params.set('id', criterio.id);
    if (criterio.nombre) params = params.set('nombre', criterio.nombre);
    if (criterio.categoria) params = params.set('categoria', criterio.categoria);
  
    return this.http.get<Producto[]>(this.apiUrl, { params });
  }
  
  actualizarStock(id: string, cantidadVendida: number): Observable<Producto> {
    return this.http.patch<Producto>(`${this.apiUrl}/${id}`, {  stock:cantidadVendida });
  }

  generarComprobante(ventaItems: VentaItem[]): string {
    let total = 0;
    let comprobante = `Comprobante de Venta\n\n`;

    comprobante += 'Código\tNombre\tPrecio\tCantidad\tSubtotal\n';
    comprobante += '------------------------------------------------\n';

    ventaItems.forEach(item => {
      const subtotal = item.precio * item.cantidad;
      total += subtotal;
      comprobante += `${item.id}\t${item.nombre}\t$${item.precio.toFixed(2)}\t${item.cantidad}\t$${subtotal.toFixed(2)}\n`;
    });

    comprobante += '------------------------------------------------\n';
    comprobante += `Total: $${total.toFixed(2)}\n`;

    return comprobante;
  }
}