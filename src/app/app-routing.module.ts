import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoComponent } from './productos/productos.component';
import { VentasComponent } from './ventas/ventas.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';

const routes: Routes = [
  
  { path: '', redirectTo: '/productos', pathMatch: 'full' },
  { path: 'productos', component: ProductoComponent },
  { path: 'ventas', component: VentasComponent },
  { path: 'proveedores', component: ProveedoresComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}