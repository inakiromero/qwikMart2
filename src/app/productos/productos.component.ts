import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../service/product/product/productos.service';
import { Producto } from './producto.model';
import { AuthService } from '../service/product/Auth/usarios.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductoComponent implements OnInit {
  productos: Producto[] = [];
  producto: Producto = {
    id: '', nombre: '', categoria: '', precio: 0, stock: 0,
    id_Usuario: ''
  };
  productoSeleccionado: Producto | null = null;
  limiteMinimoStock = 6; 
  productosConStockBajo: Producto[] = [];
  

  criterioBusqueda: Partial<Producto> = { id: undefined, nombre: '', categoria: '' };

  constructor(private productoService: ProductoService, private authService: AuthService) {}

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
      const idUsuario = this.authService.obtenerToken(); // Obtén el ID del usuario actual
  
      if (!idUsuario) {
        console.error('Error: No se pudo obtener el ID del usuario desde el token.');
        return;
      }
  
      this.producto.id_Usuario = idUsuario; // Asigna el ID del usuario al producto
  
      // Validación de ID único para este usuario
      this.productoService.buscarProductoPorIdYUsuario(this.producto.id, idUsuario).subscribe({
        next: (productosConId) => {
          if (productosConId.length > 0) {
            console.error('Error: Ya existe un producto con el mismo ID para este usuario.');
            return;
          }
  
          // Validación de nombre único para este usuario
          this.productoService.buscarProductoPorNombreYUsuario(this.producto.nombre, idUsuario).subscribe({
            next: (productosConNombre) => {
              if (productosConNombre.length > 0) {
                console.error('Error: Ya existe un producto con el mismo nombre para este usuario.');
                return;
              }
  
              // Si pasa las validaciones, agregar producto
              this.productoService.agregarProducto(this.producto).subscribe({
                next: (productoCreado) => {
                  this.productos.push(productoCreado);
                  this.resetForm();
                },
                error: (error) => console.error('Error al agregar producto:', error),
              });
            },
            error: (error) => console.error('Error al buscar producto por nombre:', error),
          });
        },
        error: (error) => console.error('Error al buscar producto por ID:', error),
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
      parseInt(this.producto.id) > 0 &&
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
      this.productoService.modificarProducto( this.productoSeleccionado.id , this.productoSeleccionado).subscribe({
        next: () => {
          this.listarProductos();
          this.cerrarModal();
        },
        error: (error) => console.error('Error al modificar producto:', error),
      });
    }
  }
  
  eliminarProducto(producto: Producto) {
    this.productoService.eliminarProducto(producto.id).subscribe({
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
    this.producto = { id: '', nombre: '', categoria: '', precio: 0, stock: 0,id_Usuario:'' };
  }

  productoId: string = '';
 cantidadStock: number = 0;
  cargarStock() {
    if (this.productoId && this.cantidadStock > 0) {
      this.productoService.obtenerProductoPorId(this.productoId).subscribe({
        next: (producto) => {
          const nuevoStock = producto.stock + this.cantidadStock;
          this.productoService.actualizarStock(this.productoId, nuevoStock).subscribe({
            next: () => {
              console.log(`Stock actualizado para el producto ID ${this.productoId}`);
              this.listarProductos();
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