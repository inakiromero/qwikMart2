import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { ProductoComponent } from './productos/productos.component';
import { VentasComponent } from './ventas/ventas.component';
import { NavbarComponent } from './navbar/navbar.component'; 
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { CierreDiarioComponent } from './cierre-diario/cierre-diario.component';
import { LoginComponent } from './usuarios/login/login.component';
import { RegistroComponent } from './usuarios/registro/registro.component';
import { CalendarioComponent } from './calendario-component/calendario-component.component';
import { registroVentasComponent } from './registo-ventas/registo-ventas.component';

import { AuthGuard } from './guard/auth.guard';
import { PerfilComponent } from './usuarios/perfil/perfil.component';
import { ConfirmacionDialogoComponent } from './shared/components/confirmacion-dialogo/confirmacion-dialogo.component';



const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'productos', component: ProductoComponent, canActivate: [AuthGuard] },
  { path: 'ventas', component: VentasComponent, canActivate: [AuthGuard] }, 
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },
  { path: 'proveedores', component: ProveedoresComponent, canActivate: [AuthGuard] },
  { path: 'cierreDiarios', component: CierreDiarioComponent, canActivate: [AuthGuard] },
  { path: 'calendario', component: CalendarioComponent, canActivate: [AuthGuard] },
  { path: 'registroVentas', component: registroVentasComponent, canActivate: [AuthGuard] }


];

@NgModule({
  declarations: [
    AppComponent,
    ProductoComponent,
    VentasComponent,
    NavbarComponent,
    ProveedoresComponent,
    CierreDiarioComponent,
    LoginComponent,
    RegistroComponent,
    PerfilComponent,
    CalendarioComponent,
    registroVentasComponent,
    ConfirmacionDialogoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    MatDialogModule, // Agregar módulo de diálogos

  ],
  providers: [
    AuthGuard, // Proveedor del guard
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
