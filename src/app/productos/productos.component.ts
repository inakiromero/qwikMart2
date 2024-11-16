import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../service/product/product/productos.service';
import { Producto } from './producto.model';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductoComponent implements OnInit {
  productos: Producto[] = [];
  producto: Producto = { id: 0, nombre: '', categoria: '', precio: 0, stock: 0 };
  productoSeleccionado: Producto | null = null;
  limiteMinimoStock = 6; 
  productosConStockBajo: Producto[] = [];

  criterioBusqueda: Partial<Producto> = { id: undefined, nombre: '', categoria: '' };

  constructor(private productoService: ProductoService) {}

  ngOnInit() {
    this.listarProductos();
  }

  listarProductos() {
    this.productoService.obtenerProductos().subscribe({
      next: (productos) => {
        this.productos = productos
        this.verificarStockBajo();
      },
      error: (error) => console.error('Error al obtener productos:', error)
    });
  }

  agregarProducto() {
    if (this.formularioValido()) {
      this.productoService.agregarProducto(this.producto).subscribe({
        next: (productoCreado) => {
          this.productos.push(productoCreado);
          this.resetForm();
        },
        error: (error) => console.error('Error al agregar producto:', error),
      });
    } else {
      console.error('Error: Complete todos los campos correctamente.');
    }
  }
  verificarStockBajo() {
    this.productosConStockBajo = this.productos.filter(
      (producto) => producto.stock < this.limiteMinimoStock
    );

    if (this.productosConStockBajo.length > 0) {
      console.warn('Productos con stock bajo:', this.productosConStockBajo);
    }
  }

  formularioValido(): boolean {
    return (
      this.producto.id > 0 &&
      this.producto.nombre.trim() !== '' &&
      this.producto.categoria.trim() !== '' &&
      this.producto.precio > 0 &&
      this.producto.stock >= 0
    );
  }
  
  abrirModalEditar(producto: Producto) {
    this.productoSeleccionado = { ...producto }; 
  }

  guardarCambios() {
    if (this.productoSeleccionado) {
      this.productoService.modificarProducto(this.productoSeleccionado.id, this.productoSeleccionado).subscribe({
        next: () => {
          this.listarProductos();
          this.cerrarModal();
        },
        error: (error) => console.error('Error al modificar producto:', error),
      });
    }
  }
  
  eliminarProducto(id: number) {
    this.productoService.eliminarProducto(id).subscribe({
      next: () => this.listarProductos(),
      error: (error) => console.error('Error al eliminar producto:', error)
    });
  }
  cerrarModal() {
    this.productoSeleccionado = null;
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

  productoId: number = 0;
 cantidadStock: number = 0;
  cargarStock() {
    if (this.productoId && this.cantidadStock > 0) {
      this.productoService.obtenerProductoPorId(this.productoId).subscribe({
        next: (producto) => {
          const nuevoStock = producto.stock + this.cantidadStock;
          this.productoService.actualizarStock(this.productoId, nuevoStock).subscribe({
            next: () => {
              console.log(`Stock actualizado para el producto ID ${this.productoId}`);
              this.listarProductos(); // Refrescar la lista de productos
            },
            error: (error) => console.error('Error al actualizar stock:', error),
          });
        },
        error: (error) => console.error('Producto no encontrado:', error),
      });
    } else {
      console.error('ID del producto o cantidad inválida');
    }
  }
}