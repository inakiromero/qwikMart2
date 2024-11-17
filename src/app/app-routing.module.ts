import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoComponent } from './productos/productos.component';
import { VentasComponent } from './ventas/ventas.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { CierreDiarioComponent } from './cierre-diario/cierre-diario.component';

const routes: Routes = [
  
  { path: '', redirectTo: '/productos', pathMatch: 'full' },
  { path: 'productos', component: ProductoComponent },
  { path: 'ventas', component: VentasComponent },
  { path: 'proveedores', component: ProveedoresComponent },
  {path: 'cierreDiarios', component: CierreDiarioComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}