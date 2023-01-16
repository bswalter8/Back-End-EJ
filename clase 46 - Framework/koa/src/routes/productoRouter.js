import koaRouter from 'koa-router';
import ProductoController from "../controllers/productosController.js"
const controlador = new ProductoController();


const productosRouter  = new koaRouter({
    prefix: '/api/productos'
});

productosRouter.get('/',controlador.obtenerProductos)


productosRouter.get('/:id', controlador.obtenerProducto)



productosRouter.post('/', controlador.guardarProducto);
productosRouter.put('/:id', controlador.actualizarProducto);
productosRouter.delete('/:id', controlador.borrarProducto);


export default productosRouter