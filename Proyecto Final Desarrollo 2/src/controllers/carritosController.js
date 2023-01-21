import CustomError from "../models/CustomMsg.class.js";
import RepoCarrito from '../repositories/repoCarrito.js';




const carritoDB = await new RepoCarrito();

class CarritoController {

    obtenerCarritos = async (req, res) => {
        try {
            let docs =  await carritoDB.getAll();  
          //  console.log('Controll ',docs);

          res.json({metodo: 'Metodo obtener carritos', data: docs});
         
        } catch (error) {
          //  console.log(error)
             throw new CustomError(500, 'Error en Metodo obtenerProductos', error);
        }
    }

   crearCarrito = async (req, res) => {
        try {
            let docs =  await carritoDB.add(req.body.username); //Temporario luego lo crea al crearse nuevo usuario
        
            res.json({metodo: 'Carrito creado', id: docs});
        } catch (error) {
         //   console.log(error)
             throw new CustomError(500, 'Error en Metodo obtenerProducto', error);
        }
    }

    obtenerCarrito = async (req, res) => {
        try {
            let docs =  await carritoDB.getById(req.params.idName);  //ID es el nombre de usuario
            res.json({metodo: 'Metodo obtener carritos por ID', data: docs});
        } catch (error) {
          //  console.log(error)
             throw new CustomError(500, 'Error en Metodo obtenerProductos', error);
        }
    }


    borrarCarrito = async (req, res) => {
        try {
            let docs =  await carritoDB.removeById(req.params.id);
        
            res.json({metodo: 'Carrito borrado', id: docs});
        } catch (error) {
         //   console.log(error)
             throw new CustomError(500, 'Error en Metodo obtenerProducto', error);
        }
    }

    
    guardarProductoCarrito = async (req, res) => {
        try {
          
            let doc = await carritoDB.addProducto(req.body,req.params.idName);
            res.json({metodo: 'Producto agregado al carrito', data: {...doc}})
         
        } catch (error) {
            console.log(error)
            throw new CustomError(500, 'Error en Metodo guardarProducto', error);
        }
    }


    borrarProducto = async (req, res) => {
        try {
            let doc = await carritoDB.removeProduct(req.params.idName,req.params.idProd);
            res.json({metodo: 'Metodo borrar Producto del carrito', data: {...doc}})
        } catch (error) {
            throw new CustomError(500, 'Error en Metodo borrarProducto', error);
        }
    }

    actualizarProducto = async (req, res) => {
        try {
       
            let doc = await carritoDB.updateProducto(req.params.idName,req.params.idProd,req.body)
            res.json({metodo: 'Metodo actualizar producto', data: {doc}})
        } catch (error) {
     //       console.log(error)
            throw new CustomError(500, 'Error en Metodo actualizarProducto', error);
        }
    }


  
  
}

export default CarritoController;


