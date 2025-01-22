import { Component, OnInit } from '@angular/core';
import { CalendarioService } from '../service/product/calendario/calendario-service.service';
import { Evento } from './calendario.model';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario-component.component.html',
  styleUrls: ['./calendario-component.component.css'],
})
export class CalendarioComponent implements OnInit {
  eventos: Evento[] = [];
  nuevoEvento: Omit<Evento, 'id'> = { fecha: new Date(), descripcion: '' };
  diaSeleccionado: string = new Date().toISOString().split('T')[0];

  constructor(private calendarioService: CalendarioService) {}

  ngOnInit(): void {
    this.calendarioService.obtenerEventos().subscribe(eventos => {
      this.eventos = eventos;
    });
  }

  agregarEvento(): void {
    this.calendarioService.agregarEvento(this.nuevoEvento);
    this.nuevoEvento = { fecha: new Date(), descripcion: '' };
  }

  eliminarEvento(id: string): void {
    this.calendarioService.eliminarEvento(id);
  }

  esMismoDia(evento: Evento): boolean {
    const hoy = new Date().toISOString().split('T')[0];
    const eventoDia = evento.fecha.toISOString().split('T')[0];
    return hoy === eventoDia;
  }

  esDentroDeUnaHora(evento: Evento): boolean {
    const ahora = new Date();
    const diferenciaEnMilisegundos = evento.fecha.getTime() - ahora.getTime();
    return diferenciaEnMilisegundos > 0 && diferenciaEnMilisegundos <= 3600000;
  }
}
