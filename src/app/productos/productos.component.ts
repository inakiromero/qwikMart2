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
    this.productoService.obtenerProductos().subscribe({
      next: (productos) => this.productos = productos,
      error: (error) => console.error('Error al obtener productos:', error)
    });
  }

  agregarProducto() {
    const { id, ...nuevoProducto } = this.producto; // Excluir `id` del nuevo producto
  
    this.productoService.agregarProducto(nuevoProducto).subscribe({
      next: (productoCreado) => {
        this.productos.push(productoCreado);  // Agrega el producto creado con el ID asignado por el backend
        this.resetForm();
      },
      error: (error) => console.error('Error al agregar producto:', error),
    });
  }
  modificarProducto() {
    if (this.producto.id && this.producto.id > 0) {
      this.productoService.modificarProducto(this.producto.id, this.producto).subscribe({
        next: () => this.listarProductos(),
        error: (error) => console.error('Error al modificar producto:', error)
      });
    } else {
      console.error('Error: El producto debe tener un ID válido para ser modificado.');
    }
  }
  
  eliminarProducto(id: number) {
    this.productoService.eliminarProducto(id).subscribe({
      next: () => this.listarProductos(),
      error: (error) => console.error('Error al eliminar producto:', error)
    });
  }
  
  buscarProductos() {
    this.productoService.buscarProductos(this.criterioBusqueda).subscribe({
      next: (productos) => {
        this.productos = productos;
        this.criterioBusqueda = { id: undefined, nombre: '', categoria: '' };
      },
      error: (error) => console.error('Error al buscar productos:', error)
    });
  }
  
  resetForm() {
    this.producto = { id: 0, nombre: '', categoria: '', precio: 0, stock: 0 };
  }
}