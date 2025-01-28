
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Evento } from '../../../calendario-component/calendario.model';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
  providedIn: 'root',
})
export class CalendarioService {
  private apiUrl = 'http://localhost:3000/eventos'; // URL de json-server
  

  constructor(private http: HttpClient) {}

  // Obtener eventos por usuario
  getEventosByUsuario(idUsuario: string): Observable<Evento[]> {
    return this.http
      .get<Evento[]>(`${this.apiUrl}?idUsuario=${idUsuario}`)
      .pipe(
        map((eventos) =>
          eventos.map((evento) => ({
            ...evento,
            fecha: new Date(evento.fecha), // Convertir fecha a objeto Date
          }))
        )
      );
  }

  // Crear un evento
  crearEvento(evento: Evento): Observable<Evento> {
    evento.id = uuidv4(); // Generar un ID único
    return this.http.post<Evento>(this.apiUrl, evento);
  }

  // Eliminar un evento
  eliminarEvento(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
  


