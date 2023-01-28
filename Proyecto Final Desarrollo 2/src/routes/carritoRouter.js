import express from 'express';
import CarritoController from "../controllers/carritosController.js"
import {auth,soloAdmins} from '../controllers/loginController.js'


const controlador = new CarritoController();

const { Router } = express;
const carritoRouter = new Router();


carritoRouter.get('/', auth, soloAdmins, controlador.obtenerCarritos);
carritoRouter.post('/',  auth, soloAdmins, controlador.crearCarrito);
carritoRouter.delete('/:id',  auth, soloAdmins, controlador.borrarCarrito);

carritoRouter.post('/:id/checkout', auth,controlador.checkOutPost );
carritoRouter.get('/:id/productos', auth,controlador.obtenerCarrito);
carritoRouter.post('/:id/productos', auth,controlador.guardarProductoCarrito);
carritoRouter.put('/:id/productos/:idProd', auth,controlador.actualizarProducto); 
carritoRouter.delete('/:id/productos/:idProd', auth,controlador.borrarProducto); 



export {carritoRouter}