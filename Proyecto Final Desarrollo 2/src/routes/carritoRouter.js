import express from 'express';
import CarritoController from "../controllers/carritosController.js"
import {auth} from '../controllers/loginController.js'


const controlador = new CarritoController();

const { Router } = express;
const carritoRouter = new Router();


carritoRouter.get('/', controlador.obtenerCarritos);
carritoRouter.post('/', controlador.crearCarrito);
carritoRouter.delete('/:id', controlador.borrarCarrito);

carritoRouter.get('/:idName/productos', auth, controlador.obtenerCarrito);
carritoRouter.post('/:idName/productos', controlador.guardarProductoCarrito);
carritoRouter.put('/:idName/productos/:idProd', controlador.actualizarProducto); 
carritoRouter.delete('/:idName/productos/:idProd', controlador.borrarProducto); 


export {carritoRouter}