import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/product/Auth/usarios.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: any = {}; // Información del usuario

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.cargarUsuario();
  }

  cargarUsuario() {
    this.usuario = this.authService.obtenerUsuarioActual();
  }

  actualizarUsuario() {
    this.authService.actualizarUsuario(this.usuario).subscribe({
      next: () => alert('Usuario actualizado con éxito'),
      error: () => alert('Error al actualizar usuario'),
    });
  }
}
