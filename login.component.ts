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
      next: () => {
        this.router.navigate(['/productos']);
      },
    });

  }
}
