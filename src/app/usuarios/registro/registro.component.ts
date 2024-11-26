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
    nombreMercado: '', cuit: '', email: '', password: '',
  };
  error: string | null = null;

  constructor(private authService: AuthService) {}

  registrarUsuario(): void {
    this.authService.registrarUsuario(this.usuario).subscribe({
      next: () => {
        alert('Usuario registrado con éxito.');
        this.usuario = { nombreMercado: '', cuit: '', email: '', password: '' }; // Resetea el formulario
        this.error = null;
      },
      error: (err) => {
        this.error = err.message || 'Error al registrar usuario.';
      },
    });
  }
  
}