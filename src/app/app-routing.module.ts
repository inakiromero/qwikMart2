import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoComponent } from './productos/productos.component';
import { VentasComponent } from './ventas/ventas.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { CierreDiarioComponent } from './cierre-diario/cierre-diario.component';
import { RegistroComponent } from './usuarios/registro/registro.component';
import { PerfilComponent } from './usuarios/perfil/perfil.component';
import { LoginComponent } from './usuarios/login/login.component';
import { AuthGuard } from './guard/auth.guard';
import { CalendarioComponent } from './calendario-component/calendario-component.component';
import { registroVentasComponent } from './registo-ventas/registo-ventas.component';

const routes: Routes = [
  { path: '', redirectTo: '/productos', pathMatch: 'full' },
  { path: 'productos', component: ProductoComponent, canActivate: [AuthGuard] },
  { path: 'ventas', component: VentasComponent, canActivate: [AuthGuard] },
  { path: 'proveedores', component: ProveedoresComponent, canActivate: [AuthGuard] },
  { path: 'cierreDiarios', component: CierreDiarioComponent, canActivate: [AuthGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'calendario', component: CalendarioComponent, canActivate: [AuthGuard] },
  { path: 'registroVentas', component: registroVentasComponent, canActivate: [AuthGuard] },
];




@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}