import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/product/Auth/usarios.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  iniciarSesion() {
    this.authService.iniciarSesion(this.email, this.password).subscribe({
      next: (usuarios) => {
        if (usuarios.length > 0) {
          // Usuario encontrado
          const usuario = usuarios[0];
          this.authService.guardarToken(usuario.id); // Guardamos el ID como "token"
          alert('Inicio de sesión exitoso');
          this.router.navigate(['/productos']); // Redirigir a la página principal
        } else {
          alert('Correo o contraseña incorrectos');
        }
      },
      error: (err) => console.error('Error al iniciar sesión:', err),
    });
  }
}
