import CustomError from "../errors/CustomError.class.js";
import RepoProductos from '../repositories/repoProductos.js';




const productosDB = await new RepoProductos();

class ProductoController {

    obtenerProductos = async ctx => {
        let docs =  await productosDB.getAll();  
        ctx.body = {
            status: 'success',
            data: docs 
        }
    };
   

    obtenerProducto = async  ctx => {
        let docs =  await productosDB.getById(ctx.params.id); 
      
        if (docs.length) {
          ctx.body = docs
        } else {
          ctx.response.status = 404
          ctx.body = {
            status: 'error!',
            message: 'Book Not Found with that id!',
          }
        }
      }

    guardarProducto = async  ctx => {
        try {
          
            let doc = await productosDB.add(ctx.request.body);
            ctx.body = {metodo: 'Metodo guardar Producto', data: {...doc}}
         
        } catch (error) {
         //   console.log(error)
            throw new CustomError(500, 'Error en Metodo guardarProducto', error);
        }
    }


    borrarProducto = async ctx => {
        try {
            let doc = await productosDB.removeById(ctx.params.id);
            ctx.body = {metodo: 'Metodo borrar Producto', data: {...doc}}
        } catch (error) {
            throw new CustomError(500, 'Error en Metodo borrarProducto', error);
        }
    }

    actualizarProducto = async ctx => {
        try {
            let doc = await productosDB.set(ctx.request.body,ctx.params.id);
            ctx.body = {metodo: 'Metodo actualizaNoticia', data: {...doc}}
        } catch (error) {
     //       console.log(error)
            throw new CustomError(500, 'Error en Metodo actualizarProducto', error);
        }
    }

  
}

export default ProductoController;


