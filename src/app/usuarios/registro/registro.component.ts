import { Component } from '@angular/core';
import { AuthService } from '../../service/product/Auth/usarios.service';
import { Usuario } from '../usuario.model';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent {
  usuario: Usuario = {
    id: '',
    nombreMercado: '',
    cuit: '',
    email: '',
    password: '',
  };

  constructor(private authService: AuthService) {}

  registrarUsuario() {
    this.authService.registrarUsuario(this.usuario).subscribe({
      next: () => alert('Usuario registrado con éxito'),
      error: (err) => console.error('Error al registrar usuario:', err),
    });
  }
}
