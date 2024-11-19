import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ProductoComponent } from './productos/productos.component';
import { VentasComponent } from './ventas/ventas.component';
import { NavbarComponent } from './navbar/navbar.component'; 
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { CierreDiarioComponent } from './cierre-diario/cierre-diario.component';
import { LoginComponent } from './usuarios/login/login.component';
import { RegistroComponent } from './usuarios/registro/registro.component';

import { AuthGuard } from './guard/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'productos', component: ProductoComponent, canActivate: [AuthGuard] },
  { path: 'ventas', component: VentasComponent, canActivate: [AuthGuard] }, 
  { path: 'proveedores', component: ProveedoresComponent, canActivate: [AuthGuard] },
  { path: 'cierre-diarios', component: CierreDiarioComponent, canActivate: [AuthGuard] }
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
    RegistroComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    AuthGuard, // Proveedor del guard
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
