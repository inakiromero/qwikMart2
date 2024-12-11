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
  emailInvalido: boolean = false;


  constructor(private authService: AuthService) {}

  validarEmail(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailInvalido = !emailRegex.test(this.usuario.email);
  }

  registrarUsuario(): void {
    // Verificar que todos los campos estén completados
    if (!this.usuario.nombreMercado || !this.usuario.cuit || !this.usuario.email || !this.usuario.password) {
      this.error = 'Todos los campos son obligatorios.';
      return;
    }
  
    // Validar formato del correo electrónico
    this.validarEmail();
    if (this.emailInvalido) {
      this.error = 'El correo electrónico no tiene un formato válido.';
      return;
    }
  
    this.authService.registrarUsuario(this.usuario).subscribe({
      next: () => {
        alert('Usuario registrado con éxito.');
        this.usuario = { nombreMercado: '', cuit: '', email: '', password: '' }; // Resetear el formulario
        this.error = null;
      },
      error: (err) => {
        this.error = err.message || 'Error al registrar usuario.';
      },
    });
  }
  
  
}