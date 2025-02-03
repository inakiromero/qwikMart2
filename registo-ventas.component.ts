import { Component, OnInit } from '@angular/core';
import { VentasService } from '../service/product/vents/ventas.service';
import { Venta } from '../ventas/venta.model';

@Component({
  selector: 'app-registo-ventas',
  templateUrl: './registo-ventas.component.html',
  styleUrls: ['./registo-ventas.component.css']
})
export class registroVentasComponent implements OnInit {
  ventas: Venta[] = [];
  fechaFiltro = new Date().toISOString().split('T')[0];
  ;

  constructor(private ventasService: VentasService) {}

  ngOnInit(): void {
    this.obtenerVentas();
  }

  obtenerVentas(): void {
    this.ventasService.obtenerVentasPorUsuario().subscribe({
      next: (ventas) => (this.ventas = ventas),
      error: (err) => console.error('Error al obtener ventas:', err),
    });
  }

  filtrarPorFecha(): void {
    this.ventasService.obtenerVentasDelDia(this.fechaFiltro).subscribe(
      (data: Venta[]) => {
        this.ventas = data;
      },
      (error) => {
        console.error('Error al filtrar las ventas', error);
      }
    );
  }
}
