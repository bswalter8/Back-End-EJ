import CustomError from "../errors/CustomError.class.js";
import RepoCarrito from '../repositories/repoCarrito.js';




const carritoDB = await new RepoCarrito();

class CarritoController {

    obtenerCarritos = async ctx => {
        try {
            let docs =  await carritoDB.getAll();  
          //  console.log('Controll ',docs);

            ctx.body = docs;
        } catch (error) {
          //  console.log(error)
             throw new CustomError(500, 'Error en Metodo obtenerProductos', error);
        }
    }

    crearCarrito = async  ctx => {
        try {
          
            let doc = await productosDB.add(ctx.request.body);
            ctx.body = {metodo: 'Carrito creado', id: docs}
         
        } catch (error) {
         //   console.log(error)
            throw new CustomError(500, 'Error en Metodo guardarProducto', error);
        }
    }

    obtenerCarrito = async ctx => {
        try {
            let docs =  await carritoDB.getById(ctx.params.id);  //ID es el nombre de usuario
            ctx.body = docs;
        } catch (error) {
          //  console.log(error)
             throw new CustomError(500, 'Error en Metodo obtenerProductos', error);
        }
    }



    borrarCarrito = async ctx => {
        try {
            let docs =  await carritoDB.removeById(ctx.params.id);
        
            ctx.body = {metodo: 'Metodo borrar Carrito', data: {...doc}}
        } catch (error) {
         //   console.log(error)
             throw new CustomError(500, 'Error en Metodo obtenerProducto', error);
        }
    }

    
    guardarProductoCarrito = async ctx => {
        try {
          
            let doc = await carritoDB.addProducto(ctx.request.body,ctx.params.idName);
            ctx.body = {metodo: 'Producto agregado al carrito', data: {...doc}}
         
        } catch (error) {
            console.log(error)
            throw new CustomError(500, 'Error en Metodo guardarProducto', error);
        }
    }


    borrarProducto = async ctx => {
        try {
            let doc = await carritoDB.removeProduct(ctx.params.idName,ctx.params.idProd);
            ctx.body = {metodo: 'Metodo borrar Producto del carrito', data: {...doc}}
        } catch (error) {
            throw new CustomError(500, 'Error en Metodo borrarProducto', error);
        }
    }
/* 
    actualizarProducto = async (req, res) => {
        try {
            let doc = await productosDB.set(req.body,req.params.id);
            res.json({metodo: 'Metodo actualizaNoticia', data: {...doc}})
        } catch (error) {
     //       console.log(error)
            throw new CustomError(500, 'Error en Metodo actualizarProducto', error);
        }
    }
*/

  
  
}

export default CarritoController;


