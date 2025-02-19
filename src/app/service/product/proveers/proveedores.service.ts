import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { Proveedor } from '../../../proveedores/proveedor.model';
import { AuthService } from '../Auth/usarios.service';

@Injectable({
  providedIn: 'root',
})
export class ProveedoresService {
  private apiUrl = 'http://localhost:3000/proveedores';

  constructor(private http: HttpClient, private authService: AuthService) {}

  obtenerProveedores(): Observable<Proveedor[]> {
    const token = this.authService.obtenerToken();
    if (!token) {
      return throwError('Usuario no autenticado. Inicie sesión para continuar.');
    }
  
    const params = new HttpParams().set('id_Usuario', token);
    return this.http.get<Proveedor[]>(this.apiUrl, { params });
  }
  
  agregarProveedor(proveedor: any): Observable<any> {
    const token = this.authService.obtenerToken();
    if (!token) {
      return throwError('Usuario no autenticado. Inicie sesión para continuar.');
    }
  
    const proveedorConUsuario = { ...proveedor, id_Usuario: token };
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((proveedores) => {
        const existeProveedor = proveedores.some(
          (p) => p.email === proveedor.email || p.nombre === proveedor.nombre
        );
  
        if (existeProveedor) {
          throw new Error('El proveedor ya existe con el mismo email o nombre.');
        }
        return proveedorConUsuario;
      }),
      catchError((error) => throwError(error)),
      switchMap((nuevoProveedor) => this.http.post<any>(this.apiUrl, nuevoProveedor))
    );
  }
  modificarProveedor(id: string, proveedor: Proveedor, idUsuario: string): Observable<Proveedor> {
    const payload = { ...proveedor, id_Usuario: idUsuario };
    return this.http.put<Proveedor>(`${this.apiUrl}/${id}`, payload);
  }

  eliminarProveedor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
