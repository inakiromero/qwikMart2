import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ProductoComponent } from './productos/productos.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { VentasComponent } from './ventas/ventas.component';
import { NavbarComponent } from './navbar/navbar.component'; 
import{ProveedoresComponent} from './proveedores/proveedores.component'

const routes: Routes = [
  { path: '', redirectTo: '/productos', pathMatch: 'full' },
  { path: 'productos', component: ProductoComponent },
  { path: 'ventas', component: VentasComponent }, 
  {path: 'proveedores', component: ProveedoresComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    ProductoComponent,
    VentasComponent,
    NavbarComponent,
    ProveedoresComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [provideHttpClient(withFetch())],
  bootstrap: [AppComponent]
})
export class AppModule {}