import express from 'express';
import CarritoController from "../controllers/carritosController.js"
const controlador = new CarritoController();

const { Router } = express;
const carritoRouter = new Router();


carritoRouter.get('/', controlador.obtenerCarritos);
carritoRouter.post('/', controlador.crearCarrito);
carritoRouter.delete('/:id', controlador.borrarCarrito);

carritoRouter.get('/:idName/productos', controlador.obtenerCarrito);
carritoRouter.post('/:idName/productos', controlador.guardarProductoCarrito);
carritoRouter.delete('/:idName/productos/:idProd', controlador.borrarProducto); 

export {carritoRouter}