import { Component, OnInit } from '@angular/core';
import { Proveedor } from './proveedor.model';
import { ProveedoresService } from '../service/product/proveers/proveedores.service'
import { MatDialog } from '@angular/material/dialog';
import { ConfirmacionDialogoComponent } from '../shared/components/confirmacion-dialogo/confirmacion-dialogo.component';
@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  proveedores: Proveedor[] = [];
  proveedor: Proveedor = {
    nombre: '', email: '', telefono: '', detalle: '',
    id: '',
    id_Usuario: ''
  };
  proveedorSeleccionado: Proveedor | null = null;

  constructor(private proveedoresService: ProveedoresService, private dialog: MatDialog) {}

  ngOnInit() {
    this.listarProveedores();
  }

  listarProveedores() {
    this.proveedoresService.obtenerProveedores().subscribe({
      next: (proveedores) => (this.proveedores = proveedores),
      error: (error) => console.error('Error al listar proveedores:', error),
    });
  }

  agregarProveedor() {
    const { id, ...nuevoProveedor } = this.proveedor; // Excluye el campo `id` si existe.
    this.proveedoresService.agregarProveedor(nuevoProveedor).subscribe({
      next: (proveedorCreado) => {
        this.proveedores.push(proveedorCreado);
        this.resetForm(); // Limpia el formulario después de agregar
      },
      error: (error) => console.error('Error al agregar proveedor:', error),
    });
  }

  abrirModalEditar(proveedor: Proveedor) {
    this.proveedorSeleccionado = { ...proveedor }; // Clonar el proveedor seleccionado
  }

  guardarCambios() {
    if (this.proveedorSeleccionado && this.proveedorSeleccionado.id && this.proveedorSeleccionado.id_Usuario) {
      this.proveedoresService.modificarProveedor(this.proveedorSeleccionado.id, this.proveedorSeleccionado,this.proveedorSeleccionado.id_Usuario).subscribe({
        next: () => {
          this.listarProveedores();
          this.cerrarModal();
        },
        error: (error) => console.error('Error al modificar proveedor:', error),
      });
    }
  }

  eliminarProveedor(id: string): void {
    const dialogRef = this.dialog.open(ConfirmacionDialogoComponent, {
      width: '350px',
      data: { mensaje: '¿Estás seguro de que quieres eliminar este proveedor?' }
    });
  
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.proveedoresService.eliminarProveedor(id).subscribe({
          next: () => this.listarProveedores(),
          error: (error) => console.error('Error al eliminar proveedor:', error)
        });
      }
    });
  }

  resetForm() {
    this.proveedor = { nombre: '', email: '', telefono: '', detalle: '',id:'', id_Usuario:'' };// Restablece el formulario a su estado inicial
  }

  cerrarModal() {
    this.proveedorSeleccionado = null;
  }
  isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
