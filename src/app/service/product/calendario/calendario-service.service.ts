
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Evento } from '../../../calendario-component/calendario.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class CalendarioService {
  private eventos: Evento[] = [];
  private eventosSubject = new BehaviorSubject<Evento[]>([]);

  constructor() {}

  obtenerEventos(): Observable<Evento[]> {
    return this.eventosSubject.asObservable();
  }

  agregarEvento(evento: Omit<Evento, 'id'>): void {
    const nuevoEvento: Evento = { id: uuidv4(), ...evento };
    this.eventos.push(nuevoEvento);
    this.eventosSubject.next(this.eventos);
  }

  eliminarEvento(id: string): void {
    this.eventos = this.eventos.filter(evento => evento.id !== id);
    this.eventosSubject.next(this.eventos);
  }

  filtrarEventosPorDia(dia: string): Evento[] {
    return this.eventos.filter(evento => {
      const eventoDia = evento.fecha.toISOString().split('T')[0];
      return eventoDia === dia;
    });
  }
}
