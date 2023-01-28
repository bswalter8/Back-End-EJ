import CustomError from "../models/CustomMsg.class.js";
import RepoProductos from '../repositories/repoProductos.js';


const productosDB = await new RepoProductos();

class ProductoController {
    obtenerProductos = async (req, res) => {
        try {
            let docs =  await productosDB.getAll();  
          //  console.log('Controll ',docs);

           // res.json({metodo: 'Metodo obtenerProducto', data: docs});
           res.json( docs);
        } catch (error) {
          //  console.log(error)
             throw new CustomError(500, 'Error en Metodo obtenerProductos', error);
        }
    }

    obtenerCategoria = async (req, res) => {
        try {
       
          let docs =  await productosDB.getByCategoria(req.params.cat);  
          //  console.log('Controll ',docs);

           // res.json({metodo: 'Metodo obtenerProducto', data: docs});
         
           res.json( docs);
        } catch (error) {
          //  console.log(error)
             throw new CustomError(500, 'Error en Metodo obtenerProductos', error);
        }
    }

    obtenerProducto = async (req, res) => {
        try {
            let docs =  await productosDB.getById(req.params.id); 

            res.json({metodo: 'Metodo obtener Producto por ID', data: docs});
        } catch (error) {
         //   console.log(error)
             throw new CustomError(500, 'Error en Metodo obtenerProducto', error);
        }
    }

    guardarProducto = async (req, res) => {
        try {
          
            let doc = await productosDB.add(req.body);
            res.json({metodo: 'Metodo guardar Producto', data: {...doc}})
         
        } catch (error) {
         //   console.log(error)
            throw new CustomError(500, 'Error en Metodo guardarProducto', error);
        }
    }


    borrarProducto = async (req, res) => {
        try {
            let doc = await productosDB.removeById(req.params.id);
            res.json({metodo: 'Metodo borrar Producto', data: {...doc}})
        } catch (error) {
            throw new CustomError(500, 'Error en Metodo borrarProducto', error);
        }
    }

    actualizarProducto = async (req, res) => {
        try {
            let doc = await productosDB.set(req.body,req.params.id);
            res.json({metodo: 'Metodo actualizaNoticia', data: {...doc}})
        } catch (error) {
     //       console.log(error)
            throw new CustomError(500, 'Error en Metodo actualizarProducto', error);
        }
    }

  
}

export default ProductoController;


