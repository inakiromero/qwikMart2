import { Component, OnInit } from '@angular/core';
import { CalendarioService } from '../service/product/calendario/calendario-service.service';
import { Evento } from './calendario.model';
import { AuthService } from '../service/product/Auth/usarios.service';


@Component({
  selector: 'app-calendario',
  templateUrl: './calendario-component.component.html',
  styleUrls: ['./calendario-component.component.css'],
})
export class CalendarioComponent implements OnInit {
  eventos: Evento[] = [];
  nuevoEvento: Evento = {
    id: '',
    fecha: new Date,
    descripcion: '',
    id_usuario: '', // Este valor se establecerá según el usuario autenticado
  };
  constructor(private calendarioService: CalendarioService,private authService: AuthService) {}

  ngOnInit(): void {
    this.cargarEventos();
  }
   cargarEventos(): void {
    const idUsuario = this.authService.obtenerToken(); // Obtén el ID del usuario actual
    if (!idUsuario) {
      console.error('Error: No se pudo obtener el ID del usuario desde el token.');
      return;
    }


    this.calendarioService.getEventosByUsuario(idUsuario).subscribe({
      next: (eventos) => {
        this.eventos = eventos;
      },
      error: (err) => {
        console.error('Error al cargar eventos:', err);
      },
    });
  }

  agregarEvento(): void {

    const idUsuario = this.authService.obtenerToken(); // Obtén el ID del usuario actual
    if (!idUsuario) {
      console.error('Error: No se pudo obtener el ID del usuario desde el token.');
      return;
    }


    if (this.nuevoEvento.descripcion && this.nuevoEvento.fecha) {
      this.nuevoEvento.id_usuario = idUsuario; // Asociar evento al usuario actual
      this.calendarioService.crearEvento(this.nuevoEvento).subscribe({
        next: (eventoCreado) => {
          this.eventos.push(eventoCreado); // Agregar el nuevo evento a la lista
          this.nuevoEvento = { id: '', fecha: new Date, descripcion: '', id_usuario: idUsuario }; // Limpiar formulario
        },
        error: (err) => {
          console.error('Error al agregar evento:', err);
        },
      });
    }
  }

  eliminarEvento(id: string): void {
    this.calendarioService.eliminarEvento(id).subscribe({
      next: () => {
        this.eventos = this.eventos.filter((evento) => evento.id !== id);
      },
      error: (err) => {
        console.error('Error al eliminar evento:', err);
      },
    });
  }

esMismoDia(evento: Evento): boolean {
  const hoy = new Date();
  const fechaEvento = new Date(evento.fecha);

  return (
    hoy.getFullYear() === fechaEvento.getFullYear() &&
    hoy.getMonth() === fechaEvento.getMonth() &&
    hoy.getDate() === fechaEvento.getDate()
  );
}

faltaUnaHora(evento: Evento): boolean {
  const ahora = new Date();
  const fechaEvento = new Date(evento.fecha);

  const diferenciaEnMilisegundos = fechaEvento.getTime() - ahora.getTime();
  const unaHoraEnMilisegundos = 60 * 60 * 1000;

  return diferenciaEnMilisegundos > 0 && diferenciaEnMilisegundos <= unaHoraEnMilisegundos;
}
}
