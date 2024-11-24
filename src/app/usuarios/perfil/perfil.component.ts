import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/product/Auth/usarios.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  elUsuario: any = {}; // Usuario actual
  enEdicion = false; // Controla si está en modo edición

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.cargarUsuario();
  }

  cargarUsuario(): void {
    this.authService.obtenerUsuarioActual().subscribe((usuario) => {
      if (usuario) {
        this.elUsuario = usuario;
      } else {
        alert('No se encontró un usuario autenticado. Por favor, inicie sesión.');
        this.cerrarSesion();
      }
    });
  }

  habilitarEdicion(): void {
    this.enEdicion = true;
  }

  actualizarUsuario(): void {
    this.authService.actualizarUsuario(this.elUsuario).subscribe({
      next: () => {
        alert('Usuario actualizado con éxito');
        this.enEdicion = false;
      },
      error: () => alert('Error al actualizar usuario'),
    });
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/productos']);
  }
}
