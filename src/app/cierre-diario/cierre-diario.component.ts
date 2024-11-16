import { Component, OnInit } from '@angular/core';
import { VentasService } from '../service/product/vents/ventas.service';
import { Venta } from '../ventas/venta.model';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-cierre-diario',
  templateUrl: './cierre-diario.component.html',
  styleUrls: ['./cierre-diario.component.css'],
})
export class CierreDiarioComponent implements OnInit {
  fechaHoy = new Date().toISOString().split('T')[0];
  ventasDelDia: Venta[] = [];
  totalIngresos: number = 0;
  desglosePorProducto: { [key: string]: { cantidad: number; ingresos: number } } = {};

  constructor(private ventasService: VentasService) {}

  ngOnInit() {
    this.obtenerVentasDelDia();
  }

  obtenerVentasDelDia() {
    this.ventasService.obtenerVentasDelDia(this.fechaHoy).subscribe({
      next: (ventas) => {
        this.ventasDelDia = ventas;
        this.calcularResumen();
      },
      error: (error) => console.error('Error al obtener ventas del día:', error),
    });
  }

  calcularResumen() {
    this.totalIngresos = 0;
    this.desglosePorProducto = {};

    this.ventasDelDia.forEach((venta) => {
      this.totalIngresos += venta.total;

      venta.items.forEach((item) => {
        if (!this.desglosePorProducto[item.nombre]) {
          this.desglosePorProducto[item.nombre] = { cantidad: 0, ingresos: 0 };
        }
        this.desglosePorProducto[item.nombre].cantidad += item.cantidad;
        this.desglosePorProducto[item.nombre].ingresos += item.cantidad * item.precio;
      });
    });
  }

  exportarPDF() {
    const doc = new jsPDF();
  
    // Título del informe
    const fecha = new Date().toLocaleDateString();
    doc.text(`Cierre Diario - ${fecha}`, 10, 10);
  
    // Datos de la tabla
    const data = Object.keys(this.desglosePorProducto || {}).map((nombre) => {
      const { cantidad, ingresos } = this.desglosePorProducto[nombre];
      return [nombre, cantidad, ingresos.toFixed(2)];
    });
  
    // Genera la tabla
    doc.autoTable({
      head: [['Producto', 'Cantidad Vendida', 'Ingresos']],
      body: data,
    });
  
    // Total de ingresos
    const finalY = doc.lastAutoTable.finalY || 20; // Posición para el texto final
    doc.text(`Total Ingresos: ${this.totalIngresos.toFixed(2)} €`, 10, finalY + 10);
  
    // Guarda el archivo
    doc.save(`CierreDiario-${fecha}.pdf`);
  }
}
