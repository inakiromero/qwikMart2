import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../productos.service';
import { Producto } from './producto.model';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductoComponent implements OnInit {
  productos: Producto[] = [];
  producto: Producto = { id: 0, nombre: '', categoria: '', precio: 0, stock: 0 };

  criterioBusqueda: Partial<Producto> = { id: undefined, nombre: '', categoria: '' };

  constructor(private productoService: ProductoService) {}

  ngOnInit() {
    this.listarProductos();
  }

  listarProductos() {
    this.productoService.obtenerProductos().subscribe(
      (productos) => (this.productos = productos),
      (error) => console.error('Error al obtener productos:', error)
    );
  }

  agregarProducto() {
    // Clonamos el producto sin el campo `id` para dejar que el backend genere uno nuevo
    const nuevoProducto = { ...this.producto };
  
    this.productoService.agregarProducto(nuevoProducto).subscribe(
      (productoCreado) => {
        this.listarProductos(); // Actualiza la lista de productos
        this.resetForm(); // Limpia el formulario después de agregar
      },
      (error) => console.error('Error al agregar producto:', error)
    );
  }
  modificarProducto() {
    if (this.producto.id) {
      this.productoService.modificarProducto(this.producto.id, this.producto).subscribe(
        () => this.listarProductos(),
        (error) => console.error('Error al modificar producto:', error)
      );
    } else {
      console.error('Error: El producto debe tener un ID para ser modificado.');
    }
  }

  eliminarProducto(id: number) {
    this.productoService.eliminarProducto(id).subscribe(
      () => this.listarProductos(),
      (error) => console.error('Error al eliminar producto:', error)
    );
  }

  buscarProductos() {
    this.productoService.buscarProductos(this.criterioBusqueda).subscribe(
      (productos) => (this.productos = productos),
      (error) => console.error('Error al buscar productos:', error)
    );
  }

  resetForm() {
    this.producto = { id: 0, nombre: '', categoria: '', precio: 0, stock: 0 };
  }
}