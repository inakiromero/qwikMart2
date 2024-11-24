import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { AuthService } from '../service/product/Auth/usarios.service'; 

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    const token = this.authService.obtenerToken();
    if (!token) {
      return of(this.router.createUrlTree(['/login'])); // Redirige al login si no hay token
    }
    return this.authService.verificarToken().pipe(
      map((usuarioValido) => {
        if (usuarioValido) {
          return true; // Usuario válido
        }
        return this.router.createUrlTree(['/login']); // Redirige si el token no es válido
      })
    );
  }
  
}