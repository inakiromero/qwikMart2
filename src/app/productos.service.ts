import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from './productos/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:3000/productos';

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  agregarProducto(producto: Omit<Producto, 'id'>): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  modificarProducto(id: number, datosActualizados: Partial<Producto>): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, datosActualizados);
  }

  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  buscarProductos(criterio: Partial<Producto>): Observable<Producto[]> {
    let params = new HttpParams();
    if (criterio.id !== undefined && criterio.id !== null) params = params.set('id', criterio.id.toString());
    if (criterio.nombre) params = params.set('nombre', criterio.nombre);
    if (criterio.categoria) params = params.set('categoria', criterio.categoria);

    return this.http.get<Producto[]>(this.apiUrl, { params });
  }
}