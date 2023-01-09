import express from 'express';
import ProductoController from "../controllers/productosController.js"
const controlador = new ProductoController();

const { Router } = express;
const productosRouter = new Router();


productosRouter.get('/', controlador.obtenerProductos);
productosRouter.get('/:id?', controlador.obtenerProducto);
productosRouter.post('/', controlador.guardarProducto);
productosRouter.put('/:id', controlador.actualizarProducto);
productosRouter.delete('/:id', controlador.borrarProducto);


export {productosRouter}