import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';
import { Usuario } from '../../../usuarios/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiURL = 'http://localhost:3000'; 
  private tokenKey = 'authToken';
  private usuarioActual: any = null;

  constructor(private http: HttpClient) {}

  registrarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.get<Usuario[]>(`${this.apiURL}/usuarios`).pipe(
      map((usuarios) => {
        const maxId = usuarios.length > 0
          ? Math.max(...usuarios.map((u) => parseInt(u.id || '0', 10)))
          : 0;
  
        usuario.id = (maxId + 1).toString();
  
        return usuario;
      }),
      switchMap((usuarioConId) =>
        this.http.post<Usuario>(`${this.apiURL}/usuarios`, usuarioConId)
      )
    );
  }

  iniciarSesion(email: string, password: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiURL}/usuarios`, {
      params: { email, password },
    });
  }

  guardarToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  obtenerToken(): string | null {
    return localStorage.getItem(this.tokenKey);

  }

  cerrarSesion(): void {
    localStorage.removeItem(this.tokenKey); 
   }
   obtenerUsuarioActual() {
    return this.usuarioActual;
  }

  establecerUsuarioActual(usuario: any) {
    this.usuarioActual = usuario;
  }

  actualizarUsuario(usuario: any): Observable<any> {
    return this.http.put(`${this.apiURL}/${usuario.id}`, usuario);
  }

}
