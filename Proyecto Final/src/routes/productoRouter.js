import express from 'express';
import ProductoController from "../controllers/productosController.js"
import {auth,soloAdmins} from '../controllers/loginController.js'


const controlador = new ProductoController();

const { Router } = express;
const productosRouter = new Router();


productosRouter.get('/', controlador.obtenerProductos);
productosRouter.get('/:id', controlador.obtenerProducto);
productosRouter.get('/categorias/:cat',controlador.obtenerCategoria);
productosRouter.post('/',auth, soloAdmins, controlador.guardarProducto);
productosRouter.post('/img',auth, soloAdmins, controlador.guardarImg);
productosRouter.put('/:id',auth, soloAdmins, controlador.actualizarProducto);
productosRouter.delete('/:id', controlador.borrarProducto);


export {productosRouter}