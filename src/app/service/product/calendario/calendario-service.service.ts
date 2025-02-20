
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, throwError } from 'rxjs';
import { Evento } from '../../../calendario-component/calendario.model';
import { AuthService } from '../Auth/usarios.service';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
  providedIn: 'root',
})
export class CalendarioService {
  private apiUrl = 'http://localhost:3000/eventos'; // URL de json-server
  

  constructor(private http: HttpClient,private authService: AuthService) {}

  // Obtener eventos por usuario
  getEventosByUsuario(): Observable<Evento[]> {
    const token = this.authService.obtenerToken();
    if (!token) {
      return throwError('Usuario no autenticado. Inicie sesión para continuar.');
    }
  
    return this.http
      .get<Evento[]>(`${this.apiUrl}?id_usuario=${token}`) // Cambiar `id_Usuario` a `id_usuario`
      .pipe(
        map((eventos) =>
          eventos.map((evento) => ({
            ...evento,
            fecha: new Date(evento.fecha), // Convertir fecha a objeto Date
          }))
        )
      );
  }
  crearEvento(evento: Evento): Observable<Evento> {
    const token = this.authService.obtenerToken();
    if (!token) {
      return throwError('Usuario no autenticado. Inicie sesión para continuar.');
    }
  
    const eventoConUsuario = { ...evento,id: uuidv4(), id_usuario: token }; // Usar `id_usuario`
    return this.http.post<Evento>(this.apiUrl, eventoConUsuario);
  }
  // Eliminar un evento
  eliminarEvento(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
  


