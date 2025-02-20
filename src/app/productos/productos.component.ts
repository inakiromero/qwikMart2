import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../service/product/product/productos.service';
import { Producto } from './producto.model';
import { AuthService } from '../service/product/Auth/usarios.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmacionDialogoComponent } from '../shared/components/confirmacion-dialogo/confirmacion-dialogo.component';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductoComponent implements OnInit {
  productos: Producto[] = [];
  producto: Producto = {
   nombre: '', categoria: '', precio: 0, stock: 0,
    id_Usuario: ''
  };
  productoSeleccionado: Producto | null = null;
  limiteMinimoStock = 6; 
  productosConStockBajo: Producto[] = [];
  

  criterioBusqueda: Partial<Producto> = { id: undefined, nombre: '', categoria: '' };

  constructor(private productoService: ProductoService, private authService: AuthService, private dialog: MatDialog) {}

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
      const idUsuario = this.authService.obtenerToken();
      if (!idUsuario) {
        console.error('Error: No se pudo obtener el ID del usuario desde el token.');
        return;
      }
  
      this.productoService.buscarProductoPorNombreYUsuario(this.producto.nombre, idUsuario).subscribe({
        next: (productosConNombre) => {
          if (productosConNombre.length > 0) {
            console.error('Error: Ya existe un producto con el mismo nombre para este usuario.');
            return;
          }
  
          const nuevoProducto = { ...this.producto };
          delete nuevoProducto.id; // Eliminar el ID antes de enviar la solicitud
  
          this.productoService.agregarProducto(nuevoProducto).subscribe({
            next: (productoCreado) => {
              if (productoCreado.id) {
                this.listarProductos();
                this.resetForm();
              } else {
                console.error('Error: El producto creado no tiene un ID válido.');
              }
            },
            error: (error) => console.error('Error al agregar producto:', error),
          });
        },
        error: (error) => console.error('Error al buscar producto por nombre:', error),
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
      if (!this.productoSeleccionado.id)
        {
          console.log("error al seleccionar producto")
          return
        }
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
    if (!producto.id) {
      console.log("Error al seleccionar producto");
      return;
    }
  
    const dialogRef = this.dialog.open(ConfirmacionDialogoComponent, {
      width: '350px',
      data: { mensaje: '¿Estás seguro de que quieres eliminar este producto?' }
    });
  
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado && producto.id) {
        this.productoService.eliminarProducto(producto.id).subscribe({
          next: () => this.listarProductos(),
          error: (error) => console.error('Error al eliminar producto:', error)
        });
      }
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
    const idUsuario = this.authService.obtenerToken(); 
  if (!idUsuario) {
    console.error('El usuario no está autenticado.');
    return;
  }
    if (this.productoId && this.cantidadStock > 0) {
      this.productoService.obtenerProductoPorId(this.productoId,idUsuario).subscribe({
        next: (producto) => {
          const nuevoStock = producto.stock + this.cantidadStock;
          this.productoService.actualizarStock(this.productoId, nuevoStock,idUsuario).subscribe({
            next: () => {
              console.log(`Stock actualizado para el producto ID ${this.productoId}`);
              this.listarProductos();
              this.productoId = '';
              this.cantidadStock = 0;
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