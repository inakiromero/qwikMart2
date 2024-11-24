import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { Usuario } from '../../../usuarios/usuario.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiURL = 'http://localhost:3000/usuarios'; 
  private tokenKey = 'authToken';
  private usuarioActual: Usuario | null = null;
  

  constructor(private http: HttpClient) {}

  registrarUsuario(usuario: Usuario): Observable<any> {
    return this.http.get<Usuario[]>(this.apiURL).pipe(
      map((usuarios) => {
        const existeUsuario = usuarios.some(
          (u) =>
            u.email === usuario.email || u.cuit === usuario.cuit || u.nombreMercado === usuario.nombreMercado
        );

        if (existeUsuario) {
          return throwError(() => new Error(
            'Ya existe un usuario con el mismo email, CUIT o nombre del mercado.'
          ));
        }
        return usuario;
      }),
      switchMap(() => this.http.post<Usuario>(this.apiURL, usuario)),
      catchError((error) => throwError(error))
    );
  }

  iniciarSesion(email: string, password: string): Observable<Usuario> {
    return this.http.get<Usuario[]>(this.apiURL, { params: { email } }).pipe(
      map((usuarios) => {
        const usuario = usuarios.find((u) => u.email === email && u.password === password);
        if (!usuario) {
          throw new Error('Credenciales incorrectas.');
        }
        this.guardarToken(usuario.id);
        this.establecerUsuarioActual(usuario);
        return usuario; 
      }),
      catchError((error) => {
        console.error('Error en iniciar sesión:', error);
        return throwError(() => new Error('Error al iniciar sesión. Por favor, verifica tus credenciales.'));
      })
    );
  }
  
  
  guardarToken(token: string | undefined): void {
    if (token) {
      localStorage.setItem(this.tokenKey, token);
    } else {
      console.error('Intentando guardar un token undefined.');
    }
  }

  establecerUsuarioActual(usuario: Usuario): void {
    this.usuarioActual = usuario;
  }
  obtenerToken(): string | null {
    return localStorage.getItem(this.tokenKey); 
  }
  cerrarSesion(): void {
    localStorage.removeItem(this.tokenKey);
    this.usuarioActual = null;
  }

  obtenerUsuarioActual(): Observable<Usuario | null> {
    const token = this.obtenerToken();
    if (!token) {
      return of(null); 
    }

    if (this.usuarioActual) {
      return of(this.usuarioActual); // Devuelve usuario desde memoria si está cargado.
    }

    return this.http.get<Usuario>(`${this.apiURL}/${token}`).pipe(
      map((usuario) => {
        this.establecerUsuarioActual(usuario);
        return usuario;
      }),
      catchError(() => of(null)) 
    );
  }

  actualizarUsuario(usuario: Usuario): Observable<any> {
    return this.http.put(`${this.apiURL}/${usuario.id}`, usuario).pipe(
      map(() => {
        this.establecerUsuarioActual(usuario); 
        return usuario;
      }),
      catchError((error) => throwError(error))
    );
  }
  verificarToken(): Observable<Usuario | null> {
  const token = this.obtenerToken(); 
  if (!token) {
    return of(null); 
  }

  return this.http.get<Usuario>(`${this.apiURL}/${token}`).pipe(
    map((usuario) => {
      if (usuario) {
        this.establecerUsuarioActual(usuario); // Guardar usuario en memoria
        return usuario;
      }
      return null; 
    }),
    catchError(() => {
      this.cerrarSesion();
      return of(null); 
    })
  );
}


}
